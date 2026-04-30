<script setup lang="ts">
import {
  CheckCircleFilled,
  ClockCircleFilled,
  DeleteOutlined,
  DownOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  CloseCircleFilled,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import * as echarts from "echarts/core";
import type { ECharts } from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { listApplications } from "../../api/application";
import { getReleaseSettings } from "../../api/system";
import {
  batchDeleteReleaseOrders,
  batchExecuteReleaseOrders,
  buildReleaseOrder,
  cancelReleaseOrder,
  confirmReleaseOrderLive,
  deleteReleaseOrder,
  deployReleaseOrder,
  executeReleaseOrder,
  getReleaseOrderStats,
  getReleaseOrderByID,
  getReleaseOrderPrecheck,
  listReleaseOrderParams,
  listReleaseOrders,
  replayReleaseOrderByID,
  rollbackReleaseOrderByID,
} from "../../api/release";
import { useResizableColumns } from "../../composables/useResizableColumns";
import { useAuthStore } from "../../stores/auth";
import type {
  BatchExecuteStagedDispatchMode,
  BatchExecuteReleaseOrdersPayload,
  ReleaseOperationType,
  ReleaseOrder,
  ReleaseOrderBusinessStatus,
  ReleaseOrderParam,
  ReleaseOrderPrecheck,
  ReleaseOrderStatus,
  ReleaseOrderDispatchAction,
  ReleaseTriggerType,
} from "../../types/release";
import { extractHTTPErrorMessage } from "../../utils/http-error";

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

interface SelectOption {
  label: string;
  value: string;
}

interface ApprovalFlowNode {
  key: string;
  title: string;
  caption: string;
  tone: "done" | "active" | "pending" | "rejected";
}


const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const statusOptions: Array<{ label: string; value: ReleaseOrderStatus | "" }> =
  [
    { label: "待执行", value: "pending" },
    { label: "待审批", value: "pending_approval" },
    { label: "审批中", value: "approving" },
    { label: "已批准", value: "approved" },
    { label: "构建中", value: "building" },
    { label: "已构建待部署", value: "built_waiting_deploy" },
    { label: "审批拒绝", value: "rejected" },
    { label: "排队中", value: "queued" },
    { label: "发布中", value: "deploying" },
    { label: "发布成功", value: "deploy_success" },
    { label: "发布失败", value: "deploy_failed" },
    { label: "已取消", value: "cancelled" },
  ];

const triggerTypeOptions: Array<{
  label: string;
  value: ReleaseTriggerType | "";
}> = [
  { label: "全部方式", value: "" },
  { label: "手动", value: "manual" },
  { label: "Webhook", value: "webhook" },
  { label: "定时", value: "schedule" },
];

const operationTypeOptions: Array<{
  label: string;
  value: ReleaseOperationType | "";
}> = [
  { label: "全部类型", value: "" },
  { label: "普通发布", value: "deploy" },
  { label: "标准回滚", value: "rollback" },
  { label: "标准重放", value: "replay" },
];

const loading = ref(false);
const querying = ref(false);
const pendingReloadOptions = ref<{ silent?: boolean } | null>(null);
const cancellingID = ref("");
const deletingID = ref("");
const confirmingLiveID = ref("");
const executingID = ref("");
const recoveringID = ref("");
const batchExecuting = ref(false);
const batchDeleting = ref(false);
const dataSource = ref<ReleaseOrder[]>([]);
const total = ref(0);
const lastLoadedAt = ref("");
const selectedOrderIDs = ref<string[]>([]);
const spotlightOrderItems = ref<ReleaseOrder[]>([]);
const overviewQueryKey = ref("");
const overviewStatusStats = ref({
  total: 0,
  pending: 0,
  running: 0,
  success: 0,
  failed: 0,
  cancelled: 0,
});

const overviewChartRef = ref<HTMLElement | null>(null);
let overviewChart: ECharts | null = null;

const applicationsLoading = ref(false);
const envOptionsLoading = ref(false);
const applicationOptions = ref<SelectOption[]>([]);
const releaseEnvOptions = ref<SelectOption[]>([]);

const executePreviewVisible = ref(false);
const executePreviewLoading = ref(false);
const executeSubmitting = ref(false);
const executePreviewAction = ref<ReleaseOrderDispatchAction>("execute");
const executePreviewOrder = ref<ReleaseOrder | null>(null);
const executePreviewParams = ref<ReleaseOrderParam[]>([]);
const executePreviewPrecheck = ref<ReleaseOrderPrecheck | null>(null);
const batchExecutePreviewVisible = ref(false);
const batchExecutePreviewLoading = ref(false);
const batchExecuteSubmitting = ref(false);
const batchExecuteStagedDispatchMode = ref<BatchExecuteStagedDispatchMode>("execute");
const batchExecutePreviewOrderIDs = ref<string[]>([]);
const advancedSearchExpanded = ref(false);
const statusExpanded = ref(false);
const envExpanded = ref(false);

interface BatchExecutePreviewItem {
  order: ReleaseOrder;
  precheck: ReleaseOrderPrecheck | null;
  params: ReleaseOrderParam[];
}

const batchExecutePreviewItems = ref<BatchExecutePreviewItem[]>([]);

const filters = reactive({
  application_id: "",
  keyword: "",
  triggered_by: "",
  env_code: "",
  operation_type: "" as ReleaseOperationType | "",
  status: "" as ReleaseOrderStatus | "",
  trigger_type: "" as ReleaseTriggerType | "",
  created_at_range: [] as string[],
  page: 1,
  pageSize: 10,
});

const activeQuery = reactive({
  application_id: "",
  keyword: "",
  triggered_by: "",
  env_code: "",
  operation_type: "" as ReleaseOperationType | "",
  status: "" as ReleaseOrderStatus | "",
  trigger_type: "" as ReleaseTriggerType | "",
  created_at_from: "",
  created_at_to: "",
});

const initialColumns: TableColumnsType<ReleaseOrder> = [
  { title: "发布单号", dataIndex: "order_no", key: "order_no", width: 220 },
  { title: "创建时间", dataIndex: "created_at", key: "created_at", width: 190 },
  {
    title: "应用名称",
    dataIndex: "application_name",
    key: "application_name",
    width: 180,
  },
  { title: "环境", dataIndex: "env_code", key: "env_code", width: 110 },
  { title: "状态", dataIndex: "status", key: "status", width: 120 },
  {
    title: "触发方式",
    dataIndex: "trigger_type",
    key: "trigger_type",
    width: 130,
  },
  {
    title: "创建者",
    dataIndex: "triggered_by",
    key: "triggered_by",
    width: 140,
  },
  { title: "开始时间", dataIndex: "started_at", key: "started_at", width: 190 },
  {
    title: "结束时间",
    dataIndex: "finished_at",
    key: "finished_at",
    width: 190,
  },
  { title: "操作", key: "actions", width: 340, fixed: "right" },
];
const { columns } = useResizableColumns(initialColumns, {
  minWidth: 100,
  maxWidth: 560,
  hitArea: 10,
});

const canCreateRelease = computed(() =>
  authStore.hasPermission("release.create"),
);
const canLoadApplications = computed(
  () =>
    authStore.hasPermission("application.view") ||
    authStore.hasPermission("application.manage") ||
    authStore.hasPermission("release.create"),
);
const currentUserID = computed(() => String(authStore.profile?.id || "").trim());
const currentEnvFilter = computed(() => filters.env_code || activeQuery.env_code || "");
const envShortcutOptions = computed(() => releaseEnvOptions.value);

function canCurrentUserExecute(record: ReleaseOrder) {
  if (!currentUserID.value) {
    return false;
  }
  return String(record.creator_user_id || "").trim() === currentUserID.value;
}

const refreshText = computed(() => {
  if (!lastLoadedAt.value) {
    return "尚未加载";
  }
  return lastLoadedAt.value;
});

const spotlightHeadline = computed(() => {
  if (activeQuery.status) {
    return rawStatusText(activeQuery.status);
  }
  return "最新发布";
});

const spotlightHint = computed(() => {
  if (activeQuery.status) {
    return "已按状态聚焦当前列表";
  }
  return "展示当前筛选条件下最近创建的发布单";
});

const spotlightStateKey = computed<
  "running" | "failed" | "success" | "pending"
>(() => {
  if (activeQuery.status) {
    switch (activeQuery.status) {
      case "approving":
      case "building":
      case "queued":
      case "deploying":
      case "running":
        return "running";
      case "rejected":
      case "deploy_failed":
      case "failed":
        return "failed";
      case "deploy_success":
      case "success":
        return "success";
      default:
        return "pending";
    }
  }
  return "pending";
});

const spotlightOrderQueryStatus = computed<ReleaseOrderStatus | "">(() => {
  if (activeQuery.status) {
    return activeQuery.status;
  }
  return "";
});

const spotlightOrders = computed(() =>
  spotlightOrderItems.value
    .sort((left, right) => dayjs(right.created_at).valueOf() - dayjs(left.created_at).valueOf())
    .slice(0, 2)
    .map((item) => ({
      id: item.id,
      orderNo: item.order_no,
    })),
);

const activeFilterTags = computed(() => {
  const tags: Array<{ key: string; label: string; value: string }> = [];
  if (activeQuery.application_id) {
    tags.push({
      key: "application_id",
      label: "应用",
      value: optionLabel(applicationOptions.value, activeQuery.application_id),
    });
  }
  if (activeQuery.keyword) {
    tags.push({
      key: "keyword",
      label: "检索词",
      value: activeQuery.keyword,
    });
  }
  if (activeQuery.triggered_by) {
    tags.push({
      key: "triggered_by",
      label: "发起人",
      value: activeQuery.triggered_by,
    });
  }
  if (activeQuery.env_code) {
    tags.push({ key: "env_code", label: "环境", value: activeQuery.env_code });
  }
  if (activeQuery.operation_type) {
    tags.push({
      key: "operation_type",
      label: "操作类型",
      value: operationTypeText(activeQuery.operation_type),
    });
  }
  if (activeQuery.status) {
    tags.push({
      key: "status",
      label: "状态",
      value: rawStatusText(activeQuery.status),
    });
  }
  if (activeQuery.trigger_type) {
    tags.push({
      key: "trigger_type",
      label: "触发方式",
      value: triggerTypeText(activeQuery.trigger_type),
    });
  }
  if (activeQuery.created_at_from || activeQuery.created_at_to) {
    tags.push({
      key: "created_at_range",
      label: "创建时间",
      value: formatCreatedAtRangeLabel(activeQuery.created_at_from, activeQuery.created_at_to),
    });
  }
  return tags;
});

const hasAdvancedFilter = computed(() =>
  Boolean(
    filters.application_id ||
    filters.keyword.trim() ||
    filters.triggered_by.trim() ||
    filters.operation_type ||
    filters.trigger_type ||
    filters.created_at_range.length,
  ),
);
const hasActiveAdvancedFilter = computed(() =>
  Boolean(
    activeQuery.application_id ||
    activeQuery.keyword ||
    activeQuery.triggered_by ||
    activeQuery.operation_type ||
    activeQuery.trigger_type ||
    activeQuery.created_at_from ||
    activeQuery.created_at_to,
  ),
);
const showAdvancedSearch = computed(() => advancedSearchExpanded.value);
const hasPendingAdvancedFilterChanges = computed(
  () =>
    filters.application_id !== activeQuery.application_id ||
    filters.keyword.trim() !== activeQuery.keyword ||
    filters.triggered_by.trim() !== activeQuery.triggered_by ||
    filters.operation_type !== activeQuery.operation_type ||
    filters.trigger_type !== activeQuery.trigger_type ||
    resolveCreatedAtFrom(filters.created_at_range) !== activeQuery.created_at_from ||
    resolveCreatedAtTo(filters.created_at_range) !== activeQuery.created_at_to,
);

function optionLabel(options: SelectOption[], value: string) {
  return options.find((item) => item.value === value)?.label || value;
}

function applyActiveQueryFromFilters() {
  activeQuery.application_id = filters.application_id;
  activeQuery.keyword = filters.keyword.trim();
  activeQuery.triggered_by = filters.triggered_by.trim();
  activeQuery.env_code = filters.env_code.trim();
  activeQuery.operation_type = filters.operation_type;
  activeQuery.status = filters.status;
  activeQuery.trigger_type = filters.trigger_type;
  activeQuery.created_at_from = resolveCreatedAtFrom(filters.created_at_range);
  activeQuery.created_at_to = resolveCreatedAtTo(filters.created_at_range);
}

function resolveCreatedAtFrom(range: string[]) {
  const start = String(range?.[0] || "").trim();
  if (!start) {
    return "";
  }
  return dayjs(start).startOf("day").toDate().toISOString();
}

function resolveCreatedAtTo(range: string[]) {
  const end = String(range?.[1] || "").trim();
  if (!end) {
    return "";
  }
  return dayjs(end).endOf("day").toDate().toISOString();
}

function formatCreatedAtRangeLabel(from: string, to: string) {
  const startText = from ? dayjs(from).format("YYYY-MM-DD") : "开始";
  const endText = to ? dayjs(to).format("YYYY-MM-DD") : "结束";
  return `${startText} ~ ${endText}`;
}

function formatTime(value: string | null) {
  if (!value) {
    return "-";
  }
  return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
}

function rawStatusText(status: ReleaseOrderStatus) {
  switch (status) {
    case "pending":
      return "待执行";
    case "pending_approval":
      return "待审批";
    case "approving":
      return "审批中";
    case "approved":
      return "已批准";
    case "building":
      return "构建中";
    case "built_waiting_deploy":
      return "已构建待部署";
    case "rejected":
      return "审批拒绝";
    case "queued":
      return "排队中";
    case "deploying":
      return "发布中";
    case "running":
      return "执行中";
    case "deploy_success":
      return "发布成功";
    case "success":
      return "成功";
    case "deploy_failed":
      return "发布失败";
    case "failed":
      return "失败";
    case "cancelled":
      return "已取消";
    default:
      return status;
  }
}

function fallbackBusinessStatus(status: ReleaseOrderStatus): ReleaseOrderBusinessStatus {
  switch (status) {
    case "draft":
      return "draft";
    case "pending_approval":
      return "pending_approval";
    case "approving":
      return "approving";
    case "approved":
      return "approved";
    case "building":
      return "building";
    case "built_waiting_deploy":
      return "built_waiting_deploy";
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
}

function orderBusinessStatus(record: Pick<ReleaseOrder, "business_status" | "status">): ReleaseOrderBusinessStatus {
  return record.business_status || fallbackBusinessStatus(record.status);
}

function businessStatusColor(status: ReleaseOrderBusinessStatus) {
  switch (status) {
    case "deploy_success":
      return "green";
    case "deploy_failed":
    case "rejected":
      return "red";
    case "deploying":
      return "blue";
    case "building":
      return "blue";
    case "built_waiting_deploy":
      return "gold";
    case "queued":
    case "pending_execution":
    case "pending_approval":
    case "approving":
      return "gold";
    case "cancelled":
      return "default";
    default:
      return "cyan";
  }
}

function businessStatusText(status: ReleaseOrderBusinessStatus) {
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
    case "building":
      return "构建中";
    case "built_waiting_deploy":
      return "已构建待部署";
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
    case "cancelled":
      return "已取消";
    default:
      return status;
  }
}

function isRunningBusinessStatus(status: ReleaseOrderBusinessStatus) {
  return status === "deploying" || status === "approving" || status === "building";
}

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
      return "标准重放";
    default:
      return "普通发布";
  }
}

