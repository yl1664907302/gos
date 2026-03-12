export type ApplicationStatus = 'active' | 'inactive'

export interface Application {
  id: string
  name: string
  key: string
  repo_url: string
  description: string
  owner: string
  status: ApplicationStatus
  artifact_type: string
  language: string
  created_at: string
  updated_at: string
}

export interface ApplicationPayload {
  name: string
  key: string
  repo_url: string
  description: string
  owner: string
  status: ApplicationStatus
  artifact_type: string
  language: string
}

export interface ApplicationListParams {
  key?: string
  name?: string
  status?: ApplicationStatus
  page?: number
  page_size?: number
}

export interface ApplicationDataResponse {
  data: Application
}

export interface ApplicationListResponse {
  data: Application[]
  page: number
  page_size: number
  total: number
}

export interface ErrorResponse {
  error: string
}
