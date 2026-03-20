import { http } from './http'
import type {
  GitOpsFieldCandidate,
  GitOpsInstanceDataResponse,
  GitOpsInstanceListParams,
  GitOpsInstanceListResponse,
  GitOpsInstanceStatusDataResponse,
  GitOpsStatus,
  GitOpsTemplateField,
  GitOpsValuesCandidate,
  UpsertGitOpsInstancePayload,
} from '../types/gitops'

export async function getGitOpsStatus() {
  const response = await http.get<{ data: GitOpsStatus }>('/gitops/status')
  return response.data
}

export async function listGitOpsInstances(
  params: GitOpsInstanceListParams = {},
): Promise<GitOpsInstanceListResponse> {
  const response = await http.get<GitOpsInstanceListResponse>('/gitops/instances', { params })
  return response.data
}

export async function createGitOpsInstance(
  payload: UpsertGitOpsInstancePayload,
): Promise<GitOpsInstanceDataResponse> {
  const response = await http.post<GitOpsInstanceDataResponse>('/gitops/instances', payload)
  return response.data
}

export async function updateGitOpsInstance(
  id: string,
  payload: UpsertGitOpsInstancePayload,
): Promise<GitOpsInstanceDataResponse> {
  const response = await http.put<GitOpsInstanceDataResponse>(`/gitops/instances/${id}`, payload)
  return response.data
}

export async function getGitOpsInstanceStatus(id: string): Promise<GitOpsInstanceStatusDataResponse> {
  const response = await http.get<GitOpsInstanceStatusDataResponse>(`/gitops/instances/${id}/status`)
  return response.data
}

export async function listGitOpsTemplateFields() {
  const response = await http.get<{ data: GitOpsTemplateField[] }>('/gitops/template-fields')
  return response.data
}

export async function listGitOpsFieldCandidates(applicationID: string) {
  const response = await http.get<{ data: GitOpsFieldCandidate[] }>('/gitops/field-candidates', {
    params: { application_id: applicationID },
  })
  return response.data
}

export async function listGitOpsValuesCandidates(applicationID: string) {
  const response = await http.get<{ data: GitOpsValuesCandidate[] }>('/gitops/values-candidates', {
    params: { application_id: applicationID },
  })
  return response.data
}