function approvalFlowNodes(record: ReleaseOrder): ApprovalFlowNode[] {
  const status = orderBusinessStatus(record);
  const approverNames = (record.approval_approver_names || []).filter(Boolean).join(" / ") || "待配置审批人";
  const createdCaption = `${record.triggered_by || "系统"} · ${formatTime(record.created_at)}`;

  if (!record.approval_required) {
    return [
      {
        key: "create",
        title: "创建发布单",
        caption: createdCaption,
        tone: "done",
      },
      {
        key: "approval_skipped",
        title: "无需审批",
        caption: "当前模板未启用审批流，可直接进入发布执行",
        tone: "done",
      },
      {
        key: "execute_ready",
        title: "进入执行阶段",
        caption:
          status === "pending_execution"
            ? "当前可直接发起发布"
            : status === "building"
              ? "构建阶段执行中"
              : status === "built_waiting_deploy"
                ? "构建已完成，等待手动触发部署"
            : status === "queued"
              ? record.queued_reason || "已进入等待队列"
              : status === "deploying"
                ? "主发布流程执行中"
                : status === "deploy_success"
                  ? "主发布流程已完成"
                  : status === "deploy_failed"
                    ? "主发布流程执行失败"
                    : status === "cancelled"
                      ? "发布单已取消"
                      : "等待后续处理",
        tone:
          status === "deploy_failed"
            ? "rejected"
            : status === "pending_execution"
              ? "active"
              : ["building", "built_waiting_deploy", "queued", "deploying", "deploy_success", "cancelled"].includes(status)
                ? "done"
                : "pending",
      },
    ];
  }

  const reviewTone: ApprovalFlowNode["tone"] =
    ["pending_approval", "approving"].includes(status)
      ? "active"
      : ["approved", "queued", "deploying", "deploy_success", "deploy_failed", "rejected", "cancelled"].includes(status)
        ? "done"
        : "pending";
  const resultTone: ApprovalFlowNode["tone"] =
    status === "rejected" ? "rejected" : ["approved", "queued", "deploying", "deploy_success", "deploy_failed", "cancelled"].includes(status) ? "done" : "pending";
  const executeTone: ApprovalFlowNode["tone"] =
    status === "approved"
      ? "active"
      : status === "building" || status === "built_waiting_deploy" || status === "queued" || status === "deploying" || status === "deploy_success" || status === "deploy_failed" || status === "cancelled"
        ? "done"
        : "pending";

  return [
    {
      key: "create",
      title: "创建发布单",
      caption: createdCaption,
      tone: "done",
    },
    {
      key: "review",
      title: "审批处理",
      caption:
        status === "pending_approval"
          ? `等待审批人处理 · ${record.approval_mode === "all" ? "会签" : "或签"} · 审批人：${approverNames}`
          : status === "approving"
            ? `审批进行中 · ${record.approval_mode === "all" ? "会签" : "或签"} · 审批人：${approverNames}`
            : `审批人：${approverNames}`,
      tone: reviewTone,
    },
    {
      key: "result",
      title: status === "rejected" ? "审批拒绝" : "审批通过",
      caption:
        status === "rejected"
          ? record.rejected_reason || "审批已拒绝，本次发布不会继续执行"
          : record.approved_by
            ? `审批人：${record.approved_by}`
            : "审批通过后才会进入执行阶段",
      tone: resultTone,
    },
    {
      key: "execute",
      title: "进入执行阶段",
      caption:
        status === "approved"
          ? "审批已通过，等待发起执行"
          : status === "building"
            ? "审批已通过，当前处于构建阶段"
            : status === "built_waiting_deploy"
              ? "构建已完成，等待手动触发部署"
          : status === "queued"
            ? record.queued_reason || "已进入等待队列"
            : status === "deploying"
              ? "主发布流程执行中"
              : status === "deploy_success"
                ? "主发布流程已完成"
                : status === "deploy_failed"
                  ? "主发布流程执行失败"
                  : status === "cancelled"
                    ? "发布单已取消"
                    : "审批完成后可发起发布",
      tone: executeTone,
    },
  ];
}

function approvalFlowToneClass(tone: ApprovalFlowNode["tone"]) {
  switch (tone) {
    case "done":
      return "approval-flow-node-done";
    case "active":
      return "approval-flow-node-active";
    case "rejected":
      return "approval-flow-node-rejected";
    default:
      return "approval-flow-node-pending";
  }
}

function approvalFlowIcon(tone: ApprovalFlowNode["tone"]) {
  switch (tone) {
    case "done":
      return CheckCircleFilled;
    case "active":
      return LoadingOutlined;
    case "rejected":
      return CloseCircleFilled;
    default:
      return ClockCircleFilled;
  }
}

function approvalFlowSummary(record: ReleaseOrder) {
  if (!record.approval_required) {
    return "当前发布单未启用审批流，可直接进入发布执行";
  }
  const status = orderBusinessStatus(record);
  switch (status) {
    case "pending_approval":
      return "当前发布单等待进入审批处理";
    case "approving":
      return "审批链路进行中，等待审批人处理";
    case "approved":
      return "审批已通过，等待发起执行";
    case "rejected":
      return record.rejected_reason || "审批已拒绝，本次发布不会继续执行";
    case "queued":
      return record.queued_reason || "审批已通过，当前在执行队列中等待";
    case "deploying":
      return "审批已完成，主发布流程执行中";
    case "deploy_success":
      return "审批与主发布流程均已完成";
    case "deploy_failed":
      return "审批已完成，但主发布流程执行失败";
    case "cancelled":
      return "发布单已取消，审批链路不再推进";
    default:
      return "创建后可按流程进入审批与执行阶段";
  }
}

function canCancel(record: ReleaseOrder) {
  const businessStatus = orderBusinessStatus(record);
  return (
    (authStore.isAdmin || canCurrentUserExecute(record)) &&
    (businessStatus === "pending_execution" ||
      businessStatus === "building" ||
      businessStatus === "built_waiting_deploy" ||
      businessStatus === "approved" ||
      businessStatus === "queued" ||
      businessStatus === "deploying")
  );
}

function canEdit(record: ReleaseOrder) {
  return (
    (authStore.isAdmin || canCurrentUserExecute(record)) &&
    String(record.status || "").trim() === "pending" &&
    String(record.operation_type || "").trim() === "deploy" &&
    !String(record.source_order_id || "").trim()
  );
}

function canConfirmLive(record: ReleaseOrder) {
  return (
    authStore.hasApplicationPermission(
      "release.execute",
      record.application_id,
      record.env_code,
    ) &&
    record.live_state_can_confirm === true &&
    orderBusinessStatus(record) === "deploy_success" &&
    String(record.live_state_status || "").trim() === "pending_confirm"
  );
}

function canExecute(record: ReleaseOrder) {
  return (
    authStore.hasApplicationPermission(
      "release.execute",
      record.application_id,
      record.env_code,
    ) &&
    ["pending_execution", "approved"].includes(orderBusinessStatus(record))
  );
}

function supportsStagedDispatch(record: ReleaseOrder) {
  return (
    String(record.operation_type || "").trim() === "deploy" &&
    Boolean(record.has_ci_execution) &&
    Boolean(record.has_cd_execution)
  );
}

function canBuild(record: ReleaseOrder) {
  return (
    supportsStagedDispatch(record) &&
    authStore.hasApplicationPermission(
      "release.execute",
      record.application_id,
      record.env_code,
    ) &&
    ["pending_execution", "approved"].includes(orderBusinessStatus(record))
  );
}

function canDeploy(record: ReleaseOrder) {
  return (
    supportsStagedDispatch(record) &&
    authStore.hasApplicationPermission(
      "release.execute",
      record.application_id,
      record.env_code,
    ) &&
    orderBusinessStatus(record) === "built_waiting_deploy"
  );
}

function resolveDispatchAction(record: ReleaseOrder): ReleaseOrderDispatchAction {
  if (canDeploy(record)) {
    return "deploy";
  }
  if (canBuild(record)) {
    return "build";
  }
  return "execute";
}

function dispatchActionText(action: ReleaseOrderDispatchAction) {
  switch (action) {
    case "build":
      return "仅构建";
    case "deploy":
      return "发布";
    default:
      return "发布";
  }
}

function canRollback(record: ReleaseOrder) {
  return canTriggerArgoReplay(record) && hasReplayPermission(record);
}

function canReplay(record: ReleaseOrder) {
  return canTriggerStandardReplay(record) && hasReplayPermission(record);
}

function hasReplayPermission(record: ReleaseOrder) {
  return (
    authStore.hasApplicationPermission(
      "release.create",
      record.application_id,
      record.env_code,
    )
  );
}

function canTriggerArgoReplay(record: ReleaseOrder) {
  return (
    ["deploying", "deploy_failed", "deploy_success"].includes(
      orderBusinessStatus(record),
    ) &&
    String(record.cd_provider || "")
      .trim()
      .toLowerCase() === "argocd"
  );
}

