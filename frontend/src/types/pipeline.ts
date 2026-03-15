export type PipelineStatus = 'active' | 'inactive'
export type PipelineProvider = 'jenkins' | 'argocd'
export type BindingType = 'ci' | 'cd'
export type TriggerMode = 'manual' | 'webhook'
export type ExecutorType = 'jenkins' | 'argocd' | 'custom'
export type PipelineParamStatus = 'active' | 'inactive'

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

export interface PipelineSyncResult {
  total: number
  created: number
  updated: number
  inactivated: number
  skipped: number
}

export interface PipelineSyncResponse {
  data: PipelineSyncResult
}

export interface PipelineDataResponse {
  data: Pipeline
}

export interface PipelineRawScriptData {
  pipeline: Pipeline
  definition_class: string
  description: string
  script: string
  script_path: string
  sandbox: boolean
  from_scm: boolean
}

export interface PipelineRawScriptDataResponse {
  data: PipelineRawScriptData
}

export interface PipelineConfigXMLData {
  pipeline?: Pipeline
  config_xml: string
}

export interface PipelineConfigXMLDataResponse {
  data: PipelineConfigXMLData
}

export interface PipelineOriginalLinkData {
  pipeline: Pipeline
  original_link: string
}

export interface PipelineOriginalLinkDataResponse {
  data: PipelineOriginalLinkData
}

export interface CreateJenkinsRawPipelinePayload {
  full_name: string
  description?: string
  script: string
  sandbox?: boolean
}

export interface UpdateJenkinsRawPipelinePayload {
  full_name?: string
  description?: string
  script: string
  sandbox?: boolean
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

export interface PipelineParamDef {
  id: string
  pipeline_id: string
  executor_type: ExecutorType
  executor_param_name: string
  param_key: string
  param_type: 'string' | 'choice' | 'bool' | 'number'
  single_select: boolean
  required: boolean
  default_value: string
  description: string
  visible: boolean
  editable: boolean
  source_from: string
  status: PipelineParamStatus
  raw_meta: string
  sort_no: number
  can_view: boolean
  can_edit: boolean
  created_at: string
  updated_at: string
}

export interface ApplicationPipelineParamListParams {
  binding_type?: BindingType
  visible?: boolean
  editable?: boolean
  param_key?: string
  status?: PipelineParamStatus
  page?: number
  page_size?: number
}

export interface PipelineParamDefListResponse {
  data: PipelineParamDef[]
  page: number
  page_size: number
  total: number
}

export interface PipelineParamDefDataResponse {
  data: PipelineParamDef
}

export interface UpdatePipelineParamDefPayload {
  param_key: string
}
