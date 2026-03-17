export type ArgoCDRecordStatus = 'active' | 'inactive'

export interface ArgoCDApplication {
  id: string
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