function canTriggerStandardReplay(record: ReleaseOrder) {
  return (
    ["deploy_success", "deploy_failed"].includes(orderBusinessStatus(record)) &&
    String(record.cd_provider || "")
      .trim()
      .toLowerCase() !== "argocd"
  );
}

function isCiOnlyRecovery(record: ReleaseOrder) {
  return String(record.cd_provider || "").trim() === "";
}

function replayActionText(record: ReleaseOrder) {
  return "一键重发";
}

function replayConfirmTitle(record: ReleaseOrder) {
  return isCiOnlyRecovery(record)
    ? "确认创建 CI 标准重放单吗？"
    : "确认创建标准重放单吗？";
}

function replaySuccessText(record: ReleaseOrder, orderNo: string) {
  return isCiOnlyRecovery(record)
    ? `已创建 CI 标准重放单：${orderNo}`
    : `已创建标准重放单：${orderNo}`;
}

function replayFailureText(record: ReleaseOrder) {
  return isCiOnlyRecovery(record) ? "CI 标准重放创建失败" : "标准重放创建失败";
}

const selectedExecutableOrders = computed(() =>
  dataSource.value.filter(
    (item) => selectedOrderIDs.value.includes(item.id) && canExecute(item),
  ),
);

const canBatchExecute = computed(
  () =>
    canShowBatchExecuteBar.value &&
    selectedExecutableOrders.value.length >= 2 &&
    !batchExecuting.value,
);

const batchPreviewBlockedCount = computed(
  () =>
    batchExecutePreviewItems.value.filter((item) => !item.precheck?.executable)
      .length,
);

const batchPreviewWaitingCount = computed(
  () =>
    batchExecutePreviewItems.value.filter((item) => item.precheck?.waiting_for_lock)
      .length,
);

const batchPreviewPassCount = computed(
  () =>
    batchExecutePreviewItems.value.filter((item) => item.precheck?.executable)
      .length,
);

const batchPreviewStagedCount = computed(
  () =>
    batchExecutePreviewItems.value.filter((item) =>
      supportsStagedDispatch(item.order),
    ).length,
);

const batchPreviewHasStagedOrders = computed(
  () => batchPreviewStagedCount.value > 0,
);

const batchPreviewCIOnlyCount = computed(
  () => batchExecutePreviewItems.value.length - batchPreviewStagedCount.value,
);

const batchDispatchModeLabel = computed(() =>
  batchExecuteStagedDispatchMode.value === "build"
    ? "仅构建可分段单"
    : "直接进入部署流程",
);

const canShowBatchExecuteBar = computed(
  () =>
    dataSource.value.some((item) => String(item.creator_user_id || "").trim() === currentUserID.value),
);

const canShowBatchDeleteAction = computed(() => authStore.isAdmin);

const canBatchDelete = computed(
  () =>
    canShowBatchDeleteAction.value &&
    selectedOrderIDs.value.length > 0 &&
    !batchDeleting.value,
);

const tableRowSelection = computed(() => rowSelection.value);

const rowSelection = computed(() => ({
  type: "checkbox" as const,
  fixed: true as const,
  columnWidth: 52,
  selectedRowKeys: selectedOrderIDs.value,
  preserveSelectedRowKeys: false,
  getCheckboxProps: (record: ReleaseOrder) => ({
    disabled: !authStore.isAdmin && !canExecute(record),
  }),
  onChange: (keys: Array<string | number>) => {
    selectedOrderIDs.value = keys.map((item) => String(item));
  },
}));

async function loadApplicationOptions() {
  if (!canLoadApplications.value) {
    applicationOptions.value = [];
    return;
  }
  applicationsLoading.value = true;
  try {
    const response = await listApplications({ page: 1, page_size: 100 });
    applicationOptions.value = response.data.map((item) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }));
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "发布应用下拉加载失败"));
  } finally {
    applicationsLoading.value = false;
  }
}

async function loadReleaseEnvOptions() {
  envOptionsLoading.value = true;
  try {
    const response = await getReleaseSettings();
    releaseEnvOptions.value = (response.data.env_options || []).map((item) => ({
      label: item,
      value: item,
    }));
    const currentEnvCodes = new Set(releaseEnvOptions.value.map((item) => item.value));
    if (filters.env_code && !currentEnvCodes.has(filters.env_code)) {
      filters.env_code = "";
    }
    if (activeQuery.env_code && !currentEnvCodes.has(activeQuery.env_code)) {
      activeQuery.env_code = "";
    }
  } catch (error) {
    releaseEnvOptions.value = [];
    message.error(extractHTTPErrorMessage(error, "发布环境加载失败"));
  } finally {
    envOptionsLoading.value = false;
  }
}

function handleEnvQuickFilter(envCode: string) {
  filters.env_code = String(envCode || "").trim();
  handleSearch();
}

async function loadOverviewStats(options?: { force?: boolean; silent?: boolean }) {
  const nextKey = "global-release-overview";
  if (!options?.force && overviewQueryKey.value === nextKey) {
    return;
  }
  try {
    const stats = await getReleaseOrderStats({
      page: 1,
      page_size: 1,
    });
    overviewStatusStats.value = stats;
    overviewQueryKey.value = nextKey;
    renderOverviewChart();
    await loadSpotlightOrders({ silent: options?.silent });
  } catch (error) {
    if (!options?.silent) {
      message.error(extractHTTPErrorMessage(error, "发布统计加载失败"));
    }
  }
}

async function loadSpotlightOrders(options?: { silent?: boolean }) {
  try {
    const response = await listReleaseOrders({
      application_id: activeQuery.application_id || undefined,
      keyword: activeQuery.keyword || undefined,
      triggered_by: activeQuery.triggered_by || undefined,
      env_code: activeQuery.env_code || undefined,
      operation_type: activeQuery.operation_type || undefined,
      status: spotlightOrderQueryStatus.value || undefined,
      trigger_type: activeQuery.trigger_type || undefined,
      created_at_from: activeQuery.created_at_from || undefined,
      created_at_to: activeQuery.created_at_to || undefined,
      page: 1,
      page_size: 2,
    });
    spotlightOrderItems.value = response.data;
  } catch (error) {
    spotlightOrderItems.value = [];
    if (!options?.silent) {
      message.error(extractHTTPErrorMessage(error, "关注发布单加载失败"));
    }
  }
}

function renderOverviewChart() {
  if (!overviewChartRef.value) {
    return;
  }
  if (!overviewChart) {
    overviewChart = echarts.init(overviewChartRef.value);
  }
  const stats = overviewStatusStats.value;
  const labels = ["待处理", "执行中", "失败", "成功"];
  const values = [stats.pending, stats.running, stats.failed, stats.success];
  const colors = ["rgba(148, 163, 184, 0.68)", "#60a5fa", "#f87171", "#34d399"];
  const borderColors = [
    "rgba(148, 163, 184, 0.34)",
    "rgba(96, 165, 250, 0.5)",
    "rgba(248, 113, 113, 0.5)",
    "rgba(52, 211, 153, 0.5)",
  ];

  overviewChart.setOption(
    {
      animationDuration: 420,
      animationEasing: "cubicOut",
      grid: {
        top: 16,
        right: 8,
        bottom: 0,
        left: 8,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(2, 6, 23, 0.92)",
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        padding: [10, 12],
        textStyle: {
          color: "#e2e8f0",
          fontSize: 12,
        },
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(148, 163, 184, 0.06)",
          },
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: {
          color: "rgba(226, 232, 240, 0.56)",
          fontSize: 12,
          fontWeight: 600,
        },
        axisLine: {
          lineStyle: {
            color: "rgba(71, 85, 105, 0.32)",
          },
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        splitNumber: Math.min(3, Math.max(1, ...values)),
        axisLabel: {
          color: "rgba(226, 232, 240, 0.52)",
          fontSize: 11,
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            color: "rgba(71, 85, 105, 0.22)",
          },
        },
      },
      series: [
        {
          type: "bar",
          barWidth: "34%",
          data: values.map((val, idx) => ({
            value: val,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[idx] },
                { offset: 1, color: "rgba(15, 23, 42, 0.02)" },
              ]),
              borderColor: borderColors[idx],
              borderWidth: 1,
              borderRadius: [6, 6, 0, 0],
            },
          })),
        },
      ],
    },
    true,
  );
  overviewChart.resize();
}

function disposeOverviewChart() {
  overviewChart?.dispose();
  overviewChart = null;
}

async function loadReleaseOrders(options?: { silent?: boolean; force?: boolean }) {
  if (querying.value) {
    if (options?.force) {
      pendingReloadOptions.value = { silent: options?.silent };
    }
    return;
  }
  const silent = Boolean(options?.silent);
  querying.value = true;
  if (!silent) {
    loading.value = true;
  }
  try {
    const response = await listReleaseOrders({
      application_id: activeQuery.application_id || undefined,
      keyword: activeQuery.keyword || undefined,
      triggered_by: activeQuery.triggered_by || undefined,
      env_code: activeQuery.env_code || undefined,
      operation_type: activeQuery.operation_type || undefined,
      status: activeQuery.status || undefined,
      trigger_type: activeQuery.trigger_type || undefined,
      created_at_from: activeQuery.created_at_from || undefined,
      created_at_to: activeQuery.created_at_to || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    });
    dataSource.value = response.data;
    total.value = response.total;
    filters.page = response.page;
    filters.pageSize = response.page_size;
    const visibleIDs = new Set(response.data.map((item) => item.id));
    selectedOrderIDs.value = selectedOrderIDs.value.filter((item) =>
      visibleIDs.has(item),
    );
    lastLoadedAt.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
  } catch (error) {
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, "发布单列表加载失败"));
    }
  } finally {
    querying.value = false;
    if (pendingReloadOptions.value) {
      const next = pendingReloadOptions.value;
      pendingReloadOptions.value = null;
      void loadReleaseOrders(next);
    }
    if (!silent) {
      loading.value = false;
    }
  }
}

function handleQuickStatusChange(status: ReleaseOrderStatus | "") {
  filters.status = status;
  handleSearch();
}

function clearFilterTag(key: string) {
  if (key === "application_id") {
    filters.application_id = "";
  } else if (key === "keyword") {
    filters.keyword = "";
  } else if (key === "triggered_by") {
    filters.triggered_by = "";
  } else if (key === "env_code") {
    filters.env_code = "";
  } else if (key === "operation_type") {
    filters.operation_type = "";
  } else if (key === "status") {
    filters.status = "";
  } else if (key === "trigger_type") {
    filters.trigger_type = "";
  } else if (key === "created_at_range") {
    filters.created_at_range = [];
  }
  handleSearch();
}

function applyRouteQuery() {
  const applicationID = String(route.query.application_id || "").trim();
  if (applicationID) {
    filters.application_id = applicationID;
  }
  const status = String(route.query.status || "").trim() as ReleaseOrderStatus | "";
  if (status) {
    filters.status = status;
  }
  const createdAtFrom = String(route.query.created_at_from || "").trim();
  const createdAtTo = String(route.query.created_at_to || "").trim();
  if (createdAtFrom || createdAtTo) {
    const fromText = createdAtFrom
      ? dayjs(createdAtFrom).format("YYYY-MM-DD")
      : dayjs(createdAtTo).format("YYYY-MM-DD");
    const toText = createdAtTo
      ? dayjs(createdAtTo).format("YYYY-MM-DD")
      : dayjs(createdAtFrom).format("YYYY-MM-DD");
    filters.created_at_range = [
      fromText,
      toText,
    ];
  }
}

function toCreate() {
  const query: Record<string, string> = {};
  if (filters.application_id) {
    query.application_id = filters.application_id;
  }
  void router.push({ path: "/releases/new", query });
}

function toDetail(id: string) {
  void router.push(`/releases/${id}`);
}

function handleEdit(record: ReleaseOrder) {
  if (!canEdit(record)) {
    message.warning("当前发布单不是可编辑的待执行普通发布单");
    return;
  }
  void router.push(`/releases/${record.id}/edit`);
}

function handleSearch() {
  filters.page = 1;
  applyActiveQueryFromFilters();
  void loadSpotlightOrders();
  void loadReleaseOrders();
}

function handleReset() {
  filters.application_id = "";
  filters.keyword = "";
  filters.triggered_by = "";
  filters.env_code = "";
  filters.operation_type = "";
  filters.status = "";
  filters.trigger_type = "";
  filters.created_at_range = [];
  filters.page = 1;
  filters.pageSize = 10;
  advancedSearchExpanded.value = false;
  applyActiveQueryFromFilters();
  void loadSpotlightOrders();
  void loadReleaseOrders();
}

