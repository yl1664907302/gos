import { http } from './http'
import type { GitOpsFieldCandidate, GitOpsStatus, GitOpsTemplateField, GitOpsValuesCandidate } from '../types/gitops'

export async function getGitOpsStatus() {
  const response = await http.get<{ data: GitOpsStatus }>('/gitops/status')
  return response.data
}

export async function updateGitOpsCommitMessageTemplate(template: string) {
  const response = await http.put<{ data: GitOpsStatus }>('/gitops/settings/commit-message-template', {
    template,
  })
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
