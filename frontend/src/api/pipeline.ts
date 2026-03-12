import { http } from './http'
import type {
  CreatePipelineBindingPayload,
  PipelineBindingDataResponse,
  PipelineBindingListParams,
  PipelineBindingListResponse,
  PipelineListParams,
  PipelineListResponse,
  UpdatePipelineBindingPayload,
} from '../types/pipeline'

export async function listPipelines(params: PipelineListParams): Promise<PipelineListResponse> {
  const response = await http.get<PipelineListResponse>('/pipelines', { params })
  return response.data
}

export async function listPipelineBindings(
  applicationID: string,
  params: PipelineBindingListParams,
): Promise<PipelineBindingListResponse> {
  const response = await http.get<PipelineBindingListResponse>(
    `/applications/${applicationID}/pipeline-bindings`,
    { params },
  )
  return response.data
}

export async function getPipelineBindingByID(id: string): Promise<PipelineBindingDataResponse> {
  const response = await http.get<PipelineBindingDataResponse>(`/pipeline-bindings/${id}`)
  return response.data
}

export async function createPipelineBinding(
  applicationID: string,
  payload: CreatePipelineBindingPayload,
): Promise<PipelineBindingDataResponse> {
  const response = await http.post<PipelineBindingDataResponse>(
    `/applications/${applicationID}/pipeline-bindings`,
    payload,
  )
  return response.data
}

export async function updatePipelineBinding(
  id: string,
  payload: UpdatePipelineBindingPayload,
): Promise<PipelineBindingDataResponse> {
  const response = await http.put<PipelineBindingDataResponse>(`/pipeline-bindings/${id}`, payload)
  return response.data
}

export async function deletePipelineBinding(id: string): Promise<void> {
  await http.delete(`/pipeline-bindings/${id}`)
}
