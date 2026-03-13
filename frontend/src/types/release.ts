export type ReleaseTriggerType = 'manual' | 'webhook' | 'schedule'
export type ReleaseOrderStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled'
export type ReleaseStepStatus = 'pending' | 'running' | 'success' | 'failed'
export type ReleaseValueSource = 'application' | 'environment' | 'release_input' | 'fixed'

export interface ReleaseOrder {
  id: string
  order_no: string
  application_id: string
  application_name: string
  binding_id: string
  pipeline_id: string
  env_code: string
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
  env_code: string
  git_ref?: string
  image_tag?: string
  trigger_type?: ReleaseTriggerType
  remark?: string
  triggered_by?: string
  params?: CreateReleaseOrderParamPayload[]
  steps?: CreateReleaseOrderStepPayload[]
}
