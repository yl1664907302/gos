import { http } from './http'
import type {
  ApplicationDataResponse,
  ApplicationListParams,
  ApplicationListResponse,
  ApplicationOptionListResponse,
  ApplicationPayload,
} from '../types/application'

export async function listApplications(params: ApplicationListParams): Promise<ApplicationListResponse> {
  const response = await http.get<ApplicationListResponse>('/applications', { params })
  return response.data
}

export async function getApplicationByID(id: string): Promise<ApplicationDataResponse> {
  const response = await http.get<ApplicationDataResponse>(`/applications/${id}`)
  return response.data
}

export async function listApplicationOptions(): Promise<ApplicationOptionListResponse> {
  const response = await http.get<ApplicationOptionListResponse>('/applications/options')
  return response.data
}

export async function createApplication(payload: ApplicationPayload): Promise<ApplicationDataResponse> {
  const response = await http.post<ApplicationDataResponse>('/applications', payload)
  return response.data
}

export async function updateApplication(id: string, payload: ApplicationPayload): Promise<ApplicationDataResponse> {
  const response = await http.put<ApplicationDataResponse>(`/applications/${id}`, payload)
  return response.data
}

export async function deleteApplication(id: string): Promise<void> {
  await http.delete(`/applications/${id}`)
}
