package usecase

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	argocddomain "gos/internal/domain/argocdapp"
	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/release"
)

type ReleaseOrderPrecheckItemStatus string

const (
	ReleaseOrderPrecheckItemStatusPass    ReleaseOrderPrecheckItemStatus = "pass"
	ReleaseOrderPrecheckItemStatusWarn    ReleaseOrderPrecheckItemStatus = "warn"
	ReleaseOrderPrecheckItemStatusBlocked ReleaseOrderPrecheckItemStatus = "blocked"
)

type ReleaseOrderPrecheckItem struct {
	Key     string                         `json:"key"`
	Name    string                         `json:"name"`
	Status  ReleaseOrderPrecheckItemStatus `json:"status"`
	Message string                         `json:"message"`
}

type ReleaseOrderPrecheckOutput struct {
	OrderID          string                     `json:"order_id"`
	OrderNo          string                     `json:"order_no"`
	Executable       bool                       `json:"executable"`
	WaitingForLock   bool                       `json:"waiting_for_lock"`
	AheadCount       int                        `json:"ahead_count"`
	LockEnabled      bool                       `json:"lock_enabled"`
	LockScope        string                     `json:"lock_scope"`
	ConflictStrategy string                     `json:"conflict_strategy"`
	LockKey          string                     `json:"lock_key"`
	ConflictOrderNo  string                     `json:"conflict_order_no"`
	ConflictMessage  string                     `json:"conflict_message"`
	Items            []ReleaseOrderPrecheckItem `json:"items"`
}

type releaseDispatchGuard struct {
	Settings       ReleaseConcurrencySettingsOutput
	LockScope      domain.ExecutionLockScope
	LockKey        string
	ConflictLock   *domain.ReleaseExecutionLock
	ConflictOrder  *domain.ReleaseOrder
	WaitingForLock bool
	AheadCount     int
	Message        string
}

func (uc *ReleaseOrderManager) PrecheckExecute(ctx context.Context, id string) (ReleaseOrderPrecheckOutput, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return ReleaseOrderPrecheckOutput{}, ErrInvalidID
	}
	order, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return ReleaseOrderPrecheckOutput{}, err
	}
	executions, err := uc.repo.ListExecutions(ctx, order.ID)
	if err != nil {
		return ReleaseOrderPrecheckOutput{}, err
	}
	params, err := uc.repo.ListParams(ctx, order.ID)
	if err != nil {
		return ReleaseOrderPrecheckOutput{}, err
	}
	return uc.buildOrderPrecheck(ctx, order, executions, params)
}

