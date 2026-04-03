<script setup lang="ts">
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  ExclamationCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  ReloadOutlined,
  StopFilled,
  SyncOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  approveReleaseOrder,
  buildReleaseOrderLogStreamURL,
  cancelReleaseOrder,
  executeReleaseOrder,
  getReleaseOrderConcurrentBatchProgress,
  getReleaseOrderByID,
  getReleaseOrderPrecheck,
  getReleaseOrderPipelineStageLog,
  listReleaseOrderApprovalRecords,
  listReleaseOrderExecutions,
  listReleaseOrderParams,
  listReleaseOrderValueProgress,
  listReleaseOrderPipelineStages,
  listReleaseOrderSteps,
  rejectReleaseOrder,
  replayReleaseOrderByID,
  rollbackReleaseOrderByID,
  submitReleaseOrderApproval,
} from "../../api/release";
import { useResizableColumns } from "../../composables/useResizableColumns";
import { useAuthStore } from "../../stores/auth";
import type {
  ReleaseOperationType,
  ReleaseOrderApprovalRecord,
  ReleaseOrder,
  ReleaseOrderBusinessStatus,
  ReleaseOrderExecution,
  ReleaseOrderConcurrentBatchProgress,
  ReleaseOrderConcurrentBatchQueueState,
  ReleaseOrderLogStreamEvent,
  ReleaseOrderParam,
  ReleaseOrderPrecheck,
  ReleaseOrderPrecheckItem,
  ReleaseOrderValueProgress,
  ReleaseOrderValueProgressStatus,
  ReleaseOrderPipelineStage,
  ReleaseOrderStatus,
  ReleaseOrderStep,
  ReleasePipelineScope,
  ReleasePipelineStageStatus,
  ReleaseTriggerType,
} from "../../types/release";
import { extractHTTPErrorMessage } from "../../utils/http-error";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const AUTO_REFRESH_INTERVAL_MS = 5000;
// Keep pipeline stages in sync with the main release polling cadence so progress feels responsive.
const PIPELINE_STAGE_REFRESH_INTERVAL_MS = 5000;

type ScopeLogState = {
  text: string;
  offset: number;
  connected: boolean;
  connecting: boolean;
  ended: boolean;
  error: string;
  statusText: string;
  panelRef: HTMLElement | null;
  stream: EventSource | null;
  reconnectTimer: number | null;
  closeIntentional: boolean;
  autoFollow: boolean;
};

function createScopeLogState(): ScopeLogState {
  return {
    text: "",
    offset: 0,
    connected: false,
    connecting: false,
    ended: false,
    error: "",
    statusText: "未连接",
    panelRef: null,
    stream: null,
    reconnectTimer: null,
    closeIntentional: false,
    autoFollow: true,
  };
}

const loading = ref(false);
const querying = ref(false);
const cancelling = ref(false);
const executing = ref(false);
const recovering = ref(false);
const approvalActing = ref(false);
const autoRefreshTimer = ref<number | null>(null);
const executeLocked = ref(false);

const order = ref<ReleaseOrder | null>(null);
const approvalRecords = ref<ReleaseOrderApprovalRecord[]>([]);
const approvalRecordsLoading = ref(false);
const params = ref<ReleaseOrderParam[]>([]);
const valueProgress = ref<ReleaseOrderValueProgress[]>([]);
const steps = ref<ReleaseOrderStep[]>([]);
const executions = ref<ReleaseOrderExecution[]>([]);
const pipelineStages = ref<ReleaseOrderPipelineStage[]>([]);
const precheck = ref<ReleaseOrderPrecheck | null>(null);
const precheckLoading = ref(false);
const pipelineStageModuleVisible = ref(false);
const pipelineStageExecutorType = ref("");
const pipelineStageMessage = ref("");
const pipelineStageLoading = ref(false);
const lastPipelineStageRefreshAt = ref(0);

const stageLogDrawerVisible = ref(false);
const stageLogLoading = ref(false);
const stageLogContent = ref("");
const stageLogHasMore = ref(false);
const stageLogFetchedAt = ref("");
const selectedPipelineStage = ref<ReleaseOrderPipelineStage | null>(null);
const concurrentBatchProgress = ref<ReleaseOrderConcurrentBatchProgress | null>(
  null,
);
const concurrentBatchLoading = ref(false);
const expandedHookVariableMap = reactive<Record<string, boolean>>({});
const expandedHookLogMap = reactive<Record<string, boolean>>({});
const approvalActionModalVisible = ref(false);
const approvalActionMode = ref<"submit" | "approve" | "reject">("submit");
const approvalActionComment = ref("");

const scopeLogStates = reactive<Record<ReleasePipelineScope, ScopeLogState>>({
  ci: createScopeLogState(),
  cd: createScopeLogState(),
});

const orderID = computed(() => String(route.params.id || "").trim());
const currentBusinessStatus = computed<ReleaseOrderBusinessStatus>(() => {
  if (!order.value) {
    return "pending_execution";
  }
  if (order.value.business_status) {
    return order.value.business_status;
  }
  switch (order.value.status) {
    case "draft":
      return "draft";
    case "pending_approval":
      return "pending_approval";
    case "approving":
      return "approving";
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "queued":
      return "queued";
    case "deploying":
      return "deploying";
    case "deploy_success":
    case "success":
      return "deploy_success";
    case "deploy_failed":
    case "failed":
      return "deploy_failed";
    case "running":
      return "deploying";
    case "cancelled":
      return "cancelled";
    default:
      return "pending_execution";
  }
});
const canViewParamSnapshot = computed(() =>
  authStore.hasPermission("release.param_snapshot.view"),
);
const currentUserID = computed(() => String(authStore.profile?.id || "").trim());
const canSubmitApprovalPermission = computed(() =>
  order.value
    ? authStore.hasApplicationPermission("release.approval.submit", order.value.application_id)
    : false,
);
const canExecutePermission = computed(() =>
  order.value
    ? String(order.value.creator_user_id || "").trim() === currentUserID.value
    : false,
);
const isCurrentUserApprover = computed(() => {
  if (!order.value || !currentUserID.value) {
    return false;
  }
  return (order.value.approval_approver_ids || []).includes(currentUserID.value);
});
const showApprovalCard = computed(
  () => Boolean(order.value?.approval_required) || approvalRecords.value.length > 0,
);
const displayApprovalRecords = computed<ReleaseOrderApprovalRecord[]>(() => {
  if (approvalRecords.value.length > 0) {
    return approvalRecords.value;
  }
  if (!order.value) {
    return [];
  }
  const fallbackRecords: ReleaseOrderApprovalRecord[] = [];
  if (order.value.approved_at) {
    fallbackRecords.push({
      id: `synthetic-approve-${order.value.id}`,
      release_order_id: order.value.id,
      action: "approve",
      operator_user_id: "",
      operator_name: String(order.value.approved_by || "").trim() || "系统",
      comment: "",
      created_at: order.value.approved_at,
    });
  }
  if (order.value.rejected_at) {
    fallbackRecords.push({
      id: `synthetic-reject-${order.value.id}`,
      release_order_id: order.value.id,
      action: "reject",
      operator_user_id: "",
      operator_name: String(order.value.rejected_by || "").trim() || "系统",
      comment: String(order.value.rejected_reason || "").trim(),
      created_at: order.value.rejected_at,
    });
  }
  return fallbackRecords;
});
const canSubmitApproval = computed(
  () =>
    Boolean(order.value?.approval_required) &&
    currentBusinessStatus.value === "pending_approval" &&
    canSubmitApprovalPermission.value,
);
const canApproveOrder = computed(
  () =>
    Boolean(order.value?.approval_required) &&
    ["pending_approval", "approving"].includes(currentBusinessStatus.value) &&
    (isCurrentUserApprover.value || authStore.isAdmin),
);
const canRejectOrder = computed(
  () =>
    Boolean(order.value?.approval_required) &&
    ["pending_approval", "approving"].includes(currentBusinessStatus.value) &&
    (isCurrentUserApprover.value || authStore.isAdmin),
);
const canCancel = computed(
  () =>
    currentBusinessStatus.value === "pending_execution" ||
    currentBusinessStatus.value === "pending_approval" ||
    currentBusinessStatus.value === "approving" ||
    currentBusinessStatus.value === "approved" ||
    currentBusinessStatus.value === "queued" ||
    currentBusinessStatus.value === "deploying",
);
const precheckBlocked = computed(
  () => Boolean(precheck.value) && !precheck.value?.executable,
);
const canExecute = computed(
  () =>
    canExecutePermission.value &&
    (currentBusinessStatus.value === "pending_execution" ||
      currentBusinessStatus.value === "approved") &&
    !executeLocked.value &&
    !precheckBlocked.value,
);
const canRollback = computed(
  () =>
    currentBusinessStatus.value === "deploy_success" &&
    String(order.value?.cd_provider || "")
      .trim()
      .toLowerCase() === "argocd",
);
const canReplay = computed(
  () =>
    currentBusinessStatus.value === "deploy_success" &&
    String(order.value?.cd_provider || "")
      .trim()
      .toLowerCase() !== "argocd",
);
const shouldAutoRefresh = computed(() => {
  if (!order.value) {
    return true;
  }
  return [
    "pending_execution",
    "pending_approval",
    "approving",
    "queued",
    "deploying",
    "approved",
  ].includes(currentBusinessStatus.value);
});
const shouldKeepLogStreaming = computed(() => {
  if (!order.value) {
    return true;
  }
  return ["queued", "deploying"].includes(currentBusinessStatus.value);
});
const shouldLoadPrecheck = computed(() => {
  if (!order.value) {
    return false;
  }
  return ["pending_execution", "queued", "deploying"].includes(
    currentBusinessStatus.value,
  );
});
const showPrecheckCard = computed(() => {
  if (precheckLoading.value) {
    return true;
  }
  if (currentBusinessStatus.value === "pending_execution") {
    return true;
  }
  return Boolean(
    (currentBusinessStatus.value === "queued" ||
      currentBusinessStatus.value === "deploying") &&
      precheck.value?.waiting_for_lock,
  );
});

const executionMapByScope = computed<
  Record<ReleasePipelineScope, ReleaseOrderExecution | null>
>(() => ({
  ci: executions.value.find((item) => item.pipeline_scope === "ci") || null,
  cd: executions.value.find((item) => item.pipeline_scope === "cd") || null,
}));

const visibleScopes = computed(() => {
  return (["ci", "cd"] as ReleasePipelineScope[]).filter((scope) =>
    Boolean(executionMapByScope.value[scope]),
  );
});

const detailItems = computed(() => {
  if (!order.value) {
    return [];
  }
  const items = [
    { key: "order_no", label: "发布单号", value: order.value.order_no },
    {
      key: "created_at",
      label: "创建时间",
      value: formatTime(order.value.created_at),
    },
    {
      key: "operation_type",
      label: "操作类型",
      value: operationTypeText(order.value.operation_type),
    },
    { label: "应用名称", value: order.value.application_name || "-" },
    { label: "模板名称", value: order.value.template_name || "-" },
    { label: "模板 ID", value: order.value.template_id || "-" },
    { label: "触发方式", value: triggerTypeText(order.value.trigger_type) },
    { label: "创建者", value: order.value.triggered_by || "-" },
    { label: "Git 版本", value: order.value.git_ref || "-" },
    { label: "镜像版本", value: order.value.image_tag || "-" },
    { label: "备注", value: order.value.remark || "-" },
    { label: "开始时间", value: formatTime(order.value.started_at) },
    { label: "结束时间", value: formatTime(order.value.finished_at) },
    { label: "更新时间", value: formatTime(order.value.updated_at) },
  ];
  if (order.value.operation_type !== "deploy" && order.value.source_order_no) {
    items.splice(3, 0, {
      key: "source_order_no",
      label: "来源发布单号",
      value: order.value.source_order_no,
    });
  }
  return items;
});

const heroFacts = computed(() => {
  if (!order.value) {
    return [];
  }
  return [
    { label: "应用", value: order.value.application_name || "-" },
    { label: "环境", value: order.value.env_code || "-" },
    { label: "Git 版本", value: order.value.git_ref || "-" },
  ];
});

const contextFacts = computed(() => {
  if (!order.value) {
    return [];
  }
  const items = [
    { label: "模板", value: order.value.template_name || "-" },
    { label: "模板 ID", value: order.value.template_id || "-" },
    { label: "触发方式", value: triggerTypeText(order.value.trigger_type) },
    { label: "创建者", value: order.value.triggered_by || "-" },
    { label: "创建时间", value: formatTime(order.value.created_at) },
    { label: "开始时间", value: formatTime(order.value.started_at) },
    { label: "结束时间", value: formatTime(order.value.finished_at) },
    { label: "更新时间", value: formatTime(order.value.updated_at) },
  ];
  if (order.value.is_concurrent) {
    items.splice(3, 0, { label: "并发执行", value: "是" });
    items.splice(4, 0, {
      label: "并发批次",
      value: order.value.concurrent_batch_no || "-",
    });
  }
  return items;
});

