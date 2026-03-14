export type ReleaseTriggerType = 'manual' | 'webhook' | 'schedule'
export type ReleaseOrderStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled'
export type ReleaseStepStatus = 'pending' | 'running' | 'success' | 'failed'
export type ReleaseValueSource = 'application' | 'environment' | 'release_input' | 'fixed'
export type ReleaseTemplateStatus = 'active' | 'inactive'

export interface ReleaseOrder {
  id: string
  order_no: string
  application_id: string
  application_name: string
  binding_id: string
  pipeline_id: string
  env_code: string
  template_id?: string
  project_name: string
  son_service: string
  git_ref: string
  image_tag: string
  trigger_type: ReleaseTriggerType
  status: ReleaseOrderStatus
  remark: string
  triggered_by: string
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export interface ReleaseOrderParam {
  id: string
  release_order_id: string
  param_key: string
  executor_param_name: string
  param_value: string
  value_source: ReleaseValueSource
  created_at: string
}

export interface ReleaseOrderStep {
  id: string
  release_order_id: string
  step_code: string
  step_name: string
  status: ReleaseStepStatus
  message: string
  sort_no: number
  started_at: string | null
  finished_at: string | null
  created_at: string
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

export interface ReleaseOrderStepListResponse {
  data: ReleaseOrderStep[]
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
  binding_id: string
  template_id?: string
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
  status: ReleaseTemplateStatus
  remark: string
  param_count: number
  created_at: string
  updated_at: string
}

export interface ReleaseTemplateParam {
  id: string
  template_id: string
  pipeline_param_def_id: string
  param_key: string
  param_name: string
  executor_param_name: string
  required: boolean
  sort_no: number
  created_at: string
  updated_at: string
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
    params: ReleaseTemplateParam[]
  }
}

export interface ReleaseTemplatePayload {
  name: string
  application_id: string
  binding_id: string
  status: ReleaseTemplateStatus
  remark?: string
  param_def_ids: string[]
}

export interface UpdateReleaseTemplatePayload {
  name: string
  status: ReleaseTemplateStatus
  remark?: string
  param_def_ids: string[]
}