func (uc *ReleaseOrderManager) buildOrderPrecheck(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	params []domain.ReleaseOrderParam,
) (ReleaseOrderPrecheckOutput, error) {
	output := ReleaseOrderPrecheckOutput{
		OrderID:    order.ID,
		OrderNo:    order.OrderNo,
		Executable: true,
		Items:      make([]ReleaseOrderPrecheckItem, 0, 4),
	}

	statusItem := ReleaseOrderPrecheckItem{
		Key:     "order_status",
		Name:    "发布单状态",
		Status:  ReleaseOrderPrecheckItemStatusPass,
		Message: "发布单处于可执行状态",
	}
	switch order.Status {
	case domain.OrderStatusPending:
		statusItem.Message = "发布单处于待执行状态"
	case domain.OrderStatusApproved:
		statusItem.Message = "发布单已审批通过，可进入执行阶段"
	case domain.OrderStatusQueued:
		statusItem.Status = ReleaseOrderPrecheckItemStatusWarn
		statusItem.Message = "发布单已进入等待队列"
	case domain.OrderStatusRunning:
		statusItem.Message = "发布单已进入调度中"
	case domain.OrderStatusPendingApproval:
		statusItem.Status = ReleaseOrderPrecheckItemStatusBlocked
		statusItem.Message = "发布单待审批，审批通过后才允许触发"
		output.Executable = false
	case domain.OrderStatusApproving:
		statusItem.Status = ReleaseOrderPrecheckItemStatusBlocked
		statusItem.Message = "发布单审批中，审批完成后才允许触发"
		output.Executable = false
	case domain.OrderStatusRejected:
		statusItem.Status = ReleaseOrderPrecheckItemStatusBlocked
		statusItem.Message = "发布单审批已拒绝，无法继续触发"
		output.Executable = false
	case domain.OrderStatusDeploying:
		statusItem.Status = ReleaseOrderPrecheckItemStatusBlocked
		statusItem.Message = "发布单已进入发布中，无法再次触发"
		output.Executable = false
	default:
		statusItem.Status = ReleaseOrderPrecheckItemStatusBlocked
		statusItem.Message = "当前发布单不是可执行状态，无法再次触发"
		output.Executable = false
	}
	output.Items = append(output.Items, statusItem)

	executionItem := ReleaseOrderPrecheckItem{
		Key:     "execution_units",
		Name:    "执行单元",
		Status:  ReleaseOrderPrecheckItemStatusPass,
		Message: fmt.Sprintf("已配置 %d 个执行单元", len(executions)),
	}
	if len(executions) == 0 || findExecutionByStatus(executions, domain.ExecutionStatusPending) == nil {
		executionItem.Status = ReleaseOrderPrecheckItemStatusBlocked
		executionItem.Message = "未找到可执行的待执行单元"
		output.Executable = false
	}
	output.Items = append(output.Items, executionItem)

	pendingExecution := findExecutionByStatus(executions, domain.ExecutionStatusPending)
	if pendingExecution != nil {
		if referenceItem, ok, err := uc.buildExecutionReferencePrecheckItem(ctx, *pendingExecution); err != nil {
			return ReleaseOrderPrecheckOutput{}, err
		} else if ok {
			if referenceItem.Status == ReleaseOrderPrecheckItemStatusBlocked {
				output.Executable = false
			}
			output.Items = append(output.Items, referenceItem)
		}
		guard, err := uc.evaluateDispatchGuard(ctx, order, *pendingExecution, params)
		if err != nil {
			return ReleaseOrderPrecheckOutput{}, err
		}
		output.LockEnabled = guard.Settings.Enabled
		output.LockScope = string(guard.Settings.LockScope)
		output.ConflictStrategy = string(guard.Settings.ConflictStrategy)
		output.LockKey = guard.LockKey
		switch {
		case guard.ConflictLock != nil:
			output.ConflictOrderNo = strings.TrimSpace(guard.ConflictLock.ReleaseOrderNo)
			output.ConflictMessage = strings.TrimSpace(guard.Message)
		case guard.ConflictOrder != nil:
			output.ConflictOrderNo = strings.TrimSpace(guard.ConflictOrder.OrderNo)
			output.ConflictMessage = strings.TrimSpace(guard.Message)
		}
		output.AheadCount = guard.AheadCount
		if guard.Settings.Enabled || guard.ConflictLock != nil || guard.ConflictOrder != nil {
			itemName := "并发发布"
			if !guard.Settings.Enabled && guard.ConflictOrder != nil {
				itemName = "执行顺序"
			}
			item := ReleaseOrderPrecheckItem{
				Key:     "concurrency_lock",
				Name:    itemName,
				Status:  ReleaseOrderPrecheckItemStatusPass,
				Message: "未检测到执行互斥冲突",
			}
			if guard.Settings.Enabled {
				item.Message = fmt.Sprintf("并发控制已启用，当前按 %s 加锁", guard.Settings.LockScope)
			}
			switch {
			case (guard.ConflictLock != nil || guard.ConflictOrder != nil) && guard.WaitingForLock:
				item.Status = ReleaseOrderPrecheckItemStatusWarn
				item.Message = guard.Message
				output.WaitingForLock = true
			case guard.ConflictOrder != nil:
				item.Status = ReleaseOrderPrecheckItemStatusBlocked
				item.Message = guard.Message
				output.Executable = false
			case guard.ConflictLock != nil && guard.Settings.ConflictStrategy == ReleaseConcurrencyConflictStrategyReject:
				item.Status = ReleaseOrderPrecheckItemStatusBlocked
				item.Message = guard.Message
				output.Executable = false
			case guard.ConflictLock != nil && guard.Settings.ConflictStrategy == ReleaseConcurrencyConflictStrategyQueue:
				item.Status = ReleaseOrderPrecheckItemStatusWarn
				item.Message = guard.Message
				output.WaitingForLock = true
			}
			output.Items = append(output.Items, item)
		}
	}

	return output, nil
}