const showConcurrentBatchCard = computed(() =>
  Boolean(order.value?.is_concurrent && order.value?.concurrent_batch_no),
);

const concurrentBatchSummary = computed(() => {
  const progress = concurrentBatchProgress.value;
  if (!progress) {
    return [];
  }
  return [
    { label: "总单数", value: progress.total },
    { label: "等待中", value: progress.queued },
    { label: "执行中", value: progress.executing },
    { label: "已完成", value: progress.success },
    { label: "失败", value: progress.failed },
  ];
});

const currentConcurrentBatchItem = computed(() => {
  if (!order.value?.id || !concurrentBatchProgress.value?.items?.length) {
    return null;
  }
  return (
    concurrentBatchProgress.value.items.find(
      (item) => item.order_id === order.value?.id,
    ) || null
  );
});

const isQueuedInConcurrentBatch = computed(
  () =>
    currentConcurrentBatchItem.value?.queue_state === "queued" ||
    Boolean(
      order.value?.status === "running" && precheck.value?.waiting_for_lock,
    ),
);

const spotlightStep = computed(() => {
  const failedSteps = [...steps.value]
    .filter((item) => item.status === "failed")
    .sort(sortSteps);
  if (failedSteps.length > 0) {
    return failedSteps[failedSteps.length - 1];
  }
  const runningSteps = [...steps.value]
    .filter((item) => item.status === "running")
    .sort(sortSteps);
  if (runningSteps.length > 0) {
    return runningSteps[runningSteps.length - 1];
  }
  const successSteps = [...steps.value]
    .filter((item) => item.status === "success")
    .sort(sortSteps);
  if (successSteps.length > 0) {
    return successSteps[successSteps.length - 1];
  }
  return null;
});

const spotlightTone = computed<"error" | "processing" | "success" | "warning">(
  () => {
    if (!order.value) {
      return "warning";
    }
    if (currentBusinessStatus.value === "queued" || isQueuedInConcurrentBatch.value) {
      return "warning";
    }
    switch (currentBusinessStatus.value) {
      case "deploy_failed":
        return "error";
      case "deploying":
        return "processing";
      case "deploy_success":
        return "success";
      default:
        return "warning";
    }
  },
);

const spotlightStatusKey = computed<
  "failed" | "running" | "queued" | "success" | "cancelled" | "pending"
>(() => {
  if (!order.value) {
    return "pending";
  }
  if (currentBusinessStatus.value === "queued" || isQueuedInConcurrentBatch.value) {
    return "queued";
  }
  switch (currentBusinessStatus.value) {
    case "deploy_failed":
      return "failed";
    case "deploying":
      return "running";
    case "deploy_success":
      return "success";
    case "cancelled":
      return "cancelled";
    default:
      return "pending";
  }
});

const spotlightMeta = computed(() => {
  if (isQueuedInConcurrentBatch.value) {
    const queuePosition = currentConcurrentBatchItem.value?.queue_position || 0;
    if (queuePosition > 0) {
      return `并发批次等待队列 · 当前位次 ${queuePosition}`;
    }
    return "并发批次等待队列 · 等待前序发布释放执行位";
  }
  const step = spotlightStep.value;
  if (step) {
    return `${step.step_name} · ${statusText(step.status)}`;
  }
  if (!order.value) {
    return "等待获取发布详情";
  }
  return `发布单状态 · ${statusText(currentBusinessStatus.value)}`;
});

const spotlightTitle = computed(() => {
  if (!order.value) {
    return "等待加载发布状态";
  }
  if (currentBusinessStatus.value === "queued" || isQueuedInConcurrentBatch.value) {
    return "发布排队中，等待前序发布完成";
  }
  if (currentBusinessStatus.value === "deploy_failed") {
    return "发布失败，需要人工介入";
  }
  if (currentBusinessStatus.value === "deploying") {
    return "发布执行中";
  }
  if (currentBusinessStatus.value === "deploy_success") {
    return "发布已完成";
  }
  if (currentBusinessStatus.value === "cancelled") {
    return "发布已取消";
  }
  return "发布待执行";
});

const spotlightDescription = computed(() => {
  if (isQueuedInConcurrentBatch.value) {
    const queuePosition = currentConcurrentBatchItem.value?.queue_position || 0;
    if (queuePosition > 0) {
      return `当前发布单已通过预检，正在并发批次队列中等待执行，队列位次 ${queuePosition}。`;
    }
    return (
      precheck.value?.conflict_message ||
      "当前发布单已通过预检，正在等待同应用同环境的前序发布执行完成。"
    );
  }
  const step = spotlightStep.value;
  if (step) {
    const messageText = String(step.message || "").trim();
    if (messageText) {
      return `${step.step_name}：${messageText}`;
    }
    return `${step.step_name}：${statusText(step.status)}`;
  }
  if (!order.value) {
    return "正在加载发布详情";
  }
  return `当前状态：${statusText(currentBusinessStatus.value)}`;
});

const executionSections = computed(() =>
  visibleScopes.value.map((scope) => ({
    scope,
    title: `${scopeLabel(scope)} 执行单元`,
    execution: executionMapByScope.value[scope] as ReleaseOrderExecution,
  })),
);

const paramGroups = computed(() => {
  const map: Record<ReleasePipelineScope, ReleaseOrderParam[]> = {
    ci: [],
    cd: [],
  };
  params.value.forEach((item) => {
    const scope = normalizeScope(item.pipeline_scope);
    if (!scope) {
      return;
    }
    map[scope].push(item);
  });
  return visibleScopes.value.map((scope) => ({
    scope,
    title: `${scopeLabel(scope)} 参数快照`,
    items: map[scope],
  }));
});

const valueProgressGroups = computed(() => {
  const map: Record<ReleasePipelineScope, ReleaseOrderValueProgress[]> = {
    ci: [],
    cd: [],
  };
  valueProgress.value.forEach((item) => {
    const scope = normalizeScope(item.pipeline_scope);
    if (!scope) {
      return;
    }
    map[scope].push(item);
  });
  return visibleScopes.value
    .map((scope) => ({
      scope,
      title: `${scopeLabel(scope)} 取值进度`,
      items: map[scope].sort((a, b) => a.sort_no - b.sort_no),
    }))
    .filter((group) => group.items.length > 0);
});

const stepGroups = computed(() => {
  const groups: Array<{
    key: string;
    title: string;
    items: ReleaseOrderStep[];
  }> = [];
  const globalSteps = steps.value
    .filter(
      (item) =>
        String(item.step_scope || "")
          .trim()
          .toLowerCase() === "global",
    )
    .sort(sortSteps);
  if (globalSteps.length > 0) {
    groups.push({ key: "global", title: "全局步骤", items: globalSteps });
  }
  visibleScopes.value.forEach((scope) => {
    const items = steps.value
      .filter(
        (item) =>
          String(item.step_scope || "")
            .trim()
            .toLowerCase() === scope,
      )
      .sort(sortSteps);
    if (items.length > 0) {
      groups.push({ key: scope, title: `${scopeLabel(scope)} 步骤`, items });
    }
  });
  return groups;
});

const hookProgressItems = computed(() => {
  const allHookSteps = steps.value
    .filter((item) =>
      String(item.step_code || "")
        .trim()
        .toLowerCase()
        .startsWith("hook:"),
    )
    .sort(sortSteps);
  const businessHookSteps = allHookSteps.filter((item) => {
    const code = String(item.step_code || "")
      .trim()
      .toLowerCase();
    return code !== "hook:prepare" && code !== "hook:summary";
  });
  return (businessHookSteps.length > 0 ? businessHookSteps : allHookSteps).map(
    (item, index) => ({
      ...item,
      order_index: index + 1,
      summary:
        String(item.message || "").trim() ||
        (item.status === "pending" ? "等待主发布流程结束后执行 Hook。" : ""),
    }),
  );
});

type HookProgressType = "agent_task" | "webhook_notification" | "generic";

function inferHookProgressType(item: ReleaseOrderStep): HookProgressType {
  const haystack = [
    item.step_code,
    item.step_name,
    item.message,
  ]
    .map((value) =>
      String(value || "")
        .trim()
        .toLowerCase(),
    )
    .join(" ");
  if (haystack.includes("webhook")) {
    return "webhook_notification";
  }
  if (haystack.includes("agent")) {
    return "agent_task";
  }
  return "generic";
}

function hookProgressTypeText(type: HookProgressType) {
  switch (type) {
    case "agent_task":
      return "Agent 任务";
    case "webhook_notification":
      return "Webhook 通知";
    default:
      return "通用 Hook";
  }
}

function hookExecutionUnitTitle(type: HookProgressType) {
  switch (type) {
    case "agent_task":
      return "Hook 执行单元";
    default:
      return `${hookProgressTypeText(type)} Hook 执行单元`;
  }
}

function hookExecutionContentText(item: ReleaseOrderStep) {
  const messageText = String(item.message || "").trim();
  if (messageText) {
    return messageText;
  }
  if (item.status === "pending") {
    return "等待主发布流程结束后触发当前 Hook。";
  }
  return "当前 Hook 暂无补充执行内容。";
}

function hookGroupSummaryText(group: {
  summary: {
    total: number;
    pending: number;
    running: number;
    success: number;
    failed: number;
  };
}) {
  const parts: string[] = [];
  if (group.summary.running > 0) {
    parts.push(`${group.summary.running} 个执行中`);
  }
  if (group.summary.success > 0) {
    parts.push(`${group.summary.success} 个成功`);
  }
  if (group.summary.failed > 0) {
    parts.push(`${group.summary.failed} 个失败`);
  }
  if (group.summary.pending > 0) {
    parts.push(`${group.summary.pending} 个待执行`);
  }
  return `${group.summary.total} 个 Hook${
    parts.length > 0 ? ` · ${parts.join(" · ")}` : ""
  }`;
}

const hookProgressGroups = computed(() => {
  const grouped = new Map<
    HookProgressType,
    {
      type: HookProgressType;
      title: string;
      items: Array<
        ReleaseOrderStep & {
          order_index: number;
          summary: string;
        }
      >;
      summary: {
        total: number;
        pending: number;
        running: number;
        success: number;
        failed: number;
      };
      overallStatus: "pending" | "running" | "success" | "failed";
    }
  >();

  hookProgressItems.value.forEach((item) => {
    const type = inferHookProgressType(item);
    if (!grouped.has(type)) {
      grouped.set(type, {
        type,
        title: hookExecutionUnitTitle(type),
        items: [],
        summary: {
          total: 0,
          pending: 0,
          running: 0,
          success: 0,
          failed: 0,
        },
        overallStatus: "pending",
      });
    }
    const group = grouped.get(type)!;
    group.items.push(item);
    group.summary.total += 1;
    switch (item.status) {
      case "running":
        group.summary.running += 1;
        break;
      case "success":
        group.summary.success += 1;
        break;
      case "failed":
        group.summary.failed += 1;
        break;
      default:
        group.summary.pending += 1;
        break;
    }
  });

  return Array.from(grouped.values()).map((group) => {
    if (group.summary.failed > 0) {
      group.overallStatus = "failed";
    } else if (group.summary.running > 0) {
      group.overallStatus = "running";
    } else if (group.summary.success > 0 && group.summary.pending === 0) {
      group.overallStatus = "success";
    } else {
      group.overallStatus = "pending";
    }
    return group;
  });
});

const hookContextPreviewItems = computed(() => {
  if (!order.value) {
    return [];
  }
  return [
    { label: "发布单号", value: order.value.order_no || "-" },
    { label: "应用", value: order.value.application_name || "-" },
    { label: "环境", value: order.value.env_code || "-" },
    { label: "Git 版本", value: order.value.git_ref || "-" },
    { label: "镜像版本", value: order.value.image_tag || "-" },
    { label: "操作类型", value: operationTypeText(order.value.operation_type) },
  ];
});

const stageGroupsByScope = computed<
  Record<ReleasePipelineScope, ReleaseOrderPipelineStage[]>
>(() => {
  const map: Record<ReleasePipelineScope, ReleaseOrderPipelineStage[]> = {
    ci: [],
    cd: [],
  };
  pipelineStages.value.forEach((item) => {
    const scope = normalizeScope(item.pipeline_scope);
    if (!scope) {
      return;
    }
    map[scope].push(item);
  });
  map.ci.sort((a, b) => a.sort_no - b.sort_no);
  map.cd.sort((a, b) => a.sort_no - b.sort_no);
  return map;
});

const stageSections = computed(() =>
  visibleScopes.value.map((scope) => {
    const execution = executionMapByScope.value[scope];
    return {
      scope,
      title: `${scopeLabel(scope)} 管线进度`,
      execution,
      stages: stageGroupsByScope.value[scope],
      isJenkins: execution?.provider === "jenkins",
      isArgoCD: execution?.provider === "argocd",
    };
  }),
);

const logSections = computed(() =>
  visibleScopes.value.map((scope) => {
    const execution = executionMapByScope.value[scope];
    return {
      scope,
      title: `${scopeLabel(scope)} 日志`,
      execution,
      isJenkins: execution?.provider === "jenkins",
      state: scopeLogStates[scope],
    };
  }),
);

