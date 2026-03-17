import { http } from './http'
import type {
  ArgoCDApplicationDataResponse,
  ArgoCDApplicationListParams,
  ArgoCDApplicationListResponse,
  ArgoCDOriginalLinkDataResponse,
  ArgoCDSyncResponse,
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