func (uc *ReleaseOrderManager) buildExecutionReferencePrecheckItem(
	ctx context.Context,
	execution domain.ReleaseOrderExecution,
) (ReleaseOrderPrecheckItem, bool, error) {
	if strings.TrimSpace(execution.BindingID) == "" {
		return ReleaseOrderPrecheckItem{}, false, nil
	}
	item := ReleaseOrderPrecheckItem{
		Key:     "execution_reference",
		Name:    "模板绑定",
		Status:  ReleaseOrderPrecheckItemStatusPass,
		Message: "模板绑定引用正常",
	}

	binding, err := uc.pipelineRepo.GetBindingByID(ctx, execution.BindingID)
	if err == nil {
		if binding.Status == pipelinedomain.StatusInactive {
			if strings.TrimSpace(execution.PipelineID) != "" {
				item.Status = ReleaseOrderPrecheckItemStatusWarn
				item.Message = fmt.Sprintf("模板引用的绑定 %s 已失效，将回退到快照管线 %s 继续执行，建议尽快更新模板绑定", firstNonEmpty(binding.Name, execution.BindingName, execution.BindingID), execution.PipelineID)
			} else {
				item.Status = ReleaseOrderPrecheckItemStatusBlocked
				item.Message = fmt.Sprintf("模板引用的绑定 %s 已失效，且未保存可回退的管线 ID，请先更新模板绑定", firstNonEmpty(binding.Name, execution.BindingName, execution.BindingID))
			}
		}
		return item, true, nil
	}
	if !errors.Is(err, pipelinedomain.ErrBindingNotFound) {
		return ReleaseOrderPrecheckItem{}, false, err
	}
	if strings.TrimSpace(execution.PipelineID) != "" {
		pipeline, pipelineErr := uc.pipelineRepo.GetPipelineByID(ctx, execution.PipelineID)
		if pipelineErr == nil {
			if activeErr := ensureActivePipelineRecord(pipeline, "快照管线"); activeErr == nil {
				item.Status = ReleaseOrderPrecheckItemStatusWarn
				item.Message = fmt.Sprintf("模板引用的绑定 %s 已失效，将回退到快照管线 %s 继续执行，建议尽快更新模板绑定", firstNonEmpty(execution.BindingName, execution.BindingID), execution.PipelineID)
				return item, true, nil
			}
			item.Status = ReleaseOrderPrecheckItemStatusBlocked
			item.Message = fmt.Sprintf("模板引用的绑定 %s 已失效，且快照管线 %s 不可用，请先更新模板绑定", firstNonEmpty(execution.BindingName, execution.BindingID), execution.PipelineID)
			return item, true, nil
		}
		if !errors.Is(pipelineErr, pipelinedomain.ErrPipelineNotFound) {
			return ReleaseOrderPrecheckItem{}, false, pipelineErr
		}
	}
	item.Status = ReleaseOrderPrecheckItemStatusBlocked
	item.Message = fmt.Sprintf("模板引用的绑定 %s 已失效，且未找到可回退的快照管线，请先更新模板绑定", firstNonEmpty(execution.BindingName, execution.BindingID))
	return item, true, nil
}

