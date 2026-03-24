import { apiBaseURL, http } from './http'
import type {
  CreateReleaseOrderPayload,
  ReleaseOrderDataResponse,
  ReleaseOrderExecutionListResponse,
  ReleaseOrderListParams,
  ReleaseOrderPipelineStageListResponse,
  ReleaseOrderPipelineStageLogResponse,
  ReleaseOrderListResponse,
  ReleaseOrderParamListResponse,
  ReleaseOrderValueProgressListResponse,
  ReleaseOrderStepListResponse,
  ReleaseTemplate,
  ReleaseTemplateDataResponse,
  ReleaseTemplateListParams,
  ReleaseTemplateListResponse,
  ReleaseTemplatePayload,
  UpdateReleaseTemplatePayload,
} from '../types/release'

export async function listReleaseOrders(params: ReleaseOrderListParams): Promise<ReleaseOrderListResponse> {
  const response = await http.get<ReleaseOrderListResponse>('/release-orders', { params })
  return response.data
}

export async function createReleaseOrder(payload: CreateReleaseOrderPayload): Promise<ReleaseOrderDataResponse> {
  const response = await http.post<ReleaseOrderDataResponse>('/release-orders', payload)
  return response.data
}

export async function rollbackReleaseOrderByID(id: string): Promise<ReleaseOrderDataResponse> {
  const response = await http.post<ReleaseOrderDataResponse>(`/release-orders/${encodeURIComponent(String(id || '').trim())}/rollback`)
  return response.data
}

export async function replayReleaseOrderByID(id: string): Promise<ReleaseOrderDataResponse> {
  const response = await http.post<ReleaseOrderDataResponse>(`/release-orders/${encodeURIComponent(String(id || '').trim())}/replay`)
  return response.data
}

export async function getReleaseOrderByID(id: string): Promise<ReleaseOrderDataResponse> {
  const response = await http.get<ReleaseOrderDataResponse>(`/release-orders/${id}`)
  return response.data
}

export async function cancelReleaseOrder(id: string): Promise<ReleaseOrderDataResponse> {
  const response = await http.post<ReleaseOrderDataResponse>(`/release-orders/${id}/cancel`)
  return response.data
}

export async function executeReleaseOrder(id: string): Promise<ReleaseOrderDataResponse> {
  const response = await http.post<ReleaseOrderDataResponse>(`/release-orders/${id}/execute`)
  return response.data
}

export async function listReleaseOrderParams(id: string): Promise<ReleaseOrderParamListResponse> {
  const response = await http.get<ReleaseOrderParamListResponse>(`/release-orders/${id}/params`)
  return response.data
}

export async function listReleaseOrderValueProgress(id: string): Promise<ReleaseOrderValueProgressListResponse> {
  const response = await http.get<ReleaseOrderValueProgressListResponse>(`/release-orders/${id}/value-progress`)
  return response.data
}

export async function listReleaseOrderExecutions(id: string): Promise<ReleaseOrderExecutionListResponse> {
  const response = await http.get<ReleaseOrderExecutionListResponse>(`/release-orders/${id}/executions`)
  return response.data
}

export async function listReleaseOrderSteps(id: string): Promise<ReleaseOrderStepListResponse> {
  const response = await http.get<ReleaseOrderStepListResponse>(`/release-orders/${id}/steps`)
  return response.data
}

export async function listReleaseOrderPipelineStages(
  id: string,
  scope?: string,
): Promise<ReleaseOrderPipelineStageListResponse> {
  const response = await http.get<ReleaseOrderPipelineStageListResponse>(`/release-orders/${id}/pipeline-stages`, {
    params: scope ? { scope } : undefined,
  })
  return response.data
}

export async function getReleaseOrderPipelineStageLog(
  releaseOrderID: string,
  stageID: string,
): Promise<ReleaseOrderPipelineStageLogResponse> {
  const response = await http.get<ReleaseOrderPipelineStageLogResponse>(
    `/release-orders/${releaseOrderID}/pipeline-stages/${stageID}/log`,
  )
  return response.data
}

export async function listReleaseTemplates(params: ReleaseTemplateListParams): Promise<ReleaseTemplateListResponse> {
  const response = await http.get<ReleaseTemplateListResponse>('/release-templates', { params })
  return response.data
}

export async function listAllReleaseTemplates(
  params: Omit<ReleaseTemplateListParams, 'page' | 'page_size'>,
  pageSize = 200,
): Promise<ReleaseTemplate[]> {
  const items: ReleaseTemplate[] = []
  let page = 1
  let total = 0

  do {
    const response = await listReleaseTemplates({
      ...params,
      page,
      page_size: pageSize,
    })
    items.push(...response.data)
    total = response.total
    if (response.data.length === 0) {
      break
    }
    page += 1
  } while (items.length < total && page <= 50)

  return items
}

export async function getReleaseTemplateByID(id: string): Promise<ReleaseTemplateDataResponse> {
  const response = await http.get<ReleaseTemplateDataResponse>(`/release-templates/${id}`)
  return response.data
}

export async function createReleaseTemplate(payload: ReleaseTemplatePayload): Promise<ReleaseTemplateDataResponse> {
  const response = await http.post<ReleaseTemplateDataResponse>('/release-templates', payload)
  return response.data
}

export async function updateReleaseTemplate(
  id: string,
  payload: UpdateReleaseTemplatePayload,
): Promise<ReleaseTemplateDataResponse> {
  const response = await http.put<ReleaseTemplateDataResponse>(`/release-templates/${id}`, payload)
  return response.data
}

export async function deleteReleaseTemplate(id: string): Promise<void> {
  await http.delete(`/release-templates/${id}`)
}

export function buildReleaseOrderLogStreamURL(id: string, start = 0, accessToken = '', scope = ''): string {
  const base = apiBaseURL.replace(/\/+$/, '')
  const orderID = encodeURIComponent(String(id || '').trim())
  const offset = Number.isFinite(start) && start > 0 ? Math.floor(start) : 0
  const token = String(accessToken || '').trim()
  const scopeParam = String(scope || '').trim()
  const params = [`start=${offset}`]
  if (scopeParam) {
    params.push(`scope=${encodeURIComponent(scopeParam)}`)
  }
  if (!token) {
    return `${base}/release-orders/${orderID}/logs/stream?${params.join('&')}`
  }
  params.push(`access_token=${encodeURIComponent(token)}`)
  return `${base}/release-orders/${orderID}/logs/stream?${params.join('&')}`
}