function toggleAdvancedSearch() {
  advancedSearchExpanded.value = !advancedSearchExpanded.value;
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page;
  filters.pageSize = pageSize;
  void loadReleaseOrders();
}

function handlePageSizeChange(page: number, pageSize: number) {
  filters.page = page;
  filters.pageSize = pageSize;
  void loadReleaseOrders();
}

function handleApplicationChange(value: string | undefined) {
  filters.application_id = String(value || "");
}

async function handleCancel(record: ReleaseOrder) {
  cancellingID.value = record.id;
  try {
    await cancelReleaseOrder(record.id);
    message.success("发布单取消成功");
    await loadReleaseOrders();
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "发布单取消失败"));
  } finally {
    cancellingID.value = "";
  }
}

async function handleConfirmLive(record: ReleaseOrder) {
  confirmingLiveID.value = record.id;
  try {
    await confirmReleaseOrderLive(record.id);
    message.success("当前版本已确认生效");
    await loadOverviewStats({ force: true, silent: true });
    await loadReleaseOrders({ force: true });
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "确认生效失败"));
  } finally {
    confirmingLiveID.value = "";
  }
}

async function handleDelete(record: ReleaseOrder) {
  if (!authStore.isAdmin) {
    message.warning("仅管理员可删除发布记录");
    return;
  }
  deletingID.value = record.id;
  try {
    await deleteReleaseOrder(record.id);
    selectedOrderIDs.value = selectedOrderIDs.value.filter(
      (item) => item !== record.id,
    );
    message.success("发布记录已删除");
    await loadOverviewStats({ force: true, silent: true });
    await loadReleaseOrders();
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "发布记录删除失败"));
  } finally {
    deletingID.value = "";
  }
}

async function handleBatchDelete() {
  if (!canBatchDelete.value) {
    message.warning("请先勾选要删除的发布记录");
    return;
  }
  batchDeleting.value = true;
  try {
    const targetIDs = [...selectedOrderIDs.value];
    const response = await batchDeleteReleaseOrders({ order_ids: targetIDs });
    const deletedIDs = response.data.deleted_order_ids || [];
    const failed = response.data.failed || [];
    const failedIDs = new Set(failed.map((item) => item.order_id));
    selectedOrderIDs.value = selectedOrderIDs.value.filter((item) =>
      failedIDs.has(item),
    );
    if (deletedIDs.length > 0 && failed.length === 0) {
      message.success(`已删除 ${deletedIDs.length} 条发布记录`);
    } else if (deletedIDs.length > 0 && failed.length > 0) {
      const firstReason = failed[0]?.reason ? `，失败原因：${failed[0].reason}` : "";
      message.warning(
        `已删除 ${deletedIDs.length} 条，${failed.length} 条删除失败${firstReason}`,
      );
    } else {
      const firstReason = failed[0]?.reason ? `：${failed[0].reason}` : "";
      message.warning(`未删除任何发布记录${firstReason}`);
    }
    await loadOverviewStats({ force: true, silent: true });
    await loadReleaseOrders();
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "批量删除发布记录失败"));
  } finally {
    batchDeleting.value = false;
  }
}

function closeExecutePreviewModal() {
  executePreviewVisible.value = false;
  executePreviewAction.value = "execute";
  executePreviewOrder.value = null;
  executePreviewParams.value = [];
  executePreviewPrecheck.value = null;
}

async function openExecutePreviewModal(
  record: ReleaseOrder,
  action: ReleaseOrderDispatchAction = "execute",
) {
  const canDispatch =
    action === "build"
      ? canBuild(record)
      : action === "deploy"
        ? canDeploy(record)
        : canExecute(record);
  if (!canDispatch) {
    message.warning(
      action === "build"
        ? "当前发布单不满足仅构建条件，无法触发仅构建"
        : action === "deploy"
          ? "当前发布单尚未完成构建，无法继续发布"
          : "当前发布单已执行完成、已取消或不处于待执行状态，无法再次触发发布",
    );
    return;
  }
  executePreviewVisible.value = true;
  executePreviewLoading.value = true;
  executePreviewAction.value = action;
  executePreviewOrder.value = null;
  executePreviewParams.value = [];
  executePreviewPrecheck.value = null;
  executingID.value = record.id;
  try {
    const [orderResp, paramsResp, precheckResp] = await Promise.all([
      getReleaseOrderByID(record.id),
      listReleaseOrderParams(record.id).catch(() => null),
      getReleaseOrderPrecheck(record.id, action),
    ]);
    const nextCanDispatch =
      action === "build"
        ? canBuild(orderResp.data)
        : action === "deploy"
          ? canDeploy(orderResp.data)
          : canExecute(orderResp.data);
    if (!nextCanDispatch) {
      message.warning(
        action === "build"
          ? "当前发布单状态已变化，无法继续触发仅构建"
          : action === "deploy"
            ? "当前发布单状态已变化，无法继续触发发布"
            : "当前发布单已执行完成、已取消或状态已变化，无法再次触发发布",
      );
      closeExecutePreviewModal();
      return;
    }
    executePreviewOrder.value = orderResp.data;
    executePreviewParams.value = paramsResp?.data || [];
    executePreviewPrecheck.value = precheckResp.data;
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "发布预审信息加载失败"));
    closeExecutePreviewModal();
  } finally {
    executePreviewLoading.value = false;
    executingID.value = "";
  }
}

async function confirmExecuteRelease() {
  if (!executePreviewOrder.value) {
    return;
  }
  const action = executePreviewAction.value;
  const canDispatch =
    action === "build"
      ? canBuild(executePreviewOrder.value)
      : action === "deploy"
        ? canDeploy(executePreviewOrder.value)
        : canExecute(executePreviewOrder.value);
  if (!canDispatch) {
    message.warning(
      action === "build"
        ? "当前发布单状态已变化，无法继续触发仅构建"
        : action === "deploy"
          ? "当前发布单状态已变化，无法继续触发发布"
          : "当前发布单已执行完成、已取消或状态已变化，无法再次触发发布",
    );
    closeExecutePreviewModal();
    return;
  }
  executeSubmitting.value = true;
  try {
    if (action === "build") {
      await buildReleaseOrder(executePreviewOrder.value.id);
      message.success("仅构建已提交，正在调度执行");
    } else if (action === "deploy") {
      await deployReleaseOrder(executePreviewOrder.value.id);
      message.success("发布已提交，正在调度执行");
    } else {
      await executeReleaseOrder(executePreviewOrder.value.id);
      message.success("发布已提交，正在调度执行");
    }
    closeExecutePreviewModal();
    await loadOverviewStats({ force: true, silent: true });
    await loadReleaseOrders();
  } catch (error) {
    message.error(
      extractHTTPErrorMessage(
        error,
        action === "build"
          ? "仅构建执行失败"
          : action === "deploy"
            ? "发布执行失败"
            : "发布执行失败",
      ),
    );
  } finally {
    executeSubmitting.value = false;
  }
}

async function handleRollback(record: ReleaseOrder) {
  if (!canRollback(record)) {
    return;
  }
  recoveringID.value = record.id;
  try {
    const response = await rollbackReleaseOrderByID(record.id);
    message.success(`已创建一键重发单：${response.data.order_no}`);
    await loadOverviewStats({ force: true, silent: true });
    void router.push(`/releases/${response.data.id}`);
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "一键重发创建失败"));
  } finally {
    recoveringID.value = "";
  }
}

async function handleReplay(record: ReleaseOrder) {
  if (!canReplay(record)) {
    return;
  }
  recoveringID.value = record.id;
  try {
    const response = await replayReleaseOrderByID(record.id);
    message.success(replaySuccessText(record, response.data.order_no));
    await loadOverviewStats({ force: true, silent: true });
    void router.push(`/releases/${response.data.id}`);
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, replayFailureText(record)));
  } finally {
    recoveringID.value = "";
  }
}

async function handleBatchExecute(
  mode: BatchExecuteStagedDispatchMode = "execute",
  orderIDs: string[] = [],
) {
  const targetOrderIDs = (
    orderIDs.length > 0
      ? orderIDs
      : selectedExecutableOrders.value.map((item) => item.id)
  )
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  if (targetOrderIDs.length < 2) {
    message.warning("请至少选择两张待执行发布单");
    return;
  }
  batchExecuting.value = true;
  try {
    const payload: BatchExecuteReleaseOrdersPayload = {
      order_ids: targetOrderIDs,
      staged_dispatch_mode: mode,
    };
    const response = await batchExecuteReleaseOrders(payload);
    selectedOrderIDs.value = [];
    const successCount =
      response.data.orders.length - response.data.dispatch_errors.length;
    if (response.data.dispatch_errors.length === 0) {
      message.success(`已发起并发执行，批次号：${response.data.batch_no}`);
    } else {
      message.warning(
        `并发执行批次 ${response.data.batch_no} 已创建，成功调度 ${successCount} 张，${response.data.dispatch_errors.length} 张需关注`,
      );
    }
    await loadOverviewStats({ force: true, silent: true });
    await loadReleaseOrders();
  } catch (error) {
    const acceptedBatch = await detectAcceptedBatchExecute(targetOrderIDs);
    await loadReleaseOrders({ silent: true });
    const acceptedCount = acceptedBatch.acceptedCount;
    if (acceptedCount > 0) {
      selectedOrderIDs.value = [];
      const batchText = acceptedBatch.batchNo
        ? `批次号：${acceptedBatch.batchNo}`
        : `已受理 ${acceptedCount} 张`;
      message.warning(`并发执行请求已受理，${batchText}，可忽略本次异常提示`);
      return;
    }
    message.error(extractHTTPErrorMessage(error, "并发执行发起失败"));
  } finally {
    batchExecuting.value = false;
  }
}

function resolveBatchDispatchAction(
  record: ReleaseOrder,
  mode: BatchExecuteStagedDispatchMode,
): ReleaseOrderDispatchAction {
  if (mode === "build" && canBuild(record)) {
    return "build";
  }
  return "execute";
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function detectAcceptedBatchExecute(orderIDs: string[]): Promise<{
  acceptedCount: number;
  batchNo: string;
}> {
  const targetOrderIDs = orderIDs
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  if (targetOrderIDs.length === 0) {
    return { acceptedCount: 0, batchNo: "" };
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const responses = await Promise.allSettled(
      targetOrderIDs.map((id) => getReleaseOrderByID(id)),
    );
    const acceptedOrders = responses
      .filter((item): item is PromiseFulfilledResult<{ data: ReleaseOrder }> => {
        return item.status === "fulfilled";
      })
      .map((item) => item.value.data)
      .filter((item) => {
        return (
          item.is_concurrent ||
          Boolean(String(item.concurrent_batch_no || "").trim()) ||
          !["pending", "approved"].includes(String(item.status || "").trim())
        );
      });

    if (acceptedOrders.length > 0) {
      const batchNo = String(
        acceptedOrders.find((item) => String(item.concurrent_batch_no || "").trim())
          ?.concurrent_batch_no || "",
      ).trim();
      return { acceptedCount: acceptedOrders.length, batchNo };
    }

    if (attempt < 3) {
      await sleep(800);
    }
  }

  return { acceptedCount: 0, batchNo: "" };
}

function closeBatchExecutePreviewModal() {
  batchExecutePreviewVisible.value = false;
  batchExecutePreviewItems.value = [];
  batchExecutePreviewOrderIDs.value = [];
  batchExecuteStagedDispatchMode.value = "execute";
}

async function loadBatchExecutePreviewItems() {
  const targetOrderIDs = [...batchExecutePreviewOrderIDs.value];
  if (targetOrderIDs.length < 2) {
    closeBatchExecutePreviewModal();
    return;
  }
  batchExecutePreviewLoading.value = true;
  batchExecutePreviewItems.value = [];
  try {
    const results = await Promise.all(
      targetOrderIDs.map(async (orderID) => {
        const orderResp = await getReleaseOrderByID(orderID);
        const action = resolveBatchDispatchAction(
          orderResp.data,
          batchExecuteStagedDispatchMode.value,
        );
        const [precheckResp, paramsResp] = await Promise.all([
          getReleaseOrderPrecheck(orderID, action).catch(() => null),
          listReleaseOrderParams(orderID).catch(() => null),
        ]);
        return {
          order: orderResp.data,
          precheck: precheckResp?.data || null,
          params: paramsResp?.data || [],
        } satisfies BatchExecutePreviewItem;
      }),
    );
    const executableResults = results.filter((item) => canExecute(item.order));
    batchExecutePreviewItems.value = executableResults;
    if (executableResults.length < 2) {
      message.warning("当前可并发执行的发布单不足两张，请重新勾选");
      closeBatchExecutePreviewModal();
      await loadReleaseOrders({ silent: true });
      return;
    }
    if (!batchPreviewHasStagedOrders.value && batchExecuteStagedDispatchMode.value !== "execute") {
      batchExecuteStagedDispatchMode.value = "execute";
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, "并发执行预审加载失败"));
    closeBatchExecutePreviewModal();
  } finally {
    batchExecutePreviewLoading.value = false;
  }
}

