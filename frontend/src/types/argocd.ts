export type ArgoCDRecordStatus = 'active' | 'inactive'

export interface ArgoCDApplication {
  id: string
  argocd_instance_id: string
  instance_code: string
  instance_name: string
  cluster_name: string
  instance_base_url: string
  app_name: string
  project: string
  repo_url: string
  source_path: string
  target_revision: string
  dest_server: string
  dest_namespace: string
  sync_status: string
  health_status: string
  operation_phase: string
  argocd_url: string
  status: ArgoCDRecordStatus
  raw_meta: string
  last_synced_at: string
  created_at: string
  updated_at: string
}

export interface ArgoCDApplicationListParams {
  argocd_instance_id?: string
  app_name?: string
  project?: string
  sync_status?: string
  health_status?: string
  status?: ArgoCDRecordStatus
  page?: number
  page_size?: number
}

export interface ArgoCDApplicationListResponse {
  data: ArgoCDApplication[]
  page: number
  page_size: number
  total: number
}

export interface ArgoCDApplicationDataResponse {
  data: ArgoCDApplication
}

export interface ArgoCDSyncResult {
  total: number
  created: number
  updated: number
  inactivated: number
}

export interface ArgoCDSyncResponse {
  data: ArgoCDSyncResult
}

export interface ArgoCDOriginalLinkData {
  application: ArgoCDApplication
  original_link: string
}

export interface ArgoCDOriginalLinkDataResponse {
  data: ArgoCDOriginalLinkData
}

export interface ArgoCDInstance {
  id: string
  instance_code: string
  name: string
  base_url: string
  insecure_skip_verify: boolean
  auth_mode: string
  username: string
  gitops_instance_id: string
  gitops_instance_code: string
  gitops_instance_name: string
  cluster_name: string
  default_namespace: string
  status: ArgoCDRecordStatus
  health_status: string
  last_check_at: string
  created_at: string
  updated_at: string
  remark: string
}

export interface ArgoCDInstanceListParams {
  keyword?: string
  status?: ArgoCDRecordStatus
  page?: number
  page_size?: number
}

export interface ArgoCDInstanceListResponse {
  data: ArgoCDInstance[]
  page: number
  page_size: number
  total: number
}

export interface ArgoCDInstanceDataResponse {
  data: ArgoCDInstance
}

export interface UpsertArgoCDInstancePayload {
  instance_code: string
  name: string
  base_url: string
  insecure_skip_verify: boolean
  auth_mode: string
  token?: string
  username?: string
  password?: string
  gitops_instance_id?: string
  cluster_name?: string
  default_namespace?: string
  status?: ArgoCDRecordStatus
  remark?: string
}

export interface ArgoCDEnvBinding {
  id: string
  env_code: string
  argocd_instance_id: string
  argocd_instance_code: string
  argocd_instance_name: string
  cluster_name: string
  priority: number
  status: ArgoCDRecordStatus
  created_at: string
  updated_at: string
}

export interface ArgoCDEnvBindingListResponse {
  data: ArgoCDEnvBinding[]
}

export interface UpdateArgoCDEnvBindingsPayload {
  bindings: Array<{
    env_code: string
    argocd_instance_id: string
    status?: ArgoCDRecordStatus
  }>
}