func (uc *ReleaseOrderManager) evaluateDispatchGuard(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
	params []domain.ReleaseOrderParam,
) (releaseDispatchGuard, error) {
	settings, err := uc.loadReleaseConcurrencySettings(ctx)
	if err != nil {
		return releaseDispatchGuard{}, err
	}
	guard := releaseDispatchGuard{Settings: settings}

	conflictOrder, err := uc.repo.FindActiveOrderByApplicationEnv(ctx, order.ApplicationID, order.EnvCode, order.ID)
	if err != nil && !errors.Is(err, domain.ErrOrderNotFound) {
		return releaseDispatchGuard{}, err
	}
	if err == nil {
		guard.ConflictOrder = &conflictOrder
		aheadCount, countErr := uc.repo.CountActiveOrdersByApplicationEnv(ctx, order.ApplicationID, order.EnvCode, order.ID)
		if countErr != nil {
			return releaseDispatchGuard{}, countErr
		}
		if aheadCount <= 0 {
			aheadCount = 1
		}
		guard.AheadCount = aheadCount
		guard.Message = fmt.Sprintf("当前应用在环境 %s 前面还有 %d 单，请等待先前执行单结束后再点击发布", firstNonEmpty(strings.TrimSpace(order.EnvCode), "-"), aheadCount)
		return guard, nil
	}

	if !settings.Enabled {
		return guard, nil
	}

	lockScope, lockKey, err := uc.buildExecutionLockIdentity(ctx, order, execution, params, settings)
	if err != nil {
		return releaseDispatchGuard{}, err
	}
	guard.LockScope = lockScope
	guard.LockKey = lockKey

	lock, err := uc.repo.FindActiveExecutionLock(ctx, lockKey, order.ID, uc.now())
	if err != nil && !errors.Is(err, domain.ErrExecutionLockNotFound) {
		return releaseDispatchGuard{}, err
	}
	if err == nil {
		guard.ConflictLock = &lock
		if uc.shouldQueueInConcurrentBatch(ctx, order, lock) {
			guard.WaitingForLock = true
			guard.Message = fmt.Sprintf("当前批次的同应用同环境发布单 %s 正在执行，已进入顺序等待队列", firstNonEmpty(lock.ReleaseOrderNo, lock.ReleaseOrderID))
			return guard, nil
		}
		if settings.ConflictStrategy == ReleaseConcurrencyConflictStrategyQueue {
			guard.WaitingForLock = true
			guard.Message = fmt.Sprintf("当前目标已被发布单 %s 占用，已进入排队等待", firstNonEmpty(lock.ReleaseOrderNo, lock.ReleaseOrderID))
			return guard, nil
		}
		guard.Message = fmt.Sprintf("当前目标已被发布单 %s 占用，请稍后再试", firstNonEmpty(lock.ReleaseOrderNo, lock.ReleaseOrderID))
	}
	return guard, nil
}

func (uc *ReleaseOrderManager) ensureExecutionLock(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
	params []domain.ReleaseOrderParam,
) (releaseDispatchGuard, bool, error) {
	guard, err := uc.evaluateDispatchGuard(ctx, order, execution, params)
	if err != nil {
		return releaseDispatchGuard{}, false, err
	}
	if guard.ConflictOrder != nil {
		if guard.WaitingForLock {
			return guard, false, nil
		}
		return guard, false, fmt.Errorf("%w: %s", ErrConcurrentReleaseBlocked, guard.Message)
	}
	if !guard.Settings.Enabled {
		return guard, true, nil
	}
	if guard.ConflictLock != nil {
		if guard.WaitingForLock {
			return guard, false, nil
		}
		if guard.Settings.ConflictStrategy == ReleaseConcurrencyConflictStrategyQueue {
			return guard, false, nil
		}
		return guard, false, fmt.Errorf("%w: %s", ErrConcurrentReleaseBlocked, guard.Message)
	}
	lock := domain.ReleaseExecutionLock{
		ID:             generateID("rlk"),
		LockScope:      guard.LockScope,
		LockKey:        guard.LockKey,
		ApplicationID:  order.ApplicationID,
		EnvCode:        order.EnvCode,
		ReleaseOrderID: order.ID,
		ReleaseOrderNo: order.OrderNo,
		Status:         domain.ExecutionLockStatusActive,
		OwnerType:      "release_order",
		CreatedAt:      uc.now(),
	}
	expiredAt := uc.now().Add(time.Duration(guard.Settings.LockTimeoutSec) * time.Second)
	lock.ExpiredAt = &expiredAt
	_, acquired, err := uc.repo.AcquireExecutionLock(ctx, lock, uc.now())
	if err != nil {
		return releaseDispatchGuard{}, false, err
	}
	if !acquired {
		if guard.WaitingForLock || guard.Settings.ConflictStrategy == ReleaseConcurrencyConflictStrategyQueue {
			return guard, false, nil
		}
		if guard.Settings.ConflictStrategy == ReleaseConcurrencyConflictStrategyQueue {
			guard.WaitingForLock = true
			return guard, false, nil
		}
		return releaseDispatchGuard{}, false, fmt.Errorf("%w: %s", ErrConcurrentReleaseBlocked, guard.Message)
	}
	return guard, true, nil
}

func (uc *ReleaseOrderManager) touchExecutionLocks(ctx context.Context, order domain.ReleaseOrder) error {
	settings, err := uc.loadReleaseConcurrencySettings(ctx)
	if err != nil || !settings.Enabled {
		return err
	}
	expires := uc.now().Add(time.Duration(settings.LockTimeoutSec) * time.Second)
	return uc.repo.TouchExecutionLocksByOrderID(ctx, order.ID, expires)
}