function handleBatchDispatchModeChange(value: BatchExecuteStagedDispatchMode) {
  batchExecuteStagedDispatchMode.value = value;
  void loadBatchExecutePreviewItems();
}

async function openBatchExecutePreviewModal() {
  if (!canBatchExecute.value) {
    message.warning("请至少选择两张待执行发布单");
    return;
  }
  batchExecutePreviewOrderIDs.value = [...selectedExecutableOrders.value].map(
    (item) => item.id,
  );
  batchExecuteStagedDispatchMode.value = "execute";
  batchExecutePreviewVisible.value = true;
  await loadBatchExecutePreviewItems();
}

async function confirmBatchExecute() {
  const previewOrderIDs = batchExecutePreviewItems.value
    .map((item) => String(item.order.id || "").trim())
    .filter(Boolean);
  if (previewOrderIDs.length < 2) {
    message.warning("请至少选择两张待执行发布单");
    return;
  }
  batchExecuteSubmitting.value = true;
  try {
    await handleBatchExecute(
      batchExecuteStagedDispatchMode.value,
      previewOrderIDs,
    );
    closeBatchExecutePreviewModal();
  } finally {
    batchExecuteSubmitting.value = false;
  }
}

function batchPrecheckStatusText(status: ReleaseOrderPrecheck["items"][number]["status"]) {
  switch (status) {
    case "pass":
      return "通过";
    case "warn":
      return "排队";
    case "blocked":
      return "阻塞";
    default:
      return status;
  }
}

function batchPrecheckToneClass(status: ReleaseOrderPrecheck["items"][number]["status"]) {
  switch (status) {
    case "pass":
      return "status-pill-success";
    case "warn":
      return "status-pill-warning";
    case "blocked":
      return "status-pill-failed";
    default:
      return "status-pill-pending";
  }
}

const executePreviewSummaryMessage = computed(() => {
  if (!executePreviewPrecheck.value) {
    return "";
  }
  const actionText = dispatchActionText(executePreviewAction.value);
  if (!executePreviewPrecheck.value.executable && executePreviewPrecheck.value.ahead_count > 0) {
    return (
      executePreviewPrecheck.value.conflict_message ||
      `当前应用前面还有 ${executePreviewPrecheck.value.ahead_count} 单，请等待先前执行单结束后再点击${actionText}`
    );
  }
  if (executePreviewPrecheck.value.waiting_for_lock) {
    return (
      executePreviewPrecheck.value.conflict_message ||
      `当前目标已被其他发布占用，确认${actionText}后会进入等待队列`
    );
  }
  if (!executePreviewPrecheck.value.executable) {
    return (
      executePreviewPrecheck.value.conflict_message ||
      `当前发布单未通过${actionText}前预审，请先处理阻塞项`
    );
  }
  if (executePreviewPrecheck.value.lock_enabled) {
    return `并发发布保护已启用，当前按 ${executePreviewPrecheck.value.lock_scope || "application_env"} 范围进行调度控制`;
  }
  return `预审已完成，确认后将进入${actionText}调度`;
});

const executePreviewSummaryTone = computed<"info" | "warning" | "error">(() => {
  if (executePreviewPrecheck.value?.waiting_for_lock) {
    return "warning";
  }
  if (executePreviewPrecheck.value && !executePreviewPrecheck.value.executable) {
    return "error";
  }
  return "info";
});

const executePreviewTitle = computed(() => `${dispatchActionText(executePreviewAction.value)}预审`);

const executePreviewOkText = computed(() => `确认${dispatchActionText(executePreviewAction.value)}`);

onMounted(async () => {
  applyRouteQuery();
  advancedSearchExpanded.value = hasAdvancedFilter.value || hasActiveAdvancedFilter.value;
  await loadReleaseEnvOptions();
  await loadApplicationOptions();
  applyActiveQueryFromFilters();
  await loadOverviewStats({ force: true, silent: true });
  await loadReleaseOrders();

  window.addEventListener("resize", handleOverviewChartResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleOverviewChartResize);
  disposeOverviewChart();
});

