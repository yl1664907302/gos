import { http } from './http'
import type { ProjectDataResponse, ProjectListParams, ProjectListResponse, ProjectPayload } from '../types/project'

export async function listProjects(params: ProjectListParams): Promise<ProjectListResponse> {
  const response = await http.get<ProjectListResponse>('/projects', { params })
  return response.data
}

export async function getProjectByID(id: string): Promise<ProjectDataResponse> {
  const response = await http.get<ProjectDataResponse>(`/projects/${id}`)
  return response.data
}

export async function createProject(payload: ProjectPayload): Promise<ProjectDataResponse> {
  const response = await http.post<ProjectDataResponse>('/projects', payload)
  return response.data
}

export async function updateProject(id: string, payload: ProjectPayload): Promise<ProjectDataResponse> {
  const response = await http.put<ProjectDataResponse>(`/projects/${id}`, payload)
  return response.data
}

export async function deleteProject(id: string): Promise<void> {
  await http.delete(`/projects/${id}`)
}
