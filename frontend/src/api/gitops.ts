import { http } from './http'
import type { GitOpsStatus } from '../types/gitops'

export async function getGitOpsStatus() {
  const response = await http.get<{ data: GitOpsStatus }>('/gitops/status')
  return response.data
}
