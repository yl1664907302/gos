export type ProjectStatus = 'active' | 'inactive'

export interface Project {
  id: string
  name: string
  key: string
  description: string
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface ProjectPayload {
  name: string
  key: string
  description: string
  status: ProjectStatus
}

export interface ProjectListParams {
  key?: string
  name?: string
  status?: ProjectStatus
  page?: number
  page_size?: number
}

export interface ProjectDataResponse {
  data: Project
}

export interface ProjectListResponse {
  data: Project[]
  page: number
  page_size: number
  total: number
}