const paramInitialColumns: TableColumnsType<ReleaseOrderParam> = [
  {
    title: "平台标准 Key",
    dataIndex: "param_key",
    key: "param_key",
    width: 180,
  },
  {
    title: "执行器参数名",
    dataIndex: "executor_param_name",
    key: "executor_param_name",
    width: 220,
  },
  {
    title: "参数值",
    dataIndex: "param_value",
    key: "param_value",
    width: 300,
    ellipsis: true,
  },
  { title: "来源", dataIndex: "value_source", key: "value_source", width: 150 },
  { title: "创建时间", dataIndex: "created_at", key: "created_at", width: 190 },
];
const { columns: paramColumns } = useResizableColumns(paramInitialColumns, {
  minWidth: 100,
  maxWidth: 620,
  hitArea: 10,
});

const pipelineStageInitialColumns: TableColumnsType<ReleaseOrderPipelineStage> =
  [
    { title: "顺序", dataIndex: "sort_no", key: "sort_no", width: 90 },
    {
      title: "阶段名称",
      dataIndex: "stage_name",
      key: "stage_name",
      width: 240,
    },
    { title: "状态", dataIndex: "status", key: "status", width: 120 },
    {
      title: "耗时",
      dataIndex: "duration_millis",
      key: "duration_millis",
      width: 140,
    },
    {
      title: "开始时间",
      dataIndex: "started_at",
      key: "started_at",
      width: 190,
    },
    {
      title: "结束时间",
      dataIndex: "finished_at",
      key: "finished_at",
      width: 190,
    },
    { title: "操作", key: "actions", width: 120, fixed: "right" },
  ];
const { columns: pipelineStageColumns } = useResizableColumns(
  pipelineStageInitialColumns,
  {
    minWidth: 100,
    maxWidth: 420,
    hitArea: 10,
  },
);

const valueProgressInitialColumns: TableColumnsType<ReleaseOrderValueProgress> =
  [
    {
      title: "平台标准 Key",
      dataIndex: "param_key",
      key: "param_key",
      width: 180,
    },
    {
      title: "字段名称",
      dataIndex: "param_name",
      key: "param_name",
      width: 180,
    },
    {
      title: "执行器参数名",
      dataIndex: "executor_param_name",
      key: "executor_param_name",
      width: 220,
    },
    {
      title: "当前值",
      dataIndex: "value",
      key: "value",
      width: 260,
      ellipsis: true,
    },
    { title: "状态", dataIndex: "status", key: "status", width: 120 },
    {
      title: "来源",
      dataIndex: "value_source",
      key: "value_source",
      width: 180,
    },
    {
      title: "说明",
      dataIndex: "message",
      key: "message",
      width: 320,
      ellipsis: true,
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 190,
    },
  ];
const { columns: valueProgressColumns } = useResizableColumns(
  valueProgressInitialColumns,
  {
    minWidth: 100,
    maxWidth: 520,
    hitArea: 10,
  },
);

function normalizeScope(scope: string): ReleasePipelineScope | null {
  const value = String(scope || "")
    .trim()
    .toLowerCase();
  if (value === "ci" || value === "cd") {
    return value as ReleasePipelineScope;
  }
  return null;
}

function scopeLabel(scope: ReleasePipelineScope) {
  return scope === "ci" ? "CI" : "CD";
}

function formatTime(value: string | null) {
  if (!value) {
    return "-";
  }
  return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
}

function formatTimeCompact(value: string | null) {
  if (!value) {
    return "";
  }
  return dayjs(value).format("MM-DD HH:mm:ss");
}

function statusText(
  status:
    | ReleaseOrderBusinessStatus
    | ReleaseOrderStatus
    | ReleaseOrderStep["status"]
    | ReleasePipelineStageStatus
    | ReleaseOrderExecution["status"],
) {
  switch (status) {
    case "draft":
      return "草稿";
    case "pending_execution":
      return "待执行";
    case "pending_approval":
      return "待审批";
    case "approving":
      return "审批中";
    case "approved":
      return "已批准";
    case "rejected":
      return "审批拒绝";
    case "queued":
      return "排队中";
    case "deploying":
      return "发布中";
    case "deploy_success":
      return "发布成功";
    case "deploy_failed":
      return "发布失败";
    case "pending":
      return "待执行";
    case "running":
      return "执行中";
    case "success":
      return "成功";
    case "failed":
      return "失败";
    case "cancelled":
      return "已取消";
    case "skipped":
      return "已跳过";
    default:
      return status;
  }
}

function statusToneClass(
  status:
    | ReleaseOrderBusinessStatus
    | ReleaseOrderStatus
    | ReleaseOrderStep["status"]
    | ReleasePipelineStageStatus
    | ReleaseOrderExecution["status"],
) {
  switch (status) {
    case "deploy_success":
    case "success":
      return "status-pill-success";
    case "deploy_failed":
    case "rejected":
    case "failed":
      return "status-pill-failed";
    case "deploying":
    case "approving":
    case "running":
      return "status-pill-running";
    case "queued":
    case "approved":
    case "pending_approval":
      return "status-pill-warning";
    case "cancelled":
      return "status-pill-neutral";
    case "skipped":
      return "status-pill-neutral";
    default:
      return "status-pill-pending";
  }
}

function valueProgressStatusText(status: ReleaseOrderValueProgressStatus) {
  switch (status) {
    case "resolved":
      return "已取值";
    case "running":
      return "取值中";
    case "failed":
      return "取值失败";
    case "skipped":
      return "未取值";
    default:
      return "等待取值";
  }
}

function valueProgressToneClass(status: ReleaseOrderValueProgressStatus) {
  switch (status) {
    case "resolved":
      return "status-pill-success";
    case "running":
      return "status-pill-running";
    case "failed":
      return "status-pill-failed";
    case "skipped":
      return "status-pill-neutral";
    default:
      return "status-pill-pending";
  }
}

function precheckStatusText(status: ReleaseOrderPrecheckItem["status"]) {
  switch (status) {
    case "pass":
      return "通过";
    case "warn":
      return "等待";
    case "blocked":
      return "阻塞";
    default:
      return status;
  }
}

function precheckToneClass(status: ReleaseOrderPrecheckItem["status"]) {
  switch (status) {
    case "pass":
      return "status-pill-success";
    case "warn":
      return "status-pill-running";
    case "blocked":
      return "status-pill-failed";
    default:
      return "status-pill-pending";
  }
}

function concurrentQueueStateText(
  state: ReleaseOrderConcurrentBatchQueueState,
) {
  switch (state) {
    case "queued":
      return "排队中";
    case "executing":
      return "执行中";
    case "success":
      return "已完成";
    case "failed":
      return "失败";
    case "cancelled":
      return "已取消";
    default:
      return "待调度";
  }
}

function concurrentQueueToneClass(
  state: ReleaseOrderConcurrentBatchQueueState,
) {
  switch (state) {
    case "success":
      return "status-pill-success";
    case "failed":
      return "status-pill-failed";
    case "executing":
      return "status-pill-running";
    case "cancelled":
      return "status-pill-neutral";
    case "queued":
      return "status-pill-warning";
    default:
      return "status-pill-pending";
  }
}

const precheckSummaryMessage = computed(() => {
  if (!precheck.value) {
    return "";
  }
  if (precheck.value.waiting_for_lock) {
    return (
      precheck.value.conflict_message ||
      "当前目标已被其他发布占用，系统会在锁释放后继续执行。"
    );
  }
  if (precheckBlocked.value) {
    return (
      precheck.value.conflict_message ||
      "当前发布单未通过执行前预检，请先处理阻塞项。"
    );
  }
  if (precheck.value.lock_enabled) {
    return `并发发布保护已启用，当前按 ${precheck.value.lock_scope || "application_env"} 范围进行调度控制。`;
  }
  return "";
});

const precheckSummaryTone = computed<"info" | "warning" | "error">(() => {
  if (precheck.value?.waiting_for_lock) {
    return "warning";
  }
  if (precheckBlocked.value) {
    return "error";
  }
  return "info";
});

function triggerTypeText(
  triggerType: ReleaseTriggerType | "" | null | undefined,
) {
  switch (
    String(triggerType || "")
      .trim()
      .toLowerCase()
  ) {
    case "manual":
      return "手动";
    case "webhook":
      return "Webhook";
    case "schedule":
      return "定时";
    default:
      return triggerType || "-";
  }
}

function operationTypeText(
  operationType: ReleaseOperationType | "" | null | undefined,
) {
  switch (
    String(operationType || "")
      .trim()
      .toLowerCase()
  ) {
    case "rollback":
      return "标准回滚";
    case "replay":
      return "重放回滚";
    default:
      return "普通发布";
  }
}

function isCiOnlyRecovery(record?: ReleaseOrder | null) {
  return String(record?.cd_provider || "").trim() === "";
}

function replayActionText(record?: ReleaseOrder | null) {
  return "回滚到此版本";
}

function replayConfirmTitle(record?: ReleaseOrder | null) {
  return isCiOnlyRecovery(record)
    ? "确认基于这张成功单创建 CI 重放回滚吗？"
    : "确认基于这张成功单创建重放回滚吗？";
}

function replaySuccessText(record: ReleaseOrder, orderNo: string) {
  return isCiOnlyRecovery(record)
    ? `已创建 CI 重放回滚单：${orderNo}`
    : `已创建重放回滚单：${orderNo}`;
}

function replayFailureText(record?: ReleaseOrder | null) {
  return isCiOnlyRecovery(record) ? "CI 重放回滚创建失败" : "重放回滚创建失败";
}

function isRunningStatus(
  status:
    | ReleaseOrderStatus
    | ReleaseOrderStep["status"]
    | ReleasePipelineStageStatus
    | ReleaseOrderExecution["status"],
) {
  return status === "running";
}