function handleOverviewChartResize() {
  overviewChart?.resize();
}
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-copy">
        <h2 class="page-title">发布</h2>
        <div v-if="selectedOrderIDs.length > 0" class="page-header-selection">
          已勾选 <strong>{{ selectedOrderIDs.length }}</strong> 条
          <template v-if="selectedExecutableOrders.length > 0">
            ，{{ selectedExecutableOrders.length }} 条可执行
          </template>
        </div>
      </div>
      <a-space :size="10">
        <template v-if="selectedOrderIDs.length > 0">
          <a-button
            class="release-toolbar-action-btn release-toolbar-action-btn--ghost"
            @click="selectedOrderIDs = []"
          >
            清空勾选
          </a-button>
          <a-popconfirm
            v-if="canShowBatchDeleteAction"
            title="确认批量删除当前勾选的发布记录吗？删除后不可恢复"
            ok-text="确认删除"
            cancel-text="取消"
            @confirm="handleBatchDelete"
          >
            <template #icon>
              <ExclamationCircleOutlined class="danger-icon" />
            </template>
            <a-button
              class="release-toolbar-action-btn release-toolbar-action-btn--danger"
              :disabled="!canBatchDelete"
              :loading="batchDeleting"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
              批量删除
            </a-button>
          </a-popconfirm>
        </template>
        <a-button
          v-if="canShowBatchExecuteBar"
          class="release-toolbar-action-btn"
          :disabled="!canBatchExecute"
          :loading="batchExecuting"
          @click="openBatchExecutePreviewModal"
        >
          <template #icon>
            <SyncOutlined />
          </template>
          并发执行
        </a-button>
        <a-button
          class="release-toolbar-action-btn"
          :class="{ 'release-toolbar-action-btn--primary': advancedSearchExpanded }"
          @click="toggleAdvancedSearch"
        >
          <template #icon>
            <SearchOutlined />
          </template>
          {{ advancedSearchExpanded ? "收起检索" : "高级检索" }}
        </a-button>
        <a-button v-if="canCreateRelease" class="release-toolbar-action-btn release-toolbar-action-btn--primary" @click="toCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          新建发布单
        </a-button>
      </a-space>
    </div>

    <a-card class="release-overview-card" :bordered="true">
      <div class="overview-bar">
        <div class="overview-chart-panel">
          <div class="overview-chart-header">
            <div>
              <div class="overview-chart-label">发布统计</div>
              <div class="overview-chart-title">全部发布单状态分布</div>
            </div>
            <div class="overview-chart-meta">
              共 {{ overviewStatusStats.total }} 条
            </div>
          </div>
          <div ref="overviewChartRef" class="overview-chart-canvas"></div>
          <div class="overview-chart-footnote">统计口径：汇总全部发布单状态数量</div>
        </div>
        <div class="overview-spotlight">
          <div class="overview-spotlight-icon-wrap">
            <div
              class="overview-spotlight-icon-orb"
              :class="`overview-spotlight-icon-orb-${spotlightStateKey}`"
            >
              <SyncOutlined
                v-if="spotlightStateKey === 'running'"
                spin
                class="overview-spotlight-icon"
              />
              <CloseCircleFilled
                v-else-if="spotlightStateKey === 'failed'"
                class="overview-spotlight-icon"
              />
              <CheckCircleFilled
                v-else-if="spotlightStateKey === 'success'"
                class="overview-spotlight-icon"
              />
              <ClockCircleFilled v-else class="overview-spotlight-icon" />
            </div>
          </div>
          <div>
            <div class="overview-spotlight-label">当前关注</div>
            <div class="overview-spotlight-text">{{ spotlightHeadline }}</div>
            <div class="overview-spotlight-hint">{{ spotlightHint }}</div>
            <div v-if="spotlightOrders.length" class="overview-spotlight-orders">
              <span class="overview-spotlight-orders-label">最新单号</span>
              <div class="overview-spotlight-order-links">
                <button
                  v-for="item in spotlightOrders"
                  :key="item.id"
                  type="button"
                  class="overview-spotlight-order-link"
                  @click="toDetail(item.id)"
                >
                  {{ item.orderNo }}
                </button>
              </div>
            </div>
          </div>
          <div class="overview-spotlight-meta">
            <span>最近刷新</span>
            <strong>{{ refreshText }}</strong>
            <span>自动轮询</span>
            <strong>5s</strong>
          </div>
        </div>
      </div>
    </a-card>

    <a-card class="filter-card" :bordered="true">
      <div class="filter-entry-row">
        <div class="quick-filter-row">
          <a-button
            class="release-toolbar-action-btn release-toolbar-action-btn--primary release-quick-filter-trigger-btn"
            :class="{ 'release-quick-filter-trigger-btn--active': statusExpanded || Boolean(filters.status) }"
            @click="statusExpanded = !statusExpanded"
          >
            <template #icon>
              <FilterOutlined />
            </template>
            状态查询
            <DownOutlined :class="{ 'trigger-icon-rotate': statusExpanded }" />
          </a-button>
          <transition-group name="filter-expand">
            <a-button
              v-for="item in statusOptions"
              v-show="statusExpanded"
              :key="String(item.value)"
              class="release-toolbar-action-btn release-quick-filter-chip-btn"
              :class="{ 'release-quick-filter-chip-btn--active': filters.status === item.value }"
              @click="handleQuickStatusChange(item.value)"
            >
              {{ item.label }}
            </a-button>
          </transition-group>

          <div v-if="envShortcutOptions.length > 0" class="quick-filter-divider"></div>

          <template v-if="envShortcutOptions.length > 0">
            <a-button
              class="release-toolbar-action-btn release-toolbar-action-btn--primary release-quick-filter-trigger-btn"
              :class="{ 'release-quick-filter-trigger-btn--active': envExpanded || Boolean(currentEnvFilter) }"
              @click="envExpanded = !envExpanded"
            >
              <template #icon>
                <EnvironmentOutlined />
              </template>
              环境筛选
              <DownOutlined :class="{ 'trigger-icon-rotate': envExpanded }" />
            </a-button>
            <transition-group name="filter-expand">
              <a-button
                v-for="item in envShortcutOptions"
                v-show="envExpanded"
                :key="item.value"
                class="release-toolbar-action-btn release-quick-filter-chip-btn"
                :class="{ 'release-quick-filter-chip-btn--active': currentEnvFilter === item.value }"
                @click="handleEnvQuickFilter(item.value)"
              >
                {{ item.label }}
              </a-button>
            </transition-group>
          </template>
        </div>
      </div>

      <div v-if="showAdvancedSearch" class="filter-advanced-panel">
        <div class="filter-actions-row">
          <div class="filter-actions-hint">
            高级条件需点击"查询"后生效
            <template v-if="hasPendingAdvancedFilterChanges">
              · 有未生效的条件
            </template>
          </div>
          <div class="filter-actions-buttons">
            <a-button
              class="release-toolbar-action-btn release-toolbar-action-btn--primary"
              @click="handleSearch"
            >
              查询
            </a-button>
            <a-button
              class="release-toolbar-action-btn release-toolbar-action-btn--ghost"
              @click="handleReset"
            >
              重置
            </a-button>
          </div>
        </div>
        <a-form layout="vertical" class="filter-grid">
          <a-form-item
            label="检索词"
            class="filter-grid-item filter-grid-item--keyword"
          >
            <a-input
              v-model:value="filters.keyword"
              class="filter-select"
              allow-clear
              placeholder="支持发布单号 / 来源单号 / 应用名"
              @keydown.enter.prevent="handleSearch"
            />
          </a-form-item>
          <a-form-item
            label="应用"
            class="filter-grid-item filter-grid-item--app"
          >
            <a-select
              v-model:value="filters.application_id"
              class="application-select"
              show-search
              allow-clear
              option-filter-prop="label"
              placeholder="全部"
              :loading="applicationsLoading"
              :options="applicationOptions"
              @change="handleApplicationChange"
            />
          </a-form-item>
          <a-form-item label="操作类型" class="filter-grid-item">
            <a-select
              v-model:value="filters.operation_type"
              class="filter-select"
              allow-clear
              placeholder="全部"
              :options="operationTypeOptions"
            />
          </a-form-item>
          <a-form-item label="触发方式" class="filter-grid-item">
            <a-select
              v-model:value="filters.trigger_type"
              class="filter-select"
              allow-clear
              placeholder="全部"
              :options="triggerTypeOptions"
            />
          </a-form-item>
          <a-form-item label="创建时间" class="filter-grid-item">
            <a-range-picker
              v-model:value="filters.created_at_range"
              class="filter-select"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              allow-clear
            />
          </a-form-item>
          <a-form-item label="发起人" class="filter-grid-item">
            <a-input
              v-model:value="filters.triggered_by"
              class="filter-select"
              allow-clear
              placeholder="按发起人模糊匹配"
              @keydown.enter.prevent="handleSearch"
            />
          </a-form-item>
        </a-form>
      </div>

      <div v-if="activeFilterTags.length > 0" class="active-filter-bar">
        <span class="active-filter-label">当前筛选</span>
        <a-space wrap :size="[8, 8]">
          <a-tag
            v-for="item in activeFilterTags"
            :key="item.key"
            closable
            class="active-filter-tag"
            @close.prevent="clearFilterTag(item.key)"
          >
            {{ item.label }}：{{ item.value }}
          </a-tag>
        </a-space>
      </div>
    </a-card>

    <a-card class="table-card" :bordered="true">
      <a-table
        class="release-order-table"
        row-key="id"
        :row-selection="tableRowSelection"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1650 }"
      >
        <template #expandedRowRender="{ record }">
          <div class="approval-flow-card release-list-expand-card">
            <div class="approval-flow-head">
              <div>
                <div class="approval-flow-kicker">审批流程</div>
                <div class="approval-flow-title">{{ record.order_no }}</div>
              </div>
              <a-tag :color="businessStatusColor(orderBusinessStatus(record))" class="status-tag approval-flow-status-tag">
                <LoadingOutlined v-if="isRunningBusinessStatus(orderBusinessStatus(record))" spin />
                <span>{{ businessStatusText(orderBusinessStatus(record)) }}</span>
              </a-tag>
            </div>
            <div class="approval-flow-summary">{{ approvalFlowSummary(record) }}</div>
            <div class="approval-flow-track">
              <div
                v-for="(node, index) in approvalFlowNodes(record)"
                :key="`${record.id}-${node.key}`"
                class="approval-flow-node"
                :class="approvalFlowToneClass(node.tone)"
              >
                <div class="approval-flow-node-main">
                  <div class="approval-flow-node-icon">
                    <component :is="approvalFlowIcon(node.tone)" :spin="node.tone === 'active'" />
                  </div>
                  <div class="approval-flow-node-copy">
                    <strong>{{ node.title }}</strong>
                    <p>{{ node.caption }}</p>
                  </div>
                </div>
                <div v-if="index < approvalFlowNodes(record).length - 1" class="approval-flow-connector"></div>
              </div>
            </div>
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="businessStatusColor(orderBusinessStatus(record))" class="status-tag">
              <LoadingOutlined v-if="isRunningBusinessStatus(orderBusinessStatus(record))" spin />
              <span>{{ businessStatusText(orderBusinessStatus(record)) }}</span>
            </a-tag>
          </template>
          <template v-else-if="column.key === 'started_at'">
            {{ formatTime(record.started_at) }}
          </template>
          <template v-else-if="column.key === 'order_no'">
            <a-space :size="6" wrap>
              <span>{{ record.order_no }}</span>
              <a-tag
                v-if="record.live_state_status === 'pending_confirm' && record.live_state_can_confirm"
                class="dashboard-chip dashboard-chip-warning"
              >
                待确认生效
              </a-tag>
              <a-tag
                v-else-if="record.live_state_is_current"
                class="dashboard-chip dashboard-chip-running"
              >
                当前生效
              </a-tag>
              <a-tag
                v-if="record.is_concurrent"
                class="dashboard-chip dashboard-chip-running"
                >并发执行</a-tag
              >
              <a-tag
                v-if="record.operation_type === 'rollback'"
                class="dashboard-chip dashboard-chip-danger"
              >
                {{ operationTypeText(record.operation_type) }}
              </a-tag>
              <a-tag
                v-else-if="record.operation_type === 'replay'"
                class="dashboard-chip dashboard-chip-warning"
              >
                {{ operationTypeText(record.operation_type) }}
              </a-tag>
              <a-tag
                v-if="record.concurrent_batch_no"
                class="dashboard-chip dashboard-chip-neutral"
              >
                {{ record.concurrent_batch_no }}
              </a-tag>
            </a-space>
          </template>
          <template v-else-if="column.key === 'finished_at'">
            {{ formatTime(record.finished_at) }}
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatTime(record.created_at) }}
          </template>
          <template v-else-if="column.key === 'trigger_type'">
            {{ triggerTypeText(record.trigger_type) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="toDetail(record.id)"
                >详情</a-button
              >
              <a-button
                type="link"
                size="small"
                :disabled="!canEdit(record)"
                @click="handleEdit(record)"
              >
                编辑
              </a-button>
              <a-button
                v-if="canBuild(record)"
                type="link"
                size="small"
                :disabled="!canBuild(record)"
                :loading="executingID === record.id && executePreviewAction === 'build'"
                @click="openExecutePreviewModal(record, 'build')"
              >
                仅构建
              </a-button>
              <a-button
                v-else-if="canDeploy(record)"
                type="link"
                size="small"
                :disabled="!canDeploy(record)"
                :loading="executingID === record.id && executePreviewAction === 'deploy'"
                @click="openExecutePreviewModal(record, 'deploy')"
              >
                发布
              </a-button>
              <a-button
                v-else-if="canExecute(record)"
                type="link"
                size="small"
                :disabled="!canExecute(record)"
                :loading="executingID === record.id && executePreviewAction === 'execute'"
                @click="openExecutePreviewModal(record)"
              >
                发布
              </a-button>
              <a-button
                v-if="canConfirmLive(record)"
                type="link"
                size="small"
                :loading="confirmingLiveID === record.id"
                @click="handleConfirmLive(record)"
              >
                确认生效
              </a-button>
              <a-popconfirm
                v-if="canTriggerArgoReplay(record)"
                :disabled="!canRollback(record)"
                title="确认基于当前发布单创建一键重发单吗？"
                ok-text="确认重发"
                cancel-text="取消"
                @confirm="handleRollback(record)"
              >
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button
                  type="link"
                  size="small"
                  class="rollback-trigger-link"
                  :disabled="!canRollback(record)"
                  :loading="recoveringID === record.id"
                  >一键重发</a-button
                >
              </a-popconfirm>
              <a-popconfirm
                v-else-if="canTriggerStandardReplay(record)"
                :disabled="!canReplay(record)"
                :title="replayConfirmTitle(record)"
                :ok-text="isCiOnlyRecovery(record) ? '确认重发' : '确认重放'"
                cancel-text="取消"
                @confirm="handleReplay(record)"
              >
                <template #icon>
                  <ExclamationCircleOutlined />
                </template>
                <a-button
                  type="link"
                  size="small"
                  class="rollback-trigger-link"
                  :disabled="!canReplay(record)"
                  :loading="recoveringID === record.id"
                  >{{ replayActionText(record) }}</a-button
                >
              </a-popconfirm>
              <a-popconfirm
                v-if="canCancel(record)"
                title="确认取消当前发布单吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleCancel(record)"
              >
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button
                  type="link"
                  size="small"
                  danger
                  :loading="cancellingID === record.id"
                  >取消</a-button
                >
              </a-popconfirm>
              <a-button v-else type="link" size="small" disabled>取消</a-button>
              <a-popconfirm
                v-if="authStore.isAdmin"
                title="确认删除该发布记录吗？删除后不可恢复"
                ok-text="确认删除"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button
                  type="link"
                  size="small"
                  danger
                  :loading="deletingID === record.id"
                  >删除</a-button
                >
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <div class="pagination-area">
        <a-pagination
          :current="filters.page"
          :page-size="filters.pageSize"
          :total="total"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          show-quick-jumper
          :show-total="(count: number) => `共 ${count} 条`"
          @change="handlePageChange"
          @showSizeChange="handlePageSizeChange"
        />
      </div>
    </a-card>

    <a-modal
      :open="batchExecutePreviewVisible"
      :width="920"
      ok-text="确认并发执行"
      cancel-text="取消"
      :confirm-loading="batchExecuteSubmitting"
      :ok-button-props="{
        disabled:
          batchExecutePreviewItems.length < 2 || batchExecutePreviewLoading,
      }"
      @ok="confirmBatchExecute"
      @cancel="closeBatchExecutePreviewModal"
    >
      <template #title>
        并发执行预审
        <a-popover
          trigger="click"
          placement="rightTop"
          overlay-class-name="release-tip-popover"
        >
          <template #content>
            <div class="release-tip-content">
              系统会先校验每张发布单的执行条件；同一批次中命中同应用同环境的发布单，会在通过预检后进入等待队列，按顺序逐步执行
            </div>
          </template>
          <button
            class="release-tip-trigger release-tip-trigger-info"
            type="button"
            aria-label="查看并发执行预审说明"
          >
            <ExclamationCircleOutlined />
          </button>
        </a-popover>
      </template>
      <a-skeleton
        v-if="batchExecutePreviewLoading"
        active
        :paragraph="{ rows: 8 }"
      />
      <template v-else>
        <div class="batch-preview-overview">
          <div class="batch-preview-metric">
            <div class="batch-preview-metric-label">待执行单</div>
            <div class="batch-preview-metric-value">
              {{ batchExecutePreviewItems.length }}
            </div>
          </div>
          <div class="batch-preview-metric">
            <div class="batch-preview-metric-label">可直接执行</div>
            <div class="batch-preview-metric-value">
              {{ batchPreviewPassCount }}
            </div>
          </div>
          <div class="batch-preview-metric">
            <div class="batch-preview-metric-label">排队等待</div>
            <div class="batch-preview-metric-value">
              {{ batchPreviewWaitingCount }}
            </div>
          </div>
          <div class="batch-preview-metric">
            <div class="batch-preview-metric-label">阻塞项</div>
            <div class="batch-preview-metric-value">
              {{ batchPreviewBlockedCount }}
            </div>
          </div>
        </div>

        <div v-if="batchPreviewHasStagedOrders" class="batch-dispatch-mode-panel">
          <div class="batch-dispatch-mode-title">可分段单执行方式</div>
          <div class="batch-dispatch-mode-desc">
            当前勾选中可分段发布单 {{ batchPreviewStagedCount }} 张，纯 CI 发布单
            {{ batchPreviewCIOnlyCount }} 张纯 CI 发布单会默认走正常发布执行
          </div>
          <a-radio-group
            :value="batchExecuteStagedDispatchMode"
            button-style="solid"
            @change="
              handleBatchDispatchModeChange(
                $event.target.value as BatchExecuteStagedDispatchMode,
              )
            "
          >
            <a-radio-button value="execute">直接进入部署流程</a-radio-button>
            <a-radio-button value="build">仅构建可分段单</a-radio-button>
          </a-radio-group>
        </div>

        <div class="batch-preview-list">
          <div
            v-for="item in batchExecutePreviewItems"
            :key="item.order.id"
            class="batch-preview-card"
          >
            <div class="batch-preview-card-head">
              <div class="batch-preview-card-copy">
                <div class="batch-preview-card-title">
                  {{ item.order.order_no }}
                </div>
                <div class="batch-preview-card-meta">
                  {{ item.order.application_name || "-" }} / {{ item.order.env_code || "-" }}
                </div>
              </div>
              <a-space :size="8" wrap>
                <a-tag class="dashboard-chip dashboard-chip-neutral">
                  {{ triggerTypeText(item.order.trigger_type) }}
                </a-tag>
                <a-tag :color="businessStatusColor(orderBusinessStatus(item.order))" class="status-tag">
                  <LoadingOutlined v-if="isRunningBusinessStatus(orderBusinessStatus(item.order))" spin />
                  <span>{{ businessStatusText(orderBusinessStatus(item.order)) }}</span>
                </a-tag>
              </a-space>
            </div>

            <div class="batch-preview-detail-grid">
              <div class="batch-preview-detail-item">
                <span class="batch-preview-detail-label">Git 版本</span>
                <span class="batch-preview-detail-value">
                  {{ item.order.git_ref || "-" }}
                </span>
              </div>
              <div class="batch-preview-detail-item">
                <span class="batch-preview-detail-label">镜像版本</span>
                <span class="batch-preview-detail-value">
                  {{ item.order.image_tag || "-" }}
                </span>
              </div>
              <div class="batch-preview-detail-item">
                <span class="batch-preview-detail-label">创建者</span>
                <span class="batch-preview-detail-value">
                  {{ item.order.triggered_by || "-" }}
                </span>
              </div>
              <div class="batch-preview-detail-item">
                <span class="batch-preview-detail-label">操作类型</span>
                <span class="batch-preview-detail-value">
                  {{ operationTypeText(item.order.operation_type) }}
                </span>
              </div>
            </div>

            <div class="batch-preview-precheck">
              <div class="batch-preview-precheck-title">预检结果</div>
              <a-empty
                v-if="!item.precheck?.items?.length"
                description="暂无预检结果"
              />
              <div v-else class="batch-preview-precheck-list">
                <div
                  v-for="precheckItem in item.precheck.items"
                  :key="`${item.order.id}-${precheckItem.key}`"
                  class="batch-preview-precheck-item"
                >
                  <div class="batch-preview-precheck-copy">
                    <div class="batch-preview-precheck-name">
                      {{ precheckItem.name }}
                    </div>
                    <div class="batch-preview-precheck-message">
                      {{ precheckItem.message }}
                    </div>
                  </div>
                  <a-tag
                    :class="[
                      'status-tag',
                      batchPrecheckToneClass(precheckItem.status),
                    ]"
                  >
                    <LoadingOutlined v-if="precheckItem.status === 'warn'" spin />
                    <span>{{ batchPrecheckStatusText(precheckItem.status) }}</span>
                  </a-tag>
                </div>
              </div>
            </div>

            <div class="batch-preview-precheck batch-preview-params">
              <a-collapse ghost class="batch-preview-param-collapse">
                <a-collapse-panel key="params" :header="`参数快照（${item.params.length}）`">
                  <a-empty
                    v-if="!item.params.length"
                    description="本次发布无参数快照"
                  />
                  <a-table
                    v-else
                    row-key="id"
                    size="small"
                    :pagination="false"
                    :data-source="item.params"
                    :columns="[
                      {
                        title: '平台 Key',
                        dataIndex: 'param_key',
                        key: 'param_key',
                        width: 140,
                      },
                      {
                        title: '执行器参数',
                        dataIndex: 'executor_param_name',
                        key: 'executor_param_name',
                        width: 160,
                      },
                      {
                        title: '参数值',
                        dataIndex: 'param_value',
                        key: 'param_value',
                        ellipsis: true,
                      },
                      {
                        title: '来源',
                        dataIndex: 'value_source',
                        key: 'value_source',
                        width: 100,
                      },
                      {
                        title: '作用域',
                        dataIndex: 'pipeline_scope',
                        key: 'pipeline_scope',
                        width: 100,
                      },
                    ]"
                    :scroll="{ x: 760 }"
                  />
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </div>
      </template>
    </a-modal>

    <a-modal
      :open="executePreviewVisible"
      :title="executePreviewTitle"
      :width="860"
      :ok-text="executePreviewOkText"
      cancel-text="取消"
      :ok-button-props="{
        disabled:
          !executePreviewOrder ||
          (executePreviewAction === 'build'
            ? !canBuild(executePreviewOrder)
            : executePreviewAction === 'deploy'
              ? !canDeploy(executePreviewOrder)
              : !canExecute(executePreviewOrder)) ||
          (Boolean(executePreviewPrecheck) && !executePreviewPrecheck?.executable),
      }"
      :confirm-loading="executeSubmitting"
      @ok="confirmExecuteRelease"
      @cancel="closeExecutePreviewModal"
    >
      <a-skeleton
        v-if="executePreviewLoading"
        active
        :paragraph="{ rows: 8 }"
      />
      <template v-else-if="executePreviewOrder">
        <div class="batch-preview-overview execute-preview-overview">
          <div class="batch-preview-metric">
            <div class="batch-preview-metric-label">发布单号</div>
            <div class="batch-preview-metric-value batch-preview-metric-value-compact">
              {{ executePreviewOrder.order_no }}
            </div>
          </div>
          <div class="batch-preview-metric">
            <div class="batch-preview-metric-label">应用 / 环境</div>
            <div class="batch-preview-metric-value batch-preview-metric-value-compact">
              {{ executePreviewOrder.application_name || "-" }} / {{ executePreviewOrder.env_code || "-" }}
            </div>
          </div>
          <div class="batch-preview-metric">
            <div class="batch-preview-metric-label">Git 版本</div>
            <div class="batch-preview-metric-value batch-preview-metric-value-compact">
              {{ executePreviewOrder.git_ref || "-" }}
            </div>
          </div>
          <div class="batch-preview-metric">
            <div class="batch-preview-metric-label">镜像版本</div>
            <div class="batch-preview-metric-value batch-preview-metric-value-compact">
              {{ executePreviewOrder.image_tag || "-" }}
            </div>
          </div>
        </div>

        <a-alert
          class="batch-preview-alert"
          :type="executePreviewSummaryTone"
          show-icon
          message="预审结果"
          :description="executePreviewSummaryMessage"
        />

        <div class="execute-preview-section">
          <div class="batch-preview-precheck-title">预审项</div>
          <a-empty
            v-if="!executePreviewPrecheck?.items?.length"
            description="暂无预审结果"
          />
          <div v-else class="batch-preview-precheck-list">
            <div
              v-for="precheckItem in executePreviewPrecheck.items"
              :key="precheckItem.key"
              class="batch-preview-precheck-item"
            >
              <div class="batch-preview-precheck-copy">
                <div class="batch-preview-precheck-name">
                  {{ precheckItem.name }}
                </div>
                <div class="batch-preview-precheck-message">
                  {{ precheckItem.message }}
                </div>
              </div>
              <a-tag
                :class="[
                  'status-tag',
                  batchPrecheckToneClass(precheckItem.status),
                ]"
              >
                <LoadingOutlined v-if="precheckItem.status === 'warn'" spin />
                <span>{{ batchPrecheckStatusText(precheckItem.status) }}</span>
              </a-tag>
            </div>
          </div>
        </div>

        <div class="execute-preview-section">
          <div class="preview-param-header">发布参数</div>
          <div class="execute-preview-param-meta">
            当前展示的是本次发布确认时会带入执行链路的参数快照
          </div>
        </div>
        <a-empty
          v-if="executePreviewParams.length === 0"
          description="本次发布无参数快照"
        />
        <a-table
          v-else
          row-key="id"
          size="small"
          :pagination="false"
          :data-source="executePreviewParams"
          :columns="[
            {
              title: '平台 Key',
              dataIndex: 'param_key',
              key: 'param_key',
              width: 130,
            },
            {
              title: '执行器参数',
              dataIndex: 'executor_param_name',
              key: 'executor_param_name',
              width: 150,
            },
            {
              title: '参数值',
              dataIndex: 'param_value',
              key: 'param_value',
              ellipsis: true,
            },
            {
              title: '来源',
              dataIndex: 'value_source',
              key: 'value_source',
              width: 100,
            },
            {
              title: '作用域',
              dataIndex: 'pipeline_scope',
              key: 'pipeline_scope',
              width: 100,
            },
          ]"
          :scroll="{ x: 560 }"
        />
      </template>
    </a-modal>
  </div>
