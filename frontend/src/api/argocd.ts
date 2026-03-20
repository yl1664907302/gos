import { http } from './http'
import type {
  ArgoCDApplicationDataResponse,
  ArgoCDApplicationListParams,
  ArgoCDApplicationListResponse,
  ArgoCDEnvBindingListResponse,
  ArgoCDInstanceDataResponse,
  ArgoCDInstanceListParams,
  ArgoCDInstanceListResponse,
  ArgoCDOriginalLinkDataResponse,
  ArgoCDSyncResponse,
  UpdateArgoCDEnvBindingsPayload,
  UpsertArgoCDInstancePayload,
} from '../types/argocd'

export async function listArgoCDApplications(
  params: ArgoCDApplicationListParams,
): Promise<ArgoCDApplicationListResponse> {
  const response = await http.get<ArgoCDApplicationListResponse>('/argocd/applications', { params })
  return response.data
}

export async function getArgoCDApplicationByID(id: string): Promise<ArgoCDApplicationDataResponse> {
  const response = await http.get<ArgoCDApplicationDataResponse>(`/argocd/applications/${id}`)
  return response.data
}

export async function syncArgoCDApplications(): Promise<ArgoCDSyncResponse> {
  const response = await http.post<ArgoCDSyncResponse>('/argocd/applications/sync', undefined, {
    timeout: 120_000,
  })
  return response.data
}

export async function getArgoCDApplicationOriginalLink(id: string): Promise<ArgoCDOriginalLinkDataResponse> {
  const response = await http.get<ArgoCDOriginalLinkDataResponse>(`/argocd/applications/${id}/original-link`)
  return response.data
}

export async function listArgoCDInstances(
  params: ArgoCDInstanceListParams = {},
): Promise<ArgoCDInstanceListResponse> {
  const response = await http.get<ArgoCDInstanceListResponse>('/argocd/instances', { params })
  return response.data
}

export async function createArgoCDInstance(
  payload: UpsertArgoCDInstancePayload,
): Promise<ArgoCDInstanceDataResponse> {
  const response = await http.post<ArgoCDInstanceDataResponse>('/argocd/instances', payload)
  return response.data
}

export async function updateArgoCDInstance(
  id: string,
  payload: UpsertArgoCDInstancePayload,
): Promise<ArgoCDInstanceDataResponse> {
  const response = await http.put<ArgoCDInstanceDataResponse>(`/argocd/instances/${id}`, payload)
  return response.data
}

export async function checkArgoCDInstance(id: string): Promise<ArgoCDInstanceDataResponse> {
  const response = await http.post<ArgoCDInstanceDataResponse>(`/argocd/instances/${id}/check`)
  return response.data
}

export async function listArgoCDEnvBindings(): Promise<ArgoCDEnvBindingListResponse> {
  const response = await http.get<ArgoCDEnvBindingListResponse>('/argocd/env-bindings')
  return response.data
}

export async function updateArgoCDEnvBindings(
  payload: UpdateArgoCDEnvBindingsPayload,
): Promise<ArgoCDEnvBindingListResponse> {
  const response = await http.put<ArgoCDEnvBindingListResponse>('/argocd/env-bindings', payload)
  return response.data
}