function formatDuration(durationMillis: number) {
  const value = Number(durationMillis || 0);
  if (!Number.isFinite(value) || value <= 0) {
    return "-";
  }
  if (value < 1000) {
    return `${Math.floor(value)} ms`;
  }
  const totalSeconds = Math.floor(value / 1000);
  if (totalSeconds < 60) {
    return `${totalSeconds} s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function sortSteps(a: ReleaseOrderStep, b: ReleaseOrderStep) {
  if (a.sort_no !== b.sort_no) {
    return a.sort_no - b.sort_no;
  }
  return a.step_code.localeCompare(b.step_code);
}

function stepComponentStatus(status: ReleaseOrderStep["status"]) {
  switch (status) {
    case "success":
      return "finish";
    case "running":
      return "process";
    case "failed":
      return "error";
    default:
      return "wait";
  }
}

function describeStep(step: ReleaseOrderStep) {
  const parts: string[] = [];
  if (String(step.message || "").trim()) {
    parts.push(step.message);
  } else if (step.status === "pending") {
    parts.push("等待执行");
  }
  const timeParts = [
    formatTimeCompact(step.started_at),
    formatTimeCompact(step.finished_at),
  ].filter(Boolean);
  if (timeParts.length > 0) {
    parts.push(timeParts.join(" -> "));
  }
  return parts.join(" ｜ ");
}

function hookStatusText(status: ReleaseOrderStep["status"]) {
  switch (status) {
    case "pending":
      return "待执行";
    case "running":
      return "执行中";
    case "success":
      return "成功";
    case "failed":
      return "失败";
    default:
      return status;
  }
}

function approvalModeText(mode: string | null | undefined) {
  return String(mode || "").trim().toLowerCase() === "all" ? "会签" : "或签";
}

function approvalActionText(action: ReleaseOrderApprovalRecord["action"]) {
  switch (action) {
    case "submit":
      return "提交审批";
    case "approve":
      return "审批通过";
    case "reject":
      return "审批拒绝";
    default:
      return action;
  }
}

const approvalStatusSummary = computed(() => {
  if (!order.value?.approval_required) {
    return "当前模板未启用审批流。";
  }
  switch (currentBusinessStatus.value) {
    case "pending_approval":
      return "当前发布单待审批，发起人可提交审批，审批人也可以直接处理。";
    case "approving":
      return "当前发布单正在审批中，审批通过后才允许触发发布。";
    case "approved":
      return order.value.approved_by
        ? `审批已通过，最后确认人：${order.value.approved_by}`
        : "审批已通过，可继续触发发布。";
    case "rejected":
      return order.value.rejected_reason
        ? `审批已拒绝：${order.value.rejected_reason}`
        : "审批已拒绝，当前发布单不能继续执行。";
    default:
      return "审批流程已完成，可在此查看审批记录与审批人。";
  }
});

const approvalActionModalTitle = computed(() => {
  switch (approvalActionMode.value) {
    case "submit":
      return "提交审批";
    case "approve":
      return "审批通过";
    case "reject":
      return "审批拒绝";
    default:
      return "审批操作";
  }
});

const approvalActionModalOkText = computed(() => {
  switch (approvalActionMode.value) {
    case "submit":
      return "提交";
    case "approve":
      return "通过";
    case "reject":
      return "拒绝";
    default:
      return "确认";
  }
});

const approvalActionPlaceholder = computed(() => {
  switch (approvalActionMode.value) {
    case "submit":
      return "可选填写审批备注，帮助审批人理解本次发布背景。";
    case "approve":
      return "可选填写审批意见，例如放行原因、观察项。";
    case "reject":
      return "请填写拒绝原因，便于发起人修正发布内容。";
    default:
      return "请输入审批备注。";
  }
});

function hookToneClass(status: ReleaseOrderStep["status"] | "skipped") {
  switch (status) {
    case "success":
      return "status-pill-success";
    case "running":
      return "status-pill-running";
    case "failed":
      return "status-pill-failed";
    case "skipped":
      return "status-pill-neutral";
    default:
      return "status-pill-pending";
  }
}

function toggleHookVariables(id: string) {
  expandedHookVariableMap[id] = !expandedHookVariableMap[id];
}

function toggleHookLogs(id: string) {
  expandedHookLogMap[id] = !expandedHookLogMap[id];
}

function openApprovalActionModal(mode: "submit" | "approve" | "reject") {
  approvalActionMode.value = mode;
  approvalActionComment.value = "";
  approvalActionModalVisible.value = true;
}

function closeApprovalActionModal() {
  approvalActionModalVisible.value = false;
  approvalActionComment.value = "";
}

function latestScopeStepMessage(
  scope: ReleasePipelineScope,
  preferredStatus?: ReleaseOrderStep["status"],
) {
  const scopedSteps = steps.value
    .filter(
      (item) =>
        String(item.step_scope || "")
          .trim()
          .toLowerCase() === scope,
    )
    .sort(sortSteps);

  const candidates = preferredStatus
    ? scopedSteps.filter((item) => item.status === preferredStatus)
    : scopedSteps;

  for (let index = candidates.length - 1; index >= 0; index -= 1) {
    const messageText = String(candidates[index].message || "").trim();
    if (messageText) {
      return messageText;
    }
  }
  return "";
}

function pipelineStageEmptyDescription(section: {
  scope: ReleasePipelineScope;
  execution: ReleaseOrderExecution | null;
  isArgoCD: boolean;
  isJenkins: boolean;
}) {
  if (!section.execution) {
    return "暂无阶段数据";
  }

  if (section.isArgoCD) {
    const failedMessage = latestScopeStepMessage(section.scope, "failed");
    switch (section.execution.status) {
      case "failed":
        return (
          failedMessage ||
          "CD 在启动阶段失败，尚未生成 GitOps / ArgoCD 聚合进度"
        );
      case "pending":
        return "CD 尚未启动，待前置步骤完成后会自动生成 GitOps / ArgoCD 进度";
      case "running":
        return "GitOps 写回 / ArgoCD Sync 进度正在回收中，请稍后自动刷新";
      case "success":
        return "CD 已完成，但当前没有额外的聚合阶段数据";
      case "cancelled":
        return failedMessage || "CD 已取消，未生成聚合阶段数据";
      case "skipped":
        return "CD 已跳过，未生成聚合阶段数据";
      default:
        return "暂无阶段数据";
    }
  }

  if (section.isJenkins) {
    return latestScopeStepMessage(section.scope, "failed") || "暂无阶段数据";
  }

  return latestScopeStepMessage(section.scope, "failed") || "暂无阶段数据";
}

function parseStreamEvent(data: string): ReleaseOrderLogStreamEvent | null {
  const text = String(data || "").trim();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as ReleaseOrderLogStreamEvent;
  } catch {
    return {
      type: "status",
      timestamp: new Date().toISOString(),
      message: text,
    };
  }
}

function getLogState(scope: ReleasePipelineScope) {
  return scopeLogStates[scope];
}

function setLogPanelRef(scope: ReleasePipelineScope, element: Element | null) {
  getLogState(scope).panelRef = element instanceof HTMLElement ? element : null;
}

function isLogNearBottom(scope: ReleasePipelineScope) {
  const panel = getLogState(scope).panelRef;
  if (!panel) {
    return true;
  }
  const remain = panel.scrollHeight - panel.scrollTop - panel.clientHeight;
  return remain <= 48;
}

function scrollLogToBottom(scope: ReleasePipelineScope, force = false) {
  const state = getLogState(scope);
  if (!state.panelRef) {
    return;
  }
  if (!force && !state.autoFollow) {
    return;
  }
  state.panelRef.scrollTop = state.panelRef.scrollHeight;
}

function syncLogFollowState(scope: ReleasePipelineScope) {
  getLogState(scope).autoFollow = isLogNearBottom(scope);
}

function handleLogFollowChange(scope: ReleasePipelineScope, checked: boolean) {
  const state = getLogState(scope);
  state.autoFollow = checked;
  if (checked) {
    void nextTick(() => {
      scrollLogToBottom(scope, true);
    });
  }
}

function jumpLogToBottom(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  state.autoFollow = true;
  void nextTick(() => {
    scrollLogToBottom(scope, true);
  });
}

function appendLogContent(scope: ReleasePipelineScope, content: string) {
  const state = getLogState(scope);
  const chunk = String(content || "");
  if (!chunk) {
    return;
  }
  state.text = state.text ? state.text + chunk : chunk;
  void nextTick(() => {
    scrollLogToBottom(scope);
  });
}

function appendStatusLine(scope: ReleasePipelineScope, messageText: string) {
  const text = String(messageText || "").trim();
  if (!text) {
    return;
  }
  appendLogContent(scope, `[${dayjs().format("HH:mm:ss")}] ${text}\n`);
}

function clearReconnectTimer(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  if (state.reconnectTimer !== null) {
    window.clearTimeout(state.reconnectTimer);
    state.reconnectTimer = null;
  }
}

function closeLogStream(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  clearReconnectTimer(scope);
  if (state.stream) {
    state.closeIntentional = true;
    state.stream.close();
    state.stream = null;
  }
  state.connected = false;
  state.connecting = false;
}

function resetLogState(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  closeLogStream(scope);
  state.text = "";
  state.offset = 0;
  state.connected = false;
  state.connecting = false;
  state.ended = false;
  state.error = "";
  state.statusText = "未连接";
  state.closeIntentional = false;
  state.autoFollow = true;
}

function scheduleReconnect(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  if (state.closeIntentional || state.ended || !shouldKeepLogStreaming.value) {
    return;
  }
  clearReconnectTimer(scope);
  state.reconnectTimer = window.setTimeout(() => {
    void startLogStream(scope, false);
  }, 2000);
}

async function startLogStream(scope: ReleasePipelineScope, reset: boolean) {
  const execution = executionMapByScope.value[scope];
  if (!orderID.value || !execution || execution.provider !== "jenkins") {
    return;
  }

  const state = getLogState(scope);
  closeLogStream(scope);
  state.closeIntentional = false;
  if (reset) {
    state.text = "";
    state.offset = 0;
    state.error = "";
    state.ended = false;
    state.statusText = "准备连接";
    state.autoFollow = true;
  }

  const streamURL = buildReleaseOrderLogStreamURL(
    orderID.value,
    state.offset,
    authStore.accessToken,
    scope,
  );
  const source = new EventSource(streamURL);
  state.stream = source;
  state.connecting = true;
  state.statusText = "连接中...";

  source.onopen = () => {
    state.connecting = false;
    state.connected = true;
    state.error = "";
    if (!state.ended) {
      state.statusText = "流式同步中";
    }
  };

  const handleEventData = (
    eventType: string,
    payload: MessageEvent<string>,
  ) => {
    const parsed = parseStreamEvent(payload.data);
    if (!parsed) {
      return;
    }
    const eventOffset = Number(parsed.offset ?? Number.NaN);
    if (Number.isFinite(eventOffset) && eventOffset >= 0) {
      state.offset = Math.max(state.offset, Math.floor(eventOffset));
    }

    switch (eventType) {
      case "log":
        appendLogContent(scope, String(parsed.content || ""));
        if (parsed.message) {
          appendStatusLine(scope, parsed.message);
        }
        return;
      case "done":
        if (parsed.message) {
          appendStatusLine(scope, parsed.message);
        }
        state.ended = true;
        state.statusText = "已结束";
        state.closeIntentional = true;
        source.close();
        state.stream = null;
        state.connected = false;
        state.connecting = false;
        return;
      case "error":
        if (parsed.message) {
          appendStatusLine(scope, parsed.message);
          state.error = parsed.message;
        } else {
          state.error = "日志流发生异常";
        }
        return;
      default:
        if (parsed.message) {
          appendStatusLine(scope, parsed.message);
          state.statusText = parsed.message;
        }
    }
  };

  source.addEventListener("log", (event) => {
    handleEventData("log", event as MessageEvent<string>);
  });
  source.addEventListener("status", (event) => {
    handleEventData("status", event as MessageEvent<string>);
  });
  source.addEventListener("done", (event) => {
    handleEventData("done", event as MessageEvent<string>);
  });
  source.addEventListener("error", (event) => {
    handleEventData("error", event as MessageEvent<string>);
  });

  source.onerror = () => {
    state.connecting = false;
    state.connected = false;
    if (state.closeIntentional || state.ended) {
      return;
    }
    state.error = "";
    source.close();
    state.stream = null;
    scheduleReconnect(scope);
  };
}

function reconnectLogStream(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  state.error = "";
  state.statusText = "准备重连";
  const shouldReset = state.ended || !shouldKeepLogStreaming.value;
  if (shouldReset) {
    state.ended = false;
  }
  void startLogStream(scope, shouldReset);
}

function clearLogOutput(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  state.text = "";
  state.offset = 0;
  state.error = "";
  state.ended = false;
  state.autoFollow = true;
}

function logStreamTagColor(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  if (state.ended) {
    return "default";
  }
  if (state.error) {
    return "warning";
  }
  return "processing";
}

function logStreamHintText(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  if (state.error) {
    return "日志异常";
  }
  if (latestScopeStepMessage(scope, "failed")) {
    return "执行失败";
  }
  if (state.ended) {
    return "已结束";
  }
  return "";
}

function logSectionWarningMessage(scope: ReleasePipelineScope) {
  const state = getLogState(scope);
  if (state.error) {
    return state.error;
  }
  return latestScopeStepMessage(scope, "failed");
}

function logSectionEmptyDescription(scope: ReleasePipelineScope) {
  return logSectionWarningMessage(scope) || "暂无日志输出";
}

function syncVisibleLogStreams() {
  (["ci", "cd"] as ReleasePipelineScope[]).forEach((scope) => {
    const execution = executionMapByScope.value[scope];
    const state = getLogState(scope);
    if (!execution || execution.provider !== "jenkins") {
      resetLogState(scope);
      return;
    }

    if (!state.stream && !state.connecting && state.text === "") {
      void startLogStream(scope, true);
      return;
    }

    if (
      shouldKeepLogStreaming.value &&
      !state.stream &&
      !state.connecting &&
      !state.ended
    ) {
      void startLogStream(scope, false);
    }
  });
}

async function loadDetail(options?: { silent?: boolean }) {
  const silent = Boolean(options?.silent);
  if (!orderID.value) {
    if (!silent) {
      message.error("缺少发布单 ID");
      void router.push("/releases");
    }
    return;
  }
  if (querying.value) {
    return;
  }

  querying.value = true;
  if (!silent) {
    loading.value = true;
  }
  try {
    const previousStatus = order.value?.status || "";
    const [
      orderResp,
      executionsResp,
      paramsResp,
      valueProgressResp,
      stepsResp,
    ] = await Promise.all([
      getReleaseOrderByID(orderID.value),
      listReleaseOrderExecutions(orderID.value),
      canViewParamSnapshot.value
        ? listReleaseOrderParams(orderID.value)
        : Promise.resolve({ data: [] }),
      canViewParamSnapshot.value
        ? listReleaseOrderValueProgress(orderID.value)
        : Promise.resolve({ data: [] }),
      listReleaseOrderSteps(orderID.value),
    ]);
    order.value = orderResp.data;
    executions.value = [...executionsResp.data].sort(
      (a, b) => scopeSort(a.pipeline_scope) - scopeSort(b.pipeline_scope),
    );
    params.value = paramsResp.data;
    valueProgress.value = valueProgressResp.data;
    steps.value = stepsResp.data;
    await loadApprovalRecords({ silent: true });
    if (orderResp.data.is_concurrent) {
      await loadConcurrentBatchProgress({ silent });
    } else {
      concurrentBatchProgress.value = null;
    }

    if (shouldLoadPrecheck.value) {
      await loadPrecheck({ silent: true });
    } else {
      precheck.value = null;
    }

    const now = Date.now();
    const shouldRefreshPipelineStages =
      !stageLogDrawerVisible.value &&
      (!silent ||
        pipelineStages.value.length === 0 ||
        previousStatus !== orderResp.data.status ||
        now - lastPipelineStageRefreshAt.value >=
          PIPELINE_STAGE_REFRESH_INTERVAL_MS);
    if (shouldRefreshPipelineStages) {
      await loadPipelineStageView({ silent });
    }

    syncVisibleLogStreams();
  } catch (error) {
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, "发布单详情加载失败"));
      void router.push("/releases");
    }
  } finally {
    querying.value = false;
    if (!silent) {
      loading.value = false;
    }
  }
}

async function loadConcurrentBatchProgress(options?: { silent?: boolean }) {
  if (!orderID.value || !showConcurrentBatchCard.value) {
    concurrentBatchProgress.value = null;
    return;
  }
  const silent = Boolean(options?.silent);
  if (!silent) {
    concurrentBatchLoading.value = true;
  }
  try {
    const response = await getReleaseOrderConcurrentBatchProgress(
      orderID.value,
    );
    concurrentBatchProgress.value = response.data;
  } catch (error) {
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, "并发批次进度加载失败"));
    }
  } finally {
    if (!silent) {
      concurrentBatchLoading.value = false;
    }
  }
}

function scopeSort(scope: string) {
  const normalized = String(scope || "")
    .trim()
    .toLowerCase();
  if (normalized === "ci") {
    return 1;
  }
  if (normalized === "cd") {
    return 2;
  }
  return 99;
}

async function loadPipelineStageView(options?: { silent?: boolean }) {
  if (!orderID.value) {
    return;
  }
  const silent = Boolean(options?.silent);
  if (!silent) {
    pipelineStageLoading.value = true;
  }
  try {
    const response = await listReleaseOrderPipelineStages(orderID.value);
    pipelineStageModuleVisible.value = Boolean(response.show_module);
    pipelineStageExecutorType.value = String(
      response.executor_type || "",
    ).trim();
    pipelineStageMessage.value = String(response.message || "").trim();
    pipelineStages.value = response.data || [];
    lastPipelineStageRefreshAt.value = Date.now();
  } catch (error) {
    if (silent) {
      pipelineStageMessage.value = extractHTTPErrorMessage(
        error,
        "管线阶段暂时同步失败，请稍后手动刷新",
      );
    } else {
      pipelineStageModuleVisible.value = false;
      pipelineStageExecutorType.value = "";
      pipelineStageMessage.value = "";
      pipelineStages.value = [];
      message.error(extractHTTPErrorMessage(error, "管线阶段加载失败"));
    }
  } finally {
    if (!silent) {
      pipelineStageLoading.value = false;
    }
  }
}

async function loadPrecheck(options?: { silent?: boolean }) {
  if (!orderID.value || !shouldLoadPrecheck.value) {
    precheck.value = null;
    return;
  }
  const silent = Boolean(options?.silent);
  if (!silent) {
    precheckLoading.value = true;
  }
  try {
    const response = await getReleaseOrderPrecheck(orderID.value);
    precheck.value = response.data;
  } catch (error) {
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, "执行前预检加载失败"));
    }
  } finally {
    if (!silent) {
      precheckLoading.value = false;
    }
  }
}

async function loadApprovalRecords(options?: { silent?: boolean }) {
  if (!orderID.value) {
    approvalRecords.value = [];
    return;
  }
  const silent = Boolean(options?.silent);
  const shouldLoad =
    Boolean(order.value?.approval_required) ||
    ["pending_approval", "approving", "approved", "rejected"].includes(
      currentBusinessStatus.value,
    );
  if (!shouldLoad) {
    approvalRecords.value = [];
    return;
  }
  if (!silent) {
    approvalRecordsLoading.value = true;
  }
  try {
    const response = await listReleaseOrderApprovalRecords(orderID.value);
    approvalRecords.value = response.data || [];
  } catch (error) {
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, "审批记录加载失败"));
    }
  } finally {
    if (!silent) {
      approvalRecordsLoading.value = false;
    }
  }
}

async function openStageLogDrawer(stage: ReleaseOrderPipelineStage) {
  selectedPipelineStage.value = stage;
  stageLogDrawerVisible.value = true;
  await loadStageLog();
}

function closeStageLogDrawer() {
  stageLogDrawerVisible.value = false;
  selectedPipelineStage.value = null;
  stageLogContent.value = "";
  stageLogHasMore.value = false;
  stageLogFetchedAt.value = "";
}

async function loadStageLog() {
  if (!orderID.value || !selectedPipelineStage.value) {
    return;
  }
  stageLogLoading.value = true;
  try {
    const response = await getReleaseOrderPipelineStageLog(
      orderID.value,
      selectedPipelineStage.value.id,
    );
    selectedPipelineStage.value = response.data.stage;
    stageLogContent.value = response.data.content || "";
    stageLogHasMore.value = Boolean(response.data.has_more);
    stageLogFetchedAt.value = formatTime(response.data.fetched_at);
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "阶段日志加载失败"));
  } finally {
    stageLogLoading.value = false;
  }
}

async function handleCancel() {
  if (!order.value) {
    return;
  }
  cancelling.value = true;
  try {
    const response = await cancelReleaseOrder(order.value.id);
    order.value = response.data;
    message.success("发布单取消成功");
    await loadDetail({ silent: true });
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "发布单取消失败"));
  } finally {
    cancelling.value = false;
  }
}

async function handleExecute() {
  if (!order.value || executeLocked.value) {
    return;
  }
  if (!canExecute.value) {
    message.warning(
      precheckSummaryMessage.value ||
        "当前发布单已执行完成、已取消或不处于待执行状态，无法再次触发发布",
    );
    return;
  }
  executeLocked.value = true;
  executing.value = true;
  try {
    await loadPrecheck({ silent: true });
    if (precheckBlocked.value) {
      message.warning(
        precheckSummaryMessage.value ||
          "当前发布单未通过执行前预检，请先处理阻塞项",
      );
      return;
    }
    const response = await executeReleaseOrder(order.value.id);
    order.value = response.data;
    message.success("发布已提交，正在调度执行");
    await loadDetail({ silent: true });
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "发布执行失败"));
  } finally {
    executing.value = false;
    executeLocked.value = false;
  }
}

async function handleApprovalAction() {
  if (!order.value) {
    return;
  }
  const comment = approvalActionComment.value.trim();
  if (approvalActionMode.value === "reject" && !comment) {
    message.warning("请先填写拒绝原因");
    return;
  }
  approvalActing.value = true;
  try {
    let response;
    switch (approvalActionMode.value) {
      case "submit":
        response = await submitReleaseOrderApproval(order.value.id, { comment });
        message.success("审批已提交");
        break;
      case "approve":
        response = await approveReleaseOrder(order.value.id, { comment });
        message.success("审批已通过");
        break;
      case "reject":
        response = await rejectReleaseOrder(order.value.id, { comment });
        message.success("审批已拒绝");
        break;
      default:
        return;
    }
    order.value = response.data;
    closeApprovalActionModal();
    await loadApprovalRecords({ silent: true });
    await loadDetail({ silent: true });
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "审批操作失败"));
  } finally {
    approvalActing.value = false;
  }
}

async function handleRollback() {
  if (!order.value || !canRollback.value) {
    return;
  }
  recovering.value = true;
  try {
    const response = await rollbackReleaseOrderByID(order.value.id);
    message.success(`已创建标准回滚单：${response.data.order_no}`);
    void router.push(`/releases/${response.data.id}`);
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "标准回滚创建失败"));
  } finally {
    recovering.value = false;
  }
}

async function handleReplay() {
  if (!order.value || !canReplay.value) {
    return;
  }
  recovering.value = true;
  try {
    const response = await replayReleaseOrderByID(order.value.id);
    message.success(replaySuccessText(order.value, response.data.order_no));
    void router.push(`/releases/${response.data.id}`);
  } catch (error) {
    message.error(
      extractHTTPErrorMessage(error, replayFailureText(order.value)),
    );
  } finally {
    recovering.value = false;
  }
}

function goBack() {
  void router.push("/releases");
}

function stopAutoRefresh() {
  if (autoRefreshTimer.value !== null) {
    window.clearInterval(autoRefreshTimer.value);
    autoRefreshTimer.value = null;
  }
}

function startAutoRefresh() {
  stopAutoRefresh();
  autoRefreshTimer.value = window.setInterval(() => {
    if (document.hidden || cancelling.value || !shouldAutoRefresh.value) {
      return;
    }
    void loadDetail({ silent: true });
  }, AUTO_REFRESH_INTERVAL_MS);
}

function closeAllLogStreams() {
  (["ci", "cd"] as ReleasePipelineScope[]).forEach((scope) => {
    closeLogStream(scope);
  });
}

onMounted(async () => {
  await loadDetail();
  startAutoRefresh();
});

onBeforeUnmount(() => {
  stopAutoRefresh();
  closeAllLogStreams();
});
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="header-left">
        <a-button @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回发布单
        </a-button>
        <div class="page-header-copy">
          <h2 class="page-title">发布单详情</h2>
          <p class="page-subtitle">
            按 CI / CD 双视图查看发布轨迹、执行状态、日志与阶段进度。
          </p>
        </div>
      </div>
      <a-space>
        <a-button @click="loadDetail">
          <template #icon>
            <ReloadOutlined />
          </template>
          刷新
        </a-button>
        <a-button
          v-if="canSubmitApproval"
          :loading="approvalActing && approvalActionMode === 'submit'"
          @click="openApprovalActionModal('submit')"
        >
          提交审批
        </a-button>
        <a-button
          v-if="canApproveOrder"
          type="primary"
          ghost
          :loading="approvalActing && approvalActionMode === 'approve'"
          @click="openApprovalActionModal('approve')"
        >
          审批通过
        </a-button>
        <a-button
          v-if="canRejectOrder"
          danger
          :loading="approvalActing && approvalActionMode === 'reject'"
          @click="openApprovalActionModal('reject')"
        >
          审批拒绝
        </a-button>
        <a-popconfirm
          v-if="canExecute"
          title="确认执行当前发布单吗？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleExecute"
        >
          <template #icon>
            <ExclamationCircleOutlined />
          </template>
          <a-button
            type="primary"
            :loading="executing"
            :disabled="executeLocked"
            >发布</a-button
          >
        </a-popconfirm>
        <a-button v-else type="primary" disabled>发布</a-button>
        <a-popconfirm
          v-if="canRollback"
          title="确认基于这张成功单创建标准回滚吗？"
          ok-text="确认回滚"
          cancel-text="取消"
          @confirm="handleRollback"
        >
          <template #icon>
            <ExclamationCircleOutlined class="danger-icon" />
          </template>
          <a-button class="rollback-trigger-button" :loading="recovering"
            >回滚到此版本</a-button
          >
        </a-popconfirm>
        <a-popconfirm
          v-else-if="canReplay"
          :title="replayConfirmTitle(order)"
          :ok-text="isCiOnlyRecovery(order) ? '确认恢复' : '确认重放'"
          cancel-text="取消"
          @confirm="handleReplay"
        >
          <template #icon>
            <ExclamationCircleOutlined />
          </template>
          <a-button class="rollback-trigger-button" :loading="recovering">{{
            replayActionText(order)
          }}</a-button>
        </a-popconfirm>
        <a-popconfirm
          v-if="canCancel"
          title="确认取消当前发布单吗？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleCancel"
        >
          <template #icon>
            <ExclamationCircleOutlined class="danger-icon" />
          </template>
          <a-button danger :loading="cancelling">取消发布</a-button>
        </a-popconfirm>
      </a-space>
    </div>

    <a-card
      class="detail-card release-hero-card"
      :loading="loading"
      :bordered="true"
    >
      <div class="release-hero">
        <div class="release-hero-main">
          <div class="release-hero-title-row">
            <div>
              <div class="release-hero-label">发布单号</div>
              <div class="release-hero-order">
                <span>{{ order?.order_no || "-" }}</span>
                <a-tag
                  v-if="order?.operation_type === 'rollback'"
                  class="status-chip status-chip-danger"
                >
                  {{ operationTypeText(order?.operation_type) }}
                </a-tag>
                <a-tag
                  v-else-if="order?.operation_type === 'replay'"
                  class="status-chip status-chip-warning"
                >
                  {{ operationTypeText(order?.operation_type) }}
                </a-tag>
              </div>
            </div>
          </div>

          <div class="release-hero-facts">
            <div v-for="item in heroFacts" :key="item.label" class="hero-fact">
              <span class="hero-fact-label">{{ item.label }}</span>
              <span class="hero-fact-value">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <div
          class="release-spotlight"
          :class="`release-spotlight-${spotlightStatusKey}`"
        >
          <div class="release-spotlight-content">
            <div class="release-spotlight-header">
              <div class="release-spotlight-label">整体进度</div>
            </div>
            <div class="release-spotlight-title">{{ spotlightTitle }}</div>
            <div class="release-spotlight-description">
              {{ spotlightDescription }}
            </div>
            <div class="release-spotlight-meta">{{ spotlightMeta }}</div>
          </div>
          <div class="release-spotlight-icon-wrap">
            <div
              class="release-spotlight-icon-orb"
              :class="`release-spotlight-icon-orb-${spotlightStatusKey}`"
            >
              <SyncOutlined
                v-if="spotlightStatusKey === 'running'"
                spin
                class="release-spotlight-icon"
              />
              <ClockCircleFilled
                v-else-if="spotlightStatusKey === 'queued'"
                class="release-spotlight-icon"
              />
              <CheckCircleFilled
                v-else-if="spotlightStatusKey === 'success'"
                class="release-spotlight-icon"
              />
              <CloseCircleFilled
                v-else-if="spotlightStatusKey === 'failed'"
                class="release-spotlight-icon"
              />
              <StopFilled
                v-else-if="spotlightStatusKey === 'cancelled'"
                class="release-spotlight-icon"
              />
              <ClockCircleFilled v-else class="release-spotlight-icon" />
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <div class="detail-dashboard">
      <div class="dashboard-main">
        <a-card
          class="detail-card"
          title="执行时间线"
          :loading="loading"
          :bordered="true"
        >
          <a-empty v-if="stepGroups.length === 0" description="暂无步骤数据" />
          <div v-else class="step-groups">
            <div
              v-for="group in stepGroups"
              :key="group.key"
              class="scope-section"
            >
              <div class="scope-section-header scope-section-header-inline">
                <a-tag class="status-chip status-chip-section">{{
                  group.title
                }}</a-tag>
                <span class="scope-section-subtitle"
                  >{{ group.items.length }} 个步骤</span
                >
              </div>
              <a-steps direction="vertical" size="small" class="step-progress">
                <a-step
                  v-for="step in group.items"
                  :key="step.id"
                  :title="step.step_name"
                  :status="stepComponentStatus(step.status)"
                >
                  <template #description>
                    <div class="step-description">{{ describeStep(step) }}</div>
                  </template>
                </a-step>
              </a-steps>
            </div>
          </div>
        </a-card>

        <a-card
          class="detail-card"
          title="阶段与日志"
          :loading="pipelineStageLoading"
          :bordered="true"
        >
          <a-tabs>
            <a-tab-pane key="stages" tab="管线进度">
              <template #tab>
                <span>管线进度</span>
              </template>
              <div class="stage-toolbar">
                <a-space>
                  <a-tag
                    v-if="pipelineStageExecutorType"
                    class="status-chip status-chip-running"
                    >{{ pipelineStageExecutorType }}</a-tag
                  >
                  <a-button size="small" @click="loadPipelineStageView"
                    >刷新阶段</a-button
                  >
                </a-space>
              </div>

              <a-alert
                v-if="pipelineStageMessage"
                class="pipeline-stage-alert"
                type="info"
                show-icon
                :message="pipelineStageMessage"
              />

              <div v-if="stageSections.length > 0" class="stage-sections">
                <div
                  v-for="section in stageSections"
                  :key="section.scope"
                  class="scope-section"
                >
                  <div class="scope-section-header scope-section-header-inline">
                    <a-tag class="status-chip status-chip-section">{{
                      section.title
                    }}</a-tag>
                    <span class="scope-section-subtitle">{{
                      section.execution?.binding_name || "-"
                    }}</span>
                  </div>

                  <a-alert
                    v-if="section.isArgoCD"
                    class="pipeline-stage-alert"
                    type="info"
                    show-icon
                    message="当前阶段来自 ArgoCD 执行链路，展示的是 GitOps 写回、Sync 与健康检查进度。"
                  />
                  <a-alert
                    v-else-if="!section.isJenkins"
                    class="pipeline-stage-alert"
                    type="info"
                    show-icon
                    :message="`${scopeLabel(section.scope)} 当前使用 ${section.execution?.provider || '未知执行器'}，部署进度视图待接入。`"
                  />
                  <a-empty
                    v-if="section.stages.length === 0"
                    :description="pipelineStageEmptyDescription(section)"
                  />
                  <a-table
                    v-else
                    row-key="id"
                    :columns="pipelineStageColumns"
                    :data-source="section.stages"
                    :pagination="false"
                    :scroll="{ x: 1200 }"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'status'">
                        <a-tag
                          :class="[
                            'status-tag',
                            statusToneClass(record.status),
                          ]"
                        >
                          <LoadingOutlined
                            v-if="isRunningStatus(record.status)"
                            spin
                          />
                          <span>{{ statusText(record.status) }}</span>
                        </a-tag>
                      </template>
                      <template v-else-if="column.key === 'duration_millis'">
                        {{ formatDuration(record.duration_millis) }}
                      </template>
                      <template v-else-if="column.key === 'started_at'">
                        {{ formatTime(record.started_at) }}
                      </template>
                      <template v-else-if="column.key === 'finished_at'">
                        {{ formatTime(record.finished_at) }}
                      </template>
                      <template v-else-if="column.key === 'actions'">
                        <a-button
                          v-if="section.isJenkins"
                          type="link"
                          size="small"
                          @click="openStageLogDrawer(record)"
                        >
                          <template #icon>
                            <EyeOutlined />
                          </template>
                          查看日志
                        </a-button>
                        <span v-else>-</span>
                      </template>
                    </template>
                  </a-table>
                </div>
              </div>
              <a-empty v-else description="暂无管线进度数据" />
            </a-tab-pane>

            <a-tab-pane key="logs" tab="实时日志">
              <template #tab>
                <span>实时日志</span>
              </template>
              <div class="log-sections">
                <a-card
                  v-for="section in logSections"
                  :key="section.scope"
                  class="nested-card"
                  :title="section.title"
                  :bordered="false"
                >
                  <template #extra>
                    <a-space v-if="section.isJenkins">
                      <a-tag
                        v-if="logStreamHintText(section.scope)"
                        :color="logStreamTagColor(section.scope)"
                        >{{ logStreamHintText(section.scope) }}</a-tag
                      >
                      <a-switch
                        size="small"
                        :checked="section.state.autoFollow"
                        checked-children="跟随"
                        un-checked-children="暂停"
                        @change="handleLogFollowChange(section.scope, $event)"
                      />
                      <a-button
                        size="small"
                        @click="jumpLogToBottom(section.scope)"
                        >底部</a-button
                      >
                      <a-button
                        size="small"
                        @click="reconnectLogStream(section.scope)"
                        :loading="section.state.connecting"
                        >重连</a-button
                      >
                      <a-button
                        size="small"
                        @click="clearLogOutput(section.scope)"
                        >清空</a-button
                      >
                    </a-space>
                  </template>

                  <a-alert
                    v-if="!section.isJenkins"
                    class="log-alert"
                    type="info"
                    show-icon
                    :message="
                      section.execution?.provider === 'argocd'
                        ? `${scopeLabel(section.scope)} 当前使用 ArgoCD，当前版本先展示执行进度；事件流/日志视图将在后续版本补齐。`
                        : `${scopeLabel(section.scope)} 当前使用 ${section.execution?.provider || '未知执行器'}，独立日志视图待接入。`
                    "
                  />
                  <template v-else>
                    <a-alert
                      v-if="logSectionWarningMessage(section.scope)"
                      class="log-alert"
                      type="warning"
                      show-icon
                      :message="logSectionWarningMessage(section.scope)"
                    />
                    <pre
                      :ref="
                        (el) =>
                          setLogPanelRef(section.scope, el as Element | null)
                      "
                      class="log-panel"
                      @scroll="syncLogFollowState(section.scope)"
                      >{{
                        section.state.text ||
                        logSectionEmptyDescription(section.scope)
                      }}</pre
                    >
                  </template>
                </a-card>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>

        <a-collapse class="detail-collapse" ghost>
          <a-collapse-panel key="base-info" header="基础信息与参数快照">
            <a-card
              class="nested-card"
              title="基础信息"
              :loading="loading"
              :bordered="false"
            >
              <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
                <a-descriptions-item
                  v-for="item in detailItems"
                  :key="item.key || item.label"
                  :label="item.label"
                >
                  <template v-if="item.key === 'order_no'">
                    <a-space :size="6">
                      <span>{{ item.value }}</span>
                      <a-tag
                        v-if="order?.operation_type === 'rollback'"
                        class="status-chip status-chip-danger"
                      >
                        {{ operationTypeText(order?.operation_type) }}
                      </a-tag>
                      <a-tag
                        v-else-if="order?.operation_type === 'replay'"
                        class="status-chip status-chip-warning"
                      >
                        {{ operationTypeText(order?.operation_type) }}
                      </a-tag>
                    </a-space>
                  </template>
                  <template v-else>
                    {{ item.value }}
                  </template>
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

            <template v-if="canViewParamSnapshot">
              <a-card
                v-for="group in paramGroups"
                :key="group.scope"
                class="nested-card"
                :title="group.title"
                :loading="loading"
                :bordered="false"
              >
                <a-empty
                  v-if="group.items.length === 0"
                  description="暂无参数快照"
                />
                <a-table
                  v-else
                  row-key="id"
                  :columns="paramColumns"
                  :data-source="group.items"
                  :pagination="false"
                  :scroll="{ x: 1200 }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'created_at'">
                      {{ formatTime(record.created_at) }}
                    </template>
                    <template v-else-if="column.key === 'param_value'">
                      {{ record.param_value || "-" }}
                    </template>
                  </template>
                </a-table>
              </a-card>
            </template>
          </a-collapse-panel>
        </a-collapse>
      </div>

      <div class="dashboard-side">
        <a-card
          v-if="showConcurrentBatchCard"
          class="detail-card"
          title="并发批次进度"
          :loading="concurrentBatchLoading"
          :bordered="true"
        >
          <div class="batch-progress-meta">
            <div class="batch-progress-badge">
              <span class="batch-progress-label">批次号</span>
              <span class="batch-progress-value">{{
                concurrentBatchProgress?.batch_no ||
                order?.concurrent_batch_no ||
                "-"
              }}</span>
            </div>
            <div class="batch-progress-stats">
              <div
                v-for="item in concurrentBatchSummary"
                :key="item.label"
                class="batch-progress-stat"
              >
                <span class="batch-progress-stat-label">{{ item.label }}</span>
                <span class="batch-progress-stat-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <a-empty
            v-if="!concurrentBatchProgress?.items?.length"
            description="暂无并发批次进度"
          />
          <div v-else class="batch-progress-list">
            <div
              v-for="item in concurrentBatchProgress.items"
              :key="item.order_id"
              class="batch-progress-item"
            >
              <div class="batch-progress-item-main">
                <div class="batch-progress-item-order">
                  <span>#{{ item.concurrent_batch_seq || "-" }}</span>
                  <span>{{ item.order_no }}</span>
                </div>
                <div class="batch-progress-item-meta">
                  <span>{{ item.application_name || "-" }}</span>
                  <span>{{ item.env_code || "-" }}</span>
                  <span>{{ operationTypeText(item.operation_type) }}</span>
                </div>
              </div>
              <div class="batch-progress-item-side">
                <a-tag
                  :class="[
                    'status-tag',
                    concurrentQueueToneClass(item.queue_state),
                  ]"
                >
                  <LoadingOutlined
                    v-if="
                      item.queue_state === 'executing' ||
                      item.queue_state === 'queued'
                    "
                    :spin="item.queue_state === 'executing'"
                  />
                  <span>{{ concurrentQueueStateText(item.queue_state) }}</span>
                </a-tag>
                <div
                  v-if="item.queue_position > 0"
                  class="batch-progress-item-position"
                >
                  队列位次 {{ item.queue_position }}
                </div>
              </div>
            </div>
          </div>
        </a-card>

        <a-card
          v-if="showApprovalCard"
          class="detail-card"
          title="审批进度"
          :loading="loading || approvalRecordsLoading"
          :bordered="true"
        >
          <div class="approval-summary">
            <div class="approval-summary-head">
              <div>
                <div class="approval-summary-title">
                  {{ statusText(currentBusinessStatus) }}
                </div>
                <div class="approval-summary-subtitle">
                  {{ approvalStatusSummary }}
                </div>
              </div>
              <a-tag
                :class="['status-tag', statusToneClass(currentBusinessStatus)]"
              >
                <LoadingOutlined
                  v-if="
                    currentBusinessStatus === 'approving' ||
                    currentBusinessStatus === 'pending_approval'
                  "
                  :spin="currentBusinessStatus === 'approving'"
                />
                <span>{{ statusText(currentBusinessStatus) }}</span>
              </a-tag>
            </div>
            <div class="approval-meta-grid">
              <div class="approval-meta-item">
                <span class="approval-meta-label">审批方式</span>
                <span class="approval-meta-value">{{
                  approvalModeText(order?.approval_mode)
                }}</span>
              </div>
              <div class="approval-meta-item">
                <span class="approval-meta-label">审批人</span>
                <span class="approval-meta-value">{{
                  (order?.approval_approver_names || []).join(" / ") || "-"
                }}</span>
              </div>
              <div class="approval-meta-item" v-if="order?.approved_at">
                <span class="approval-meta-label">通过时间</span>
                <span class="approval-meta-value">{{
                  formatTime(order?.approved_at || null)
                }}</span>
              </div>
              <div class="approval-meta-item" v-if="order?.rejected_at">
                <span class="approval-meta-label">拒绝时间</span>
                <span class="approval-meta-value">{{
                  formatTime(order?.rejected_at || null)
                }}</span>
              </div>
            </div>
            <a-alert
              v-if="order?.rejected_reason"
              class="pipeline-stage-alert"
              type="warning"
              show-icon
              :message="`拒绝原因：${order.rejected_reason}`"
            />
          </div>

          <div class="approval-records">
            <div class="approval-records-header">
              <span>审批记录</span>
              <span>{{ displayApprovalRecords.length }} 条</span>
            </div>
            <a-empty
              v-if="displayApprovalRecords.length === 0"
              description="当前还没有审批动作记录"
            />
            <div v-else class="approval-record-list">
              <div
                v-for="record in displayApprovalRecords"
                :key="record.id"
                class="approval-record-item"
              >
                <div class="approval-record-main">
                  <div class="approval-record-title-row">
                    <span class="approval-record-title">{{
                      approvalActionText(record.action)
                    }}</span>
                    <a-tag class="status-chip status-chip-section">
                      {{ record.operator_name || record.operator_user_id || "-" }}
                    </a-tag>
                  </div>
                  <div class="approval-record-time">
                    {{ formatTime(record.created_at) }}
                  </div>
                  <div v-if="record.comment" class="approval-record-comment">
                    {{ record.comment }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-card>

        <a-card
          v-if="showPrecheckCard"
          class="detail-card"
          title="执行前预检"
          :loading="precheckLoading"
          :bordered="true"
        >
          <a-alert
            v-if="precheckSummaryMessage"
            class="pipeline-stage-alert"
            :type="precheckSummaryTone"
            show-icon
            :message="precheckSummaryMessage"
          />
          <div v-if="precheck?.items?.length" class="precheck-list">
            <div
              v-for="item in precheck.items"
              :key="item.key"
              class="precheck-item"
            >
              <div class="precheck-item-copy">
                <div class="precheck-item-name">{{ item.name }}</div>
                <div class="precheck-item-message">{{ item.message }}</div>
              </div>
              <a-tag :class="['status-tag', precheckToneClass(item.status)]">
                <LoadingOutlined v-if="item.status === 'warn'" spin />
                <span>{{ precheckStatusText(item.status) }}</span>
              </a-tag>
            </div>
          </div>
          <a-empty v-else description="暂无预检结果" />
        </a-card>

        <a-card
          class="detail-card"
          title="执行单元"
          :loading="loading"
          :bordered="true"
        >
          <div class="execution-stack">
            <div
              v-for="item in executionSections"
              :key="item.scope"
              class="execution-summary-card"
            >
              <div class="execution-summary-head">
                <div>
                  <div class="execution-summary-title">{{ item.title }}</div>
                  <div class="execution-summary-subtitle">
                    {{ item.execution.binding_name || "-" }}
                  </div>
                </div>
                <a-tag
                  :class="[
                    'status-tag',
                    statusToneClass(item.execution.status),
                  ]"
                >
                  <LoadingOutlined
                    v-if="isRunningStatus(item.execution.status)"
                    spin
                  />
                  <span>{{ statusText(item.execution.status) }}</span>
                </a-tag>
              </div>
              <div class="execution-summary-meta">
                <span>执行器：{{ item.execution.provider || "-" }}</span>
                <span>开始：{{ formatTime(item.execution.started_at) }}</span>
                <span>结束：{{ formatTime(item.execution.finished_at) }}</span>
              </div>
            </div>
          </div>

          <div class="execution-extra-section">
            <a-empty
              v-if="hookProgressItems.length === 0"
              description="当前发布单未产生 Hook 执行记录"
            />
            <div v-else class="execution-substack">
              <div
                v-for="group in hookProgressGroups"
                :key="group.type"
                class="execution-summary-card execution-summary-card-hook"
              >
                <div class="execution-summary-head">
                  <div>
                    <div class="execution-summary-title">{{ group.title }}</div>
                    <div class="execution-summary-subtitle">
                      {{ hookGroupSummaryText(group) }}
                    </div>
                  </div>
                  <a-tag
                    :class="['status-tag', hookToneClass(group.overallStatus)]"
                  >
                    <LoadingOutlined
                      v-if="group.overallStatus === 'running'"
                      spin
                    />
                    <span>{{ hookStatusText(group.overallStatus) }}</span>
                  </a-tag>
                </div>

                <div class="hook-progress-rows">
                  <div
                    v-for="item in group.items"
                    :key="item.id"
                    class="hook-progress-row"
                  >
                    <div class="hook-progress-row-main">
                      <div class="hook-progress-item-name-row">
                        <span class="hook-progress-item-index"
                          >#{{ item.order_index }}</span
                        >
                        <span class="hook-progress-item-name">{{
                          item.step_name
                        }}</span>
                        <a-tag
                          :class="['status-tag', hookToneClass(item.status)]"
                        >
                          <LoadingOutlined v-if="item.status === 'running'" spin />
                          <span>{{ hookStatusText(item.status) }}</span>
                        </a-tag>
                      </div>
                      <div class="hook-progress-row-detail">
                        {{ hookExecutionContentText(item) }}
                      </div>
                      <div class="hook-progress-row-meta">
                        <span>{{ item.step_code }}</span>
                        <span>开始：{{ formatTime(item.started_at) }}</span>
                        <span>结束：{{ formatTime(item.finished_at) }}</span>
                      </div>
                    </div>
                    <div class="hook-progress-item-actions">
                      <a-button
                        type="link"
                        size="small"
                        @click="toggleHookVariables(item.id)"
                      >
                        {{
                          expandedHookVariableMap[item.id] ? "收起变量" : "查看变量"
                        }}
                      </a-button>
                      <a-button
                        type="link"
                        size="small"
                        @click="toggleHookLogs(item.id)"
                      >
                        {{ expandedHookLogMap[item.id] ? "收起日志" : "查看日志" }}
                      </a-button>
                    </div>
                    <div
                      v-if="expandedHookVariableMap[item.id]"
                      class="hook-progress-panel"
                    >
                      <div class="hook-progress-panel-title">
                        变量预览（兼容视图）
                      </div>
                      <div class="hook-progress-context-grid">
                        <div
                          v-for="contextItem in hookContextPreviewItems"
                          :key="`${item.id}-${contextItem.label}`"
                          class="hook-progress-context-item"
                        >
                          <span class="hook-progress-context-label">{{
                            contextItem.label
                          }}</span>
                          <span class="hook-progress-context-value">{{
                            contextItem.value
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="expandedHookLogMap[item.id]"
                      class="hook-progress-panel"
                    >
                      <div class="hook-progress-panel-title">执行日志</div>
                      <pre class="hook-progress-log">{{
                        item.summary ||
                        "暂无独立日志输出，当前 Hook 仍在等待后端日志链路接入。"
                      }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-card>

        <a-card
          class="detail-card"
          title="发布上下文"
          :loading="loading"
          :bordered="true"
        >
          <div class="context-list">
            <div
              v-for="item in contextFacts"
              :key="item.label"
              class="context-item"
            >
              <span class="context-label">{{ item.label }}</span>
              <span class="context-value">{{ item.value }}</span>
            </div>
          </div>
        </a-card>

        <template v-if="canViewParamSnapshot">
          <a-card
            v-for="group in valueProgressGroups"
            :key="`value-${group.scope}`"
            class="detail-card"
            :title="group.title"
            :loading="loading"
            :bordered="true"
          >
            <a-alert
              class="pipeline-stage-alert"
              type="info"
              show-icon
              message="这里展示模板中已映射标准 Key 的实时取值情况。"
            />
            <a-table
              row-key="rowKey"
              :columns="valueProgressColumns"
              :data-source="
                group.items.map((item) => ({
                  ...item,
                  rowKey: `${item.pipeline_scope}-${item.param_key}-${item.executor_param_name}`,
                }))
              "
              :pagination="false"
              size="small"
              :scroll="{ x: 1200 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag
                    :class="[
                      'status-tag',
                      valueProgressToneClass(record.status),
                    ]"
                  >
                    <LoadingOutlined v-if="record.status === 'running'" spin />
                    <span>{{ valueProgressStatusText(record.status) }}</span>
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'value'">
                  {{ record.value || "-" }}
                </template>
                <template v-else-if="column.key === 'value_source'">
                  {{ record.value_source || "-" }}
                </template>
                <template v-else-if="column.key === 'updated_at'">
                  {{ formatTime(record.updated_at) }}
                </template>
                <template v-else-if="column.key === 'param_name'">
                  <span>{{ record.param_name || "-" }}</span>
                  <a-tag
                    v-if="record.required"
                    class="required-tag status-chip status-chip-danger"
                    >必需</a-tag
                  >
                </template>
              </template>
            </a-table>
          </a-card>
        </template>
      </div>
    </div>

    <a-drawer
      :open="stageLogDrawerVisible"
      :width="760"
      :title="
        selectedPipelineStage
          ? `${selectedPipelineStage.pipeline_scope?.toUpperCase() || ''} 阶段日志 · ${selectedPipelineStage.stage_name}`
          : '阶段日志'
      "
      @close="closeStageLogDrawer"
    >
      <template #extra>
        <a-space>
          <a-tag
            v-if="selectedPipelineStage"
            :class="[
              'status-tag',
              statusToneClass(selectedPipelineStage.status),
            ]"
          >
            {{ statusText(selectedPipelineStage.status) }}
          </a-tag>
          <a-button
            size="small"
            :loading="stageLogLoading"
            @click="loadStageLog"
            >刷新日志</a-button
          >
        </a-space>
      </template>

      <a-alert
        v-if="stageLogFetchedAt"
        class="pipeline-stage-alert"
        type="info"
        show-icon
        :message="`最近同步时间：${stageLogFetchedAt}${stageLogHasMore ? '，当前阶段仍在持续输出日志' : ''}`"
      />
      <pre class="log-panel stage-log-panel">{{
        stageLogContent || "暂无阶段日志输出"
      }}</pre>
    </a-drawer>

    <a-modal
      :open="approvalActionModalVisible"
      :title="approvalActionModalTitle"
      :confirm-loading="approvalActing"
      :ok-text="approvalActionModalOkText"
      cancel-text="取消"
      @ok="handleApprovalAction"
      @cancel="closeApprovalActionModal"
    >
      <a-form layout="vertical">
        <a-form-item
          :label="approvalActionMode === 'reject' ? '拒绝原因' : '审批备注'"
          :required="approvalActionMode === 'reject'"
        >
          <a-textarea
            v-model:value="approvalActionComment"
            :rows="4"
            :maxlength="400"
            :placeholder="approvalActionPlaceholder"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-card {
  border-radius: var(--radius-xl);
}

.release-hero-card {
  overflow: hidden;
  background:
    radial-gradient(
      circle at top left,
      var(--color-primary-glow),
      transparent 34%
    ),
    linear-gradient(
      180deg,
      var(--color-bg-card) 0%,
      var(--color-bg-subtle) 100%
    );
}

.release-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.9fr);
  gap: 20px;
  align-items: stretch;
}

.release-hero-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.release-hero-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.release-hero-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.release-hero-order {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 26px;
  font-weight: 800;
  color: var(--color-dashboard-900);
  word-break: break-all;
}

.release-hero-status {
  align-self: flex-start;
  padding: 7px 14px;
  font-size: 13px;
  box-shadow: 0 10px 26px rgba(37, 99, 235, 0.12);
}

.release-hero-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.hero-fact {
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid var(--color-panel-border-strong);
  background: rgba(255, 255, 255, 0.78);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-fact-label {
  font-size: 12px;
  color: var(--color-text-soft);
}

.hero-fact-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-dashboard-900);
  word-break: break-word;
}

.release-spotlight {
  border-radius: 22px;
  align-self: stretch;
  border: 1px solid rgba(96, 165, 250, 0.22);
  background:
    radial-gradient(
      circle at top right,
      rgba(96, 165, 250, 0.14),
      transparent 42%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 250, 252, 0.94) 100%
    );
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
  padding: 24px 26px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: 22px;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.release-spotlight-success {
  border-color: rgba(74, 222, 128, 0.38);
  background:
    radial-gradient(
      circle at top right,
      rgba(74, 222, 128, 0.16),
      transparent 40%
    ),
    linear-gradient(
      180deg,
      rgba(240, 253, 244, 0.98) 0%,
      rgba(248, 250, 252, 0.94) 100%
    );
}

.release-spotlight-running {
  border-color: rgba(96, 165, 250, 0.38);
  background:
    radial-gradient(
      circle at top right,
      rgba(96, 165, 250, 0.16),
      transparent 40%
    ),
    linear-gradient(
      180deg,
      rgba(239, 246, 255, 0.98) 0%,
      rgba(248, 250, 252, 0.94) 100%
    );
}

.release-spotlight-failed {
  border-color: rgba(251, 113, 133, 0.34);
  background:
    radial-gradient(
      circle at top right,
      rgba(251, 113, 133, 0.14),
      transparent 40%
    ),
    linear-gradient(
      180deg,
      rgba(255, 241, 242, 0.98) 0%,
      rgba(255, 250, 250, 0.94) 100%
    );
}

.release-spotlight-queued,
.release-spotlight-cancelled,
.release-spotlight-pending {
  border-color: rgba(251, 191, 36, 0.34);
  background:
    radial-gradient(
      circle at top right,
      rgba(251, 191, 36, 0.14),
      transparent 40%
    ),
    linear-gradient(
      180deg,
      rgba(255, 247, 237, 0.98) 0%,
      rgba(255, 251, 235, 0.94) 100%
    );
}

.release-spotlight-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.release-spotlight-icon-orb {
  width: 60px;
  height: 60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 10px 24px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(10px);
}

.release-spotlight-icon-orb-success {
  color: #15803d;
  background: linear-gradient(
    180deg,
    rgba(240, 253, 244, 0.9) 0%,
    rgba(255, 255, 255, 0.74) 100%
  );
  border-color: rgba(134, 239, 172, 0.4);
}

.release-spotlight-icon-orb-running {
  color: #1d4ed8;
  background: linear-gradient(
    180deg,
    rgba(239, 246, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.74) 100%
  );
  border-color: rgba(147, 197, 253, 0.4);
}

.release-spotlight-icon-orb-failed {
  color: #b91c1c;
  background: linear-gradient(
    180deg,
    rgba(255, 241, 242, 0.9) 0%,
    rgba(255, 255, 255, 0.74) 100%
  );
  border-color: rgba(253, 164, 175, 0.42);
}

.release-spotlight-icon-orb-queued,
.release-spotlight-icon-orb-cancelled,
.release-spotlight-icon-orb-pending {
  color: #b45309;
  background: linear-gradient(
    180deg,
    rgba(255, 247, 237, 0.92) 0%,
    rgba(255, 255, 255, 0.74) 100%
  );
  border-color: rgba(253, 186, 116, 0.42);
}

.release-spotlight-icon {
  font-size: 24px;
}

.release-spotlight-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.release-spotlight-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.release-spotlight-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.release-spotlight-title {
  font-size: 24px;
  line-height: 1.2;
  font-weight: 800;
  color: var(--color-dashboard-900);
}

.release-spotlight-description {
  color: var(--color-text-secondary);
  line-height: 1.9;
  max-width: 520px;
}

.release-spotlight-meta {
  color: var(--color-text-soft);
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.detail-dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.9fr);
  gap: 18px;
  align-items: start;
}

.dashboard-main,
.dashboard-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.execution-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.execution-extra-section {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.execution-extra-section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.execution-extra-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.execution-extra-section-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.execution-summary-card {
  padding: 16px;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at top right,
      rgba(59, 130, 246, 0.1),
      transparent 38%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.96) 0%,
      rgba(248, 250, 252, 0.96) 100%
    );
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
}

.execution-summary-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.execution-summary-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-main);
}

.execution-summary-subtitle {
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.execution-summary-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 14px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.execution-summary-caption {
  margin-top: 12px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.execution-substack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scope-section + .scope-section {
  margin-top: 20px;
}

.scope-section-header {
  margin-bottom: 12px;
}

.scope-section-header-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.scope-section-subtitle {
  font-size: 12px;
  color: var(--color-text-soft);
}

.step-description {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.danger-icon {
  color: var(--color-danger);
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 5px 10px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.status-tag :deep(.anticon),
.status-chip :deep(.anticon) {
  color: currentColor;
}

.status-pill-success {
  color: #15803d;
  background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.status-pill-running {
  color: #1d4ed8;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #93c5fd;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.status-pill-failed {
  color: #b91c1c;
  background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
  border-color: #fda4af;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.status-pill-pending {
  color: #b45309;
  background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%);
  border-color: #fdba74;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.status-pill-warning {
  color: #c2410c;
  background: linear-gradient(180deg, #fff7ed 0%, #fed7aa 100%);
  border-color: #fdba74;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.status-pill-neutral {
  color: #475569;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-color: #cbd5e1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.status-chip {
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  border: 1px solid transparent;
}

.status-chip-section {
  color: #0f172a;
  background: linear-gradient(
    180deg,
    rgba(226, 232, 240, 0.92) 0%,
    rgba(203, 213, 225, 0.85) 100%
  );
  border-color: rgba(148, 163, 184, 0.46);
}

.status-chip-running {
  color: #1d4ed8;
  background: linear-gradient(
    180deg,
    rgba(239, 246, 255, 0.96) 0%,
    rgba(219, 234, 254, 0.9) 100%
  );
  border-color: rgba(96, 165, 250, 0.56);
}

.status-chip-danger {
  color: #b91c1c;
  background: linear-gradient(
    180deg,
    rgba(255, 241, 242, 0.98) 0%,
    rgba(255, 228, 230, 0.92) 100%
  );
  border-color: rgba(251, 113, 133, 0.48);
}

.required-tag {
  margin-left: 8px;
}

.precheck-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hook-progress-item-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hook-progress-item-index {
  color: var(--color-text-soft);
  font-size: 12px;
  font-weight: 700;
}

.hook-progress-item-name {
  color: var(--color-text-main);
  font-size: 14px;
  font-weight: 700;
}

.execution-summary-card-hook {
  padding: 14px 16px;
}

.hook-progress-rows {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
}

.hook-progress-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;
  border-top: 1px dashed rgba(148, 163, 184, 0.2);
}

.hook-progress-row:first-child {
  padding-top: 4px;
  border-top: none;
}

.hook-progress-row-main {
  min-width: 0;
}

.hook-progress-row-detail {
  margin-top: 8px;
  color: var(--color-text-main);
  font-size: 13px;
  line-height: 1.7;
}

.hook-progress-row-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.hook-progress-item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.hook-progress-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(248, 250, 252, 0.72);
}

.hook-progress-panel-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-main);
}

.hook-progress-context-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.hook-progress-context-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(255, 255, 255, 0.9);
}

.hook-progress-context-label {
  color: var(--color-text-soft);
  font-size: 12px;
}

.hook-progress-context-value {
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 700;
  word-break: break-word;
}

.hook-progress-log {
  margin: 0;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
}

.precheck-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--color-panel-divider);
}

.precheck-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.precheck-item-copy {
  min-width: 0;
}

.precheck-item-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.precheck-item-message {
  margin-top: 4px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.approval-summary {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.approval-summary-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.approval-summary-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-main);
}

.approval-summary-subtitle {
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.approval-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.approval-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(248, 250, 252, 0.7);
}

.approval-meta-label {
  color: var(--color-text-soft);
  font-size: 12px;
}

.approval-meta-value {
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 700;
  word-break: break-word;
}

.approval-records {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
}

.approval-records-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.approval-record-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.approval-record-item {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(248, 250, 252, 0.72);
}

.approval-record-main {
  min-width: 0;
}

.approval-record-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.approval-record-title {
  color: var(--color-text-main);
  font-size: 14px;
  font-weight: 700;
}

.approval-record-time {
  margin-top: 6px;
  color: var(--color-text-soft);
  font-size: 12px;
}

.approval-record-comment {
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.7;
  word-break: break-word;
}

.context-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.context-item {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--color-panel-divider);
}

.context-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.context-label {
  color: var(--color-text-soft);
  font-size: 13px;
}

.context-value {
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 600;
  word-break: break-word;
}

.log-alert,
.pipeline-stage-alert {
  margin-bottom: 12px;
  border-radius: 16px;
  border-width: 1px;
  border-style: solid;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.84),
    0 10px 24px rgba(15, 23, 42, 0.04);
}

.log-alert :deep(.ant-alert-icon),
.pipeline-stage-alert :deep(.ant-alert-icon) {
  color: var(--color-primary-500);
}

.log-alert :deep(.ant-alert-message),
.pipeline-stage-alert :deep(.ant-alert-message) {
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
}

.log-alert :deep(.ant-alert-description),
.pipeline-stage-alert :deep(.ant-alert-description) {
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.log-alert.ant-alert-info,
.pipeline-stage-alert.ant-alert-info {
  background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
  border-color: #93c5fd;
}

.log-alert.ant-alert-info :deep(.ant-alert-message),
.log-alert.ant-alert-info :deep(.ant-alert-icon),
.pipeline-stage-alert.ant-alert-info :deep(.ant-alert-message),
.pipeline-stage-alert.ant-alert-info :deep(.ant-alert-icon) {
  color: #1d4ed8;
}

.log-alert.ant-alert-warning,
.pipeline-stage-alert.ant-alert-warning {
  background: linear-gradient(180deg, #fff7ed 0%, #fffbeb 100%);
  border-color: #fdba74;
}

.log-alert.ant-alert-warning :deep(.ant-alert-message),
.log-alert.ant-alert-warning :deep(.ant-alert-icon),
.pipeline-stage-alert.ant-alert-warning :deep(.ant-alert-message),
.pipeline-stage-alert.ant-alert-warning :deep(.ant-alert-icon) {
  color: #b45309;
}

.log-alert.ant-alert-error,
.pipeline-stage-alert.ant-alert-error {
  background: linear-gradient(180deg, #fff1f2 0%, #fff5f5 100%);
  border-color: #fda4af;
}

.log-alert.ant-alert-error :deep(.ant-alert-message),
.log-alert.ant-alert-error :deep(.ant-alert-icon),
.pipeline-stage-alert.ant-alert-error :deep(.ant-alert-message),
.pipeline-stage-alert.ant-alert-error :deep(.ant-alert-icon) {
  color: #b91c1c;
}

.stage-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.stage-toolbar :deep(.ant-btn .anticon),
.page-header :deep(.ant-btn .anticon) {
  color: currentColor;
}

:deep(.step-progress .ant-steps-item-icon) {
  border-width: 1px;
  border-style: solid;
  border-color: #cbd5e1;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

:deep(.step-progress .ant-steps-item-icon > .ant-steps-icon) {
  color: #64748b;
  font-weight: 700;
}

:deep(.step-progress .ant-steps-item-process .ant-steps-item-icon) {
  border-color: #60a5fa;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.26);
}

:deep(
  .step-progress .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon
) {
  color: #eff6ff;
}

:deep(.step-progress .ant-steps-item-finish .ant-steps-item-icon) {
  border-color: #4ade80;
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 12px 24px rgba(22, 163, 74, 0.24);
}

:deep(
  .step-progress .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon
) {
  color: #f0fdf4;
}

:deep(.step-progress .ant-steps-item-error .ant-steps-item-icon) {
  border-color: #fb7185;
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 12px 24px rgba(220, 38, 38, 0.2);
}

:deep(
  .step-progress .ant-steps-item-error .ant-steps-item-icon > .ant-steps-icon
) {
  color: #fff1f2;
}

:deep(.step-progress .ant-steps-item-wait .ant-steps-item-icon) {
  border-color: #fbbf24;
  background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%);
  box-shadow: none;
}

:deep(
  .step-progress .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon
) {
  color: #b45309;
}

.nested-card {
  border-radius: 16px;
}

.detail-collapse :deep(.ant-collapse-item) {
  border-radius: 16px !important;
  background: var(--color-bg-card);
  border: 1px solid var(--color-panel-border);
  overflow: hidden;
}

.detail-collapse :deep(.ant-collapse-header) {
  font-weight: 700;
}

.detail-collapse :deep(.ant-collapse-content-box) {
  padding-top: 8px;
}

.log-panel {
  margin: 0;
  min-height: 260px;
  max-height: 480px;
  overflow: auto;
  padding: 14px;
  border-radius: 10px;
  background: #141414;
  color: #f5f5f5;
  font-size: 12px;
  line-height: 1.6;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

.stage-log-panel {
  min-height: 220px;
}

.rollback-trigger-button {
  color: #0f172a;
  border-color: rgba(15, 23, 42, 0.18);
}

.rollback-trigger-button:hover,
.rollback-trigger-button:focus {
  color: #020617;
  border-color: rgba(15, 23, 42, 0.36);
  background: rgba(15, 23, 42, 0.04);
}

.batch-progress-meta {
  display: grid;
  gap: 14px;
}

.batch-progress-badge {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 14px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-panel-border);
}

.batch-progress-label,
.batch-progress-stat-label,
.batch-progress-item-position {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.batch-progress-value,
.batch-progress-stat-value {
  color: var(--color-text-main);
  font-weight: 700;
}

.batch-progress-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.batch-progress-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-panel-border);
}

.batch-progress-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.batch-progress-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--color-panel-border);
  background: var(--color-bg-card);
}

.batch-progress-item-main,
.batch-progress-item-side {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.batch-progress-item-order {
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--color-text-main);
  font-weight: 700;
}

.batch-progress-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.batch-progress-item-side {
  align-items: flex-end;
}

@media (max-width: 768px) {
  .release-hero,
  .detail-dashboard {
    grid-template-columns: 1fr;
  }

  .release-spotlight {
    grid-template-columns: 1fr;
    padding: 20px 18px;
  }

  .release-spotlight-icon-wrap {
    justify-content: flex-start;
  }

  .release-spotlight-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .release-hero-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .release-hero-order {
    font-size: 20px;
  }

  .context-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .hook-progress-summary,
  .hook-progress-item-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .hook-progress-context-grid {
    grid-template-columns: 1fr;
  }

  .approval-meta-grid {
    grid-template-columns: 1fr;
  }

  .approval-record-title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .batch-progress-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .batch-progress-item {
    flex-direction: column;
  }

  .batch-progress-item-side {
    align-items: flex-start;
  }
}
</style>