</template>

<style scoped>
.page-header-card {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.release-toolbar-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.34) !important;
  background: rgba(255, 255, 255, 0.42) !important;
  color: #0f172a !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 10px 22px rgba(15, 23, 42, 0.05) !important;
  backdrop-filter: blur(14px) saturate(135%);
  padding-inline: 14px;
  font-weight: 600;
}

.release-toolbar-action-btn:hover,
.release-toolbar-action-btn:focus,
.release-toolbar-action-btn:focus-visible,
.release-toolbar-action-btn:active {
  border-color: rgba(96, 165, 250, 0.34) !important;
  background: rgba(255, 255, 255, 0.56) !important;
  color: #0f172a !important;
}

.release-toolbar-action-btn--primary {
  background: linear-gradient(180deg, rgba(241, 247, 255, 0.9), rgba(223, 235, 255, 0.8)) !important;
  border-color: rgba(147, 197, 253, 0.74) !important;
  color: #1d4ed8 !important;
}

.release-toolbar-action-btn--primary:hover,
.release-toolbar-action-btn--primary:focus,
.release-toolbar-action-btn--primary:focus-visible,
.release-toolbar-action-btn--primary:active {
  background: linear-gradient(180deg, rgba(248, 251, 255, 0.96), rgba(231, 241, 255, 0.88)) !important;
  border-color: rgba(96, 165, 250, 0.66) !important;
  color: #1e3a8a !important;
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 12px 26px rgba(59, 130, 246, 0.12) !important;
}

.release-quick-filter-chip-btn {
  min-width: 108px;
  border: 1px solid rgba(148, 163, 184, 0.22) !important;
  background: rgba(255, 255, 255, 0.62) !important;
  color: #0f172a !important;
  font-size: 14px;
  font-weight: 700;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    0 12px 24px rgba(15, 23, 42, 0.04) !important;
}

.release-quick-filter-chip-btn:hover,
.release-quick-filter-chip-btn:focus,
.release-quick-filter-chip-btn:focus-visible,
.release-quick-filter-chip-btn:active {
  border-color: rgba(59, 130, 246, 0.32) !important;
  background: rgba(239, 246, 255, 0.78) !important;
  color: #0f172a !important;
}

.release-quick-filter-trigger-btn {
  min-width: 126px;
  padding-inline: 16px;
}

.release-quick-filter-chip-btn {
  padding-inline: 14px;
}

.release-quick-filter-trigger-btn--active {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 12px 26px rgba(59, 130, 246, 0.12) !important;
}

.release-quick-filter-chip-btn--active {
  border-color: rgba(59, 130, 246, 0.32) !important;
  background: rgba(239, 246, 255, 0.78) !important;
  color: #0f172a !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 14px 28px rgba(59, 130, 246, 0.08) !important;
}

.release-toolbar-action-btn--ghost {
  background: transparent !important;
  border-color: rgba(30, 41, 59, 0.16) !important;
  color: var(--color-text-secondary) !important;
  box-shadow: none !important;
}

.release-toolbar-action-btn--ghost:hover,
.release-toolbar-action-btn--ghost:focus,
.release-toolbar-action-btn--ghost:focus-visible,
.release-toolbar-action-btn--ghost:active {
  background: rgba(241, 245, 249, 0.8) !important;
  border-color: rgba(30, 41, 59, 0.24) !important;
  color: var(--color-text-main) !important;
}

.release-toolbar-action-btn--danger {
  background: rgba(254, 242, 242, 0.8) !important;
  border-color: rgba(239, 68, 68, 0.2) !important;
  color: #dc2626 !important;
  box-shadow: none !important;
}

.release-toolbar-action-btn--danger:hover,
.release-toolbar-action-btn--danger:focus,
.release-toolbar-action-btn--danger:focus-visible,
.release-toolbar-action-btn--danger:active {
  background: rgba(254, 226, 226, 0.9) !important;
  border-color: rgba(239, 68, 68, 0.36) !important;
  color: #b91c1c !important;
}