func (uc *ReleaseOrderManager) releaseExecutionLocks(ctx context.Context, orderID string, status domain.ExecutionLockStatus) error {
	if uc == nil || uc.repo == nil || strings.TrimSpace(orderID) == "" {
		return nil
	}
	return uc.repo.ReleaseExecutionLocksByOrderID(ctx, orderID, status, uc.now())
}

func (uc *ReleaseOrderManager) loadReleaseConcurrencySettings(ctx context.Context) (ReleaseConcurrencySettingsOutput, error) {
	if uc == nil || uc.releaseSettings == nil {
		return normalizeConcurrencySettings(ReleaseConcurrencySettingsOutput{}), nil
	}
	settings, err := uc.releaseSettings.LoadConcurrencySettings(ctx)
	if err != nil {
		return ReleaseConcurrencySettingsOutput{}, err
	}
	return normalizeConcurrencySettings(settings), nil
}

func (uc *ReleaseOrderManager) buildExecutionLockIdentity(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
	params []domain.ReleaseOrderParam,
	settings ReleaseConcurrencySettingsOutput,
) (domain.ExecutionLockScope, string, error) {
	scope := domain.ExecutionLockScope(settings.LockScope)
	switch settings.LockScope {
	case ReleaseConcurrencyLockScopeApplication:
		return scope, fmt.Sprintf("app:%s", strings.TrimSpace(order.ApplicationID)), nil
	case ReleaseConcurrencyLockScopeGitOpsRepoBranch:
		if isArgoCDExecution(execution) {
			if key, err := uc.buildGitOpsRepoBranchLockKey(ctx, order, execution, params); err == nil && strings.TrimSpace(key) != "" {
				return scope, key, nil
			}
		}
		fallthrough
	case ReleaseConcurrencyLockScopeApplicationEnv:
		return domain.ExecutionLockScopeApplicationEnv, fmt.Sprintf("app:%s:env:%s", strings.TrimSpace(order.ApplicationID), strings.TrimSpace(order.EnvCode)), nil
	default:
		return domain.ExecutionLockScopeApplicationEnv, fmt.Sprintf("app:%s:env:%s", strings.TrimSpace(order.ApplicationID), strings.TrimSpace(order.EnvCode)), nil
	}
}

func (uc *ReleaseOrderManager) buildGitOpsRepoBranchLockKey(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
	params []domain.ReleaseOrderParam,
) (string, error) {
	snapshot, err := uc.repo.GetDeploySnapshotByOrderID(ctx, order.ID)
	if err == nil && strings.TrimSpace(snapshot.RepoURL) != "" {
		branch := uc.resolveGitOpsBranchByEnv(firstNonEmpty(strings.TrimSpace(snapshot.EnvCode), strings.TrimSpace(order.EnvCode)), argocddomain.Instance{}, strings.TrimSpace(snapshot.Branch))
		return fmt.Sprintf("repo:%s:branch:%s", strings.TrimSpace(snapshot.RepoURL), branch), nil
	}
	if err != nil && !errors.Is(err, domain.ErrDeploySnapshotNotFound) {
		return "", err
	}
	template, _, _, _, _, err := uc.repo.GetTemplateByID(ctx, strings.TrimSpace(order.TemplateID))
	if err != nil {
		return "", err
	}
	binding, argocdInstance, client, err := uc.resolveArgoCDExecutionContext(ctx, order, execution, params)
	if err != nil {
		return "", err
	}
	environment := uc.resolveArgoCDEnvironment(order, params)
	appName, app, err := resolveArgoCDApplicationByRef(ctx, client, binding.ExternalRef, environment, normalizeTemplateGitOpsType(template.GitOpsType, true))
	_ = appName
	if err != nil {
		return "", err
	}
	repoURL := strings.TrimSpace(app.GetRepoURL())
	branch := uc.resolveGitOpsTargetBranch(ctx, order, params, argocdInstance, app)
	if repoURL == "" {
		return "", fmt.Errorf("argocd application repo url is empty")
	}
	return fmt.Sprintf("repo:%s:branch:%s", repoURL, branch), nil
}
