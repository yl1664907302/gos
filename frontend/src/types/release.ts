export type ReleaseTriggerType = 'manual' | 'webhook' | 'schedule'
export type ReleaseOrderStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled'
export type ReleaseStepStatus = 'pending' | 'running' | 'success' | 'failed'
export type ReleasePipelineStageStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'skipped'
export type ReleaseOrderValueProgressStatus = 'pending' | 'running' | 'resolved' | 'failed' | 'skipped'
export type ReleaseValueSource = 'application' | 'environment' | 'release_input' | 'fixed'
export type ReleaseTemplateStatus = 'active' | 'inactive'
export type ReleasePipelineScope = 'ci' | 'cd'
export type ReleaseExecutionStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'skipped'

export interface ReleaseOrder {
  id: string
  order_no: string
  previous_order_no: string
  application_id: string
  application_name: string
  template_id: string
  template_name: string
  binding_id: string
  pipeline_id: string
  env_code: string
  project_name: string
  son_service: string
  git_ref: string
  image_tag: string
  trigger_type: ReleaseTriggerType
  status: ReleaseOrderStatus
  remark: string
  creator_user_id?: string
  triggered_by: string
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export interface ReleaseOrderParam {
  id: string
  release_order_id: string
  pipeline_scope: ReleasePipelineScope
  binding_id: string
  param_key: string
  executor_param_name: string
  param_value: string
  value_source: ReleaseValueSource
  created_at: string
}

export interface ReleaseOrderValueProgress {
  pipeline_scope: ReleasePipelineScope
  param_key: string
  param_name: string
  executor_param_name: string
  required: boolean
  status: ReleaseOrderValueProgressStatus
  value: string
  value_source: string
  message: string
  updated_at: string | null
  sort_no: number
}

export interface ReleaseOrderStep {
  id: string
  release_order_id: string
  step_scope: 'global' | ReleasePipelineScope
  execution_id: string
  step_code: string
  step_name: string
  status: ReleaseStepStatus
  message: string
  sort_no: number
  started_at: string | null
  finished_at: string | null
  created_at: string
}

export interface ReleaseOrderExecution {
  id: string
  release_order_id: string
  pipeline_scope: ReleasePipelineScope
  binding_id: string
  binding_name: string
  provider: string
  pipeline_id: string
  status: ReleaseExecutionStatus
  queue_url: string
  build_url: string
  external_run_id: string
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export interface ReleaseOrderPipelineStage {
  id: string
  release_order_id: string
  pipeline_scope: string
  executor_type: string
  stage_name: string
  status: ReleasePipelineStageStatus
  raw_status: string
  sort_no: number
  duration_millis: number
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export interface ReleaseOrderListParams {
  application_id?: string
  binding_id?: string
  env_code?: string
  status?: ReleaseOrderStatus
  trigger_type?: ReleaseTriggerType
  page?: number
  page_size?: number
}

export interface ReleaseOrderListResponse {
  data: ReleaseOrder[]
  page: number
  page_size: number
  total: number
}

export interface ReleaseOrderDataResponse {
  data: ReleaseOrder
}

export interface ReleaseOrderParamListResponse {
  data: ReleaseOrderParam[]
}

export interface ReleaseOrderValueProgressListResponse {
  data: ReleaseOrderValueProgress[]
}

export interface ReleaseOrderExecutionListResponse {
  data: ReleaseOrderExecution[]
}

export interface ReleaseOrderStepListResponse {
  data: ReleaseOrderStep[]
}

export interface ReleaseOrderPipelineStageListResponse {
  show_module: boolean
  executor_type: string
  message?: string
  data: ReleaseOrderPipelineStage[]
}

export interface ReleaseOrderPipelineStageLogResponse {
  data: {
    stage: ReleaseOrderPipelineStage
    content: string
    has_more: boolean
    raw_status: string
    fetched_at: string
  }
}

export interface ReleaseOrderLogStreamEvent {
  type: 'status' | 'log' | 'done' | 'error' | string
  timestamp: string
  message?: string
  content?: string
  queue_url?: string
  build_url?: string
  offset?: number
  more_data?: boolean
  result?: string
  order_status?: string
}

export interface CreateReleaseOrderParamPayload {
  pipeline_scope: ReleasePipelineScope
  param_key: string
  executor_param_name: string
  param_value: string
  value_source?: ReleaseValueSource
}

export interface CreateReleaseOrderStepPayload {
  step_code: string
  step_name?: string
  sort_no?: number
}

export interface CreateReleaseOrderPayload {
  application_id: string
  template_id: string
  env_code?: string
  project_name?: string
  son_service?: string
  git_ref?: string
  image_tag?: string
  trigger_type?: ReleaseTriggerType
  remark?: string
  triggered_by?: string
  params?: CreateReleaseOrderParamPayload[]
  steps?: CreateReleaseOrderStepPayload[]
}

export interface ReleaseTemplate {
  id: string
  name: string
  application_id: string
  application_name: string
  binding_id: string
  binding_name: string
  binding_type: string
  gitops_type: ReleaseTemplateGitOpsType
  status: ReleaseTemplateStatus
  remark: string
  param_count: number
  created_at: string
  updated_at: string
}

export interface ReleaseTemplateBinding {
  id: string
  template_id: string
  pipeline_scope: ReleasePipelineScope
  binding_id: string
  binding_name: string
  provider: string
  pipeline_id: string
  enabled: boolean
  sort_no: number
  created_at: string
  updated_at: string
}

export interface ReleaseTemplateParam {
  id: string
  template_id: string
  template_binding_id: string
  pipeline_scope: ReleasePipelineScope
  binding_id: string
  executor_param_def_id: string
  param_key: string
  param_name: string
  executor_param_name: string
  required: boolean
  sort_no: number
  created_at: string
  updated_at: string
}

export type ReleaseTemplateGitOpsRuleSourceFrom = 'ci' | 'builtin'
export type ReleaseTemplateGitOpsType = '' | 'kustomize' | 'helm'

export interface ReleaseTemplateGitOpsRule {
  id: string
  template_id: string
  pipeline_scope: ReleasePipelineScope
  source_param_key: string
  source_param_name: string
  source_from: ReleaseTemplateGitOpsRuleSourceFrom
  locator_param_key: string
  locator_param_name: string
  file_path_template: string
  document_kind: string
  document_name: string
  target_path: string
  value_template: string
  sort_no: number
  created_at: string
  updated_at: string
}

export interface ReleaseTemplateGitOpsRulePayload {
  source_param_key: string
  source_from: ReleaseTemplateGitOpsRuleSourceFrom
  locator_param_key?: string
  file_path_template: string
  document_kind: string
  document_name?: string
  target_path: string
  value_template?: string
}

export interface ReleaseTemplateListParams {
  application_id?: string
  binding_id?: string
  status?: ReleaseTemplateStatus
  page?: number
  page_size?: number
}

export interface ReleaseTemplateListResponse {
  data: ReleaseTemplate[]
  page: number
  page_size: number
  total: number
}

export interface ReleaseTemplateDataResponse {
  data: {
    template: ReleaseTemplate
    bindings: ReleaseTemplateBinding[]
    params: ReleaseTemplateParam[]
    gitops_rules: ReleaseTemplateGitOpsRule[]
  }
}

export interface ReleaseTemplatePayload {
  name: string
  application_id: string
  ci_binding_id?: string
  cd_binding_id?: string
  cd_provider?: string
  gitops_type?: ReleaseTemplateGitOpsType
  status: ReleaseTemplateStatus
  remark?: string
  ci_param_def_ids: string[]
  cd_param_def_ids: string[]
  gitops_rules?: ReleaseTemplateGitOpsRulePayload[]
}

export interface UpdateReleaseTemplatePayload {
  name: string
  ci_binding_id?: string
  cd_binding_id?: string
  cd_provider?: string
  gitops_type?: ReleaseTemplateGitOpsType
  status: ReleaseTemplateStatus
  remark?: string
  ci_param_def_ids: string[]
  cd_param_def_ids: string[]
  gitops_rules?: ReleaseTemplateGitOpsRulePayload[]
}
