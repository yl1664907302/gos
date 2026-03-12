export type PipelineStatus = 'active' | 'inactive'
export type PipelineProvider = 'jenkins' | 'argocd'
export type BindingType = 'ci' | 'cd'
export type TriggerMode = 'manual' | 'webhook'

export interface Pipeline {
  id: string
  provider: PipelineProvider
  job_full_name: string
  job_name: string
  job_url: string
  description: string
  credential_ref: string
  default_branch: string
  status: PipelineStatus
  last_verified_at: string | null
  last_synced_at: string
  created_at: string
  updated_at: string
}

export interface PipelineListParams {
  name?: string
  provider?: PipelineProvider
  status?: PipelineStatus
  page?: number
  page_size?: number
}

export interface PipelineListResponse {
  data: Pipeline[]
  page: number
  page_size: number
  total: number
}

export interface PipelineBinding {
  id: string
  name: string
  application_id: string
  application_name: string
  binding_type: BindingType
  provider: PipelineProvider
  pipeline_id: string
  external_ref: string
  trigger_mode: TriggerMode
  status: PipelineStatus
  created_at: string
  updated_at: string
}

export interface PipelineBindingListParams {
  binding_type?: BindingType
  provider?: PipelineProvider
  status?: PipelineStatus
  page?: number
  page_size?: number
}

export interface PipelineBindingListResponse {
  data: PipelineBinding[]
  page: number
  page_size: number
  total: number
}

export interface PipelineBindingDataResponse {
  data: PipelineBinding
}

export interface CreatePipelineBindingPayload {
  binding_type: BindingType
  name?: string
  provider?: PipelineProvider
  pipeline_id?: string
  external_ref?: string
  trigger_mode: TriggerMode
  status: PipelineStatus
}

export interface UpdatePipelineBindingPayload {
  name?: string
  provider?: PipelineProvider
  pipeline_id?: string
  external_ref?: string
  trigger_mode?: TriggerMode
  status?: PipelineStatus
}