.release-toolbar-action-btn--danger:disabled,
.release-toolbar-action-btn--danger[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-header-selection {
  margin-top: 4px;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.page-header-selection strong {
  color: var(--color-text-main);
  font-weight: 600;
}

.release-overview-card,
.filter-card,
.table-card {
  border-radius: var(--radius-xl);
}

.release-overview-card {
  background: transparent;
  border: none;
  box-shadow: none;
}

.release-overview-card :deep(.ant-card-body) {
  padding: 0;
  background: transparent;
}

.filter-card {
  background: transparent;
  border: none;
  box-shadow: none;
}

.filter-card :deep(.ant-card-body) {
  padding: 0;
  background: transparent;
}

.table-card {
  background: transparent;
  border: none;
  box-shadow: none;
}

.table-card :deep(.ant-card-body) {
  padding: 0;
  background: transparent;
}

.overview-bar {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.85fr);
  gap: 14px;
}

.overview-chart-panel {
  position: relative;
  min-height: 236px;
  border-radius: 20px;
  padding: 18px;
  border: 1px solid rgba(71, 85, 105, 0.4);
  background:
    radial-gradient(circle at top right, rgba(52, 211, 153, 0.14), transparent 24%),
    radial-gradient(circle at top left, rgba(96, 165, 250, 0.16), transparent 30%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.98), rgba(15, 23, 42, 0.96) 48%, rgba(19, 30, 53, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 22px 48px rgba(2, 6, 23, 0.16);
  overflow: hidden;
}

.overview-chart-panel::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 1px;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0), rgba(56, 189, 248, 0.46), rgba(52, 211, 153, 0.32), rgba(56, 189, 248, 0));
  pointer-events: none;
}

.overview-chart-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 14px;
  margin-bottom: 12px;
}

.overview-chart-label {
  color: rgba(125, 211, 252, 0.92);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.overview-chart-title {
  margin-top: 6px;
  color: #f8fafc;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
}

.overview-chart-meta {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(71, 85, 105, 0.34);
  background: rgba(15, 23, 42, 0.44);
  color: rgba(226, 232, 240, 0.7);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.overview-chart-canvas {
  height: 142px;
  width: 100%;
}

.overview-chart-footnote {
  margin-top: 6px;
  color: rgba(226, 232, 240, 0.54);
  font-size: 12px;
  line-height: 1.6;
}

.overview-spotlight {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  min-height: 236px;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid var(--color-dashboard-border);
  background:
    radial-gradient(
      circle at top right,
      var(--color-primary-glow-strong),
      transparent 38%
    ),
    linear-gradient(
      145deg,
      var(--color-dashboard-900) 0%,
      var(--color-primary-600) 100%
    );
  color: var(--color-dashboard-text);
  position: relative;
  overflow: hidden;
}

.overview-spotlight-icon-wrap {
  position: absolute;
  top: 16px;
  right: 16px;
}

.overview-spotlight-icon-orb {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 10px 24px rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(8px);
}

.overview-spotlight-icon {
  font-size: 28px;
  color: #eff6ff;
}

.overview-spotlight-icon-orb-running {
  color: #bfdbfe;
}

.overview-spotlight-icon-orb-failed {
  color: #fecdd3;
}

.overview-spotlight-icon-orb-success {
  color: #bbf7d0;
}

.overview-spotlight-icon-orb-pending {
  color: #fde68a;
}

.overview-spotlight-label {
  padding-right: 92px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-dashboard-label);
}

.overview-spotlight-text {
  margin-top: 14px;
  padding-right: 92px;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.overview-spotlight-hint {
  margin-top: 8px;
  padding-right: 88px;
  color: var(--color-dashboard-text-soft);
  font-size: 13px;
  line-height: 1.55;
}

.overview-spotlight-orders {
  margin-top: 12px;
  padding-right: 18px;
}

.overview-spotlight-orders-label {
  display: block;
  margin-bottom: 8px;
  color: rgba(226, 232, 240, 0.58);
  font-size: 12px;
  line-height: 1;
}

.overview-spotlight-order-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.overview-spotlight-order-link {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  max-width: 100%;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.overview-spotlight-order-link:hover,
.overview-spotlight-order-link:focus-visible {
  border-color: rgba(191, 219, 254, 0.46);
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  transform: translateY(-1px);
}

.overview-spotlight-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-dashboard-text-soft);
}

.overview-spotlight-meta span {
  color: rgba(226, 232, 240, 0.58);
}

.overview-spotlight-meta strong {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  font-weight: 700;
}

.quick-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  min-width: 0;
  align-items: center;
}

.quick-filter-divider {
  width: 1px;
  height: 24px;
  background: rgba(148, 163, 184, 0.24);
  flex-shrink: 0;
}

.quick-status-button {
  border-radius: 999px;
}

.trigger-icon-rotate {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.filter-expand-enter-active {
  transition: opacity 0.18s ease;
}

.filter-expand-leave-active {
  transition: opacity 0.12s ease;
}

.filter-expand-enter-from,
.filter-expand-leave-to {
  opacity: 0;
}

.filter-entry-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.advanced-toggle-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  flex: 0 0 auto;
}

.persistent-env-filter-row {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(255, 255, 255, 0.98));
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.persistent-env-filter-copy {
  min-width: 0;
}

.persistent-env-filter-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-main);
}

.persistent-env-filter-hint {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-soft);
}

.persistent-env-filter-select {
  width: 220px;
  flex: 0 0 auto;
}

.filter-advanced-panel {
  margin-top: 18px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: transparent;
  box-shadow: none;
}

.filter-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.filter-actions-hint {
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px 16px;
}

.filter-grid :deep(.ant-form-item) {
  margin-bottom: 0;
}

.filter-grid-item :deep(.ant-form-item-label) {
  padding-bottom: 6px;
}

.filter-grid-item :deep(.ant-form-item-label > label) {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.filter-grid-item--keyword {
  grid-column: span 3;
}

.filter-grid-item--app {
  grid-column: span 3;
}

.application-select,
.filter-select {
  width: 100%;
}

.filter-actions-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.active-filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px dashed var(--color-border);
}

.active-filter-label {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.active-filter-tag {
  border-radius: 999px;
  padding-inline: 10px;
}

.danger-icon {
  color: var(--color-danger);
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.approval-flow-card {
  padding: 18px 20px;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 20px 46px rgba(15, 23, 42, 0.06);
}

.release-list-expand-card {
  margin: 6px 0 10px;
}

.approval-flow-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.approval-flow-kicker {
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.approval-flow-title {
  margin-top: 8px;
  color: #0f172a;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.approval-flow-status-tag {
  margin: 0;
}

.approval-flow-summary {
  margin-top: 14px;
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.approval-flow-track {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.approval-flow-node {
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.approval-flow-node-main {
  flex: 1;
  min-width: 0;
  padding: 12px 12px 12px 10px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: #f8fafc;
}

.approval-flow-node-icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 15px;
}

.approval-flow-node-copy strong {
  display: block;
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

.approval-flow-node-copy p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.7;
}

.approval-flow-connector {
  align-self: center;
  width: 18px;
  height: 1px;
  margin-right: -2px;
  background: rgba(148, 163, 184, 0.45);
}

.approval-flow-node-done .approval-flow-node-main {
  background: rgba(240, 253, 244, 0.92);
  border-color: rgba(34, 197, 94, 0.18);
}

.approval-flow-node-done .approval-flow-node-icon {
  background: rgba(34, 197, 94, 0.14);
  color: #16a34a;
}

.approval-flow-node-active .approval-flow-node-main {
  background: rgba(239, 246, 255, 0.96);
  border-color: rgba(37, 99, 235, 0.18);
}

.approval-flow-node-active .approval-flow-node-icon {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}

.approval-flow-node-pending .approval-flow-node-main {
  background: rgba(248, 250, 252, 0.96);
  border-color: rgba(148, 163, 184, 0.16);
}

.approval-flow-node-pending .approval-flow-node-icon {
  background: rgba(148, 163, 184, 0.12);
  color: #64748b;
}

.approval-flow-node-rejected .approval-flow-node-main {
  background: rgba(254, 242, 242, 0.96);
  border-color: rgba(239, 68, 68, 0.18);
}

.approval-flow-node-rejected .approval-flow-node-icon {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

.rollback-trigger-link {
  color: #0f172a;
}

.rollback-trigger-link:hover,
.rollback-trigger-link:focus {
  color: #020617;
}

.batch-preview-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.batch-preview-metric {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--color-border-muted);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.batch-preview-metric-label {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.batch-preview-metric-value {
  margin-top: 8px;
  color: var(--color-text-main);
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.batch-preview-alert {
  margin-bottom: 16px;
}

.batch-dispatch-mode-panel {
  margin-top: -6px;
  margin-bottom: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.batch-dispatch-mode-title {
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.batch-dispatch-mode-desc {
  margin-top: 4px;
  margin-bottom: 10px;
  color: #475569;
  font-size: 12px;
  line-height: 1.6;
}

.execute-preview-overview {
  margin-bottom: 16px;
}

.batch-preview-metric-value-compact {
  font-size: 16px;
  line-height: 1.4;
  word-break: break-word;
}

.execute-preview-section + .execute-preview-section {
  margin-top: 18px;
}

.execute-preview-param-meta {
  margin-top: -4px;
  margin-bottom: 10px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.batch-preview-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 58vh;
  overflow: auto;
  padding-right: 2px;
}

.batch-preview-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--color-border-muted);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.batch-preview-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.batch-preview-card-copy {
  min-width: 0;
}

.batch-preview-card-title {
  color: var(--color-text-main);
  font-size: 15px;
  font-weight: 700;
}

.batch-preview-card-meta {
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.batch-preview-detail-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.batch-preview-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.batch-preview-detail-label {
  color: var(--color-text-muted);
  font-size: 12px;
}

.batch-preview-detail-value {
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}

.batch-preview-precheck {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px dashed var(--color-border);
}

.batch-preview-params :deep(.ant-table-wrapper) {
  margin-top: 6px;
}

.batch-preview-param-collapse {
  margin-top: -6px;
}

.batch-preview-param-collapse :deep(.ant-collapse-item) {
  border: none;
}

.batch-preview-param-collapse :deep(.ant-collapse-header) {
  padding: 0 0 4px !important;
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 700;
}

.batch-preview-param-collapse :deep(.ant-collapse-content) {
  border: none;
  background: transparent;
}

.batch-preview-param-collapse :deep(.ant-collapse-content-box) {
  padding: 8px 0 0 !important;
}

.batch-preview-precheck-title {
  margin-bottom: 10px;
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 700;
}

.batch-preview-precheck-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.batch-preview-precheck-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.92);
  border: 1px solid var(--color-border-soft);
}

.batch-preview-precheck-copy {
  min-width: 0;
}

.batch-preview-precheck-name {
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 600;
}

.batch-preview-precheck-message {
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.preview-param-header {
  margin: 16px 0 8px;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .page-header {
    flex-wrap: wrap;
  }

  .overview-bar {
    grid-template-columns: 1fr;
  }

  .overview-chart-panel {
    min-height: 236px;
  }

  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-grid-item--keyword,
  .filter-grid-item--app {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .approval-flow-card {
    padding: 16px;
  }

  .approval-flow-head {
    flex-direction: column;
  }

  .approval-flow-track {
    grid-template-columns: 1fr;
  }

  .approval-flow-node {
    flex-direction: column;
    gap: 8px;
  }

  .approval-flow-connector {
    width: 1px;
    height: 16px;
    margin: 0 0 0 14px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-chart-panel {
    min-height: 210px;
    padding: 16px;
  }

  .overview-chart-title {
    font-size: 18px;
  }

  .overview-chart-canvas {
    height: 132px;
  }

  .overview-spotlight {
    min-height: 198px;
    padding: 16px;
  }

  .overview-spotlight-text {
    font-size: 22px;
  }

  .batch-preview-overview,
  .batch-preview-detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-entry-row {
    flex-direction: column;
    align-items: stretch;
  }

  .persistent-env-filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .persistent-env-filter-select {
    width: 100%;
  }

  .advanced-toggle-button {
    align-self: flex-start;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filter-grid-item--keyword,
  .filter-grid-item--app {
    grid-column: span 1;
  }

  .filter-actions-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .batch-preview-card-head,
  .batch-preview-precheck-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .batch-preview-overview,
  .batch-preview-detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
