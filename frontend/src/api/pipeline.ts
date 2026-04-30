import { http } from './http'
import type {
  ApplicationExecutorParamListParams,
  CreateJenkinsRawPipelinePayload,
  CreatePipelineBindingPayload,
  ExecutorParamListParams,
  PipelineBindingDataResponse,
  PipelineBindingListParams,
  PipelineBindingListResponse,
  PipelineConfigXMLDataResponse,
  PipelineDataResponse,
  ExecutorParamDefDataResponse,
  ExecutorParamDefListResponse,
  PipelineOriginalLinkDataResponse,
  PipelineRawScriptDataResponse,
  PipelineListParams,
  PipelineListResponse,
  PipelineSyncResponse,
  UpdateJenkinsRawPipelinePayload,
  UpdateExecutorParamDefPayload,
  UpdatePipelineBindingPayload,
} from '../types/pipeline'

export async function listPipelines(params: PipelineListParams): Promise<PipelineListResponse> {
  const response = await http.get<PipelineListResponse>('/pipelines', { params })
  return response.data
}

export async function getPipelineRawScript(id: string): Promise<PipelineRawScriptDataResponse> {
  const response = await http.get<PipelineRawScriptDataResponse>(`/pipelines/${id}/raw-script`)
  return response.data
}

export async function getPipelineConfigXML(id: string): Promise<PipelineConfigXMLDataResponse> {
  const response = await http.get<PipelineConfigXMLDataResponse>(`/pipelines/${id}/config-xml`)
  return response.data
}

export async function getPipelineOriginalLink(id: string): Promise<PipelineOriginalLinkDataResponse> {
  const response = await http.get<PipelineOriginalLinkDataResponse>(`/pipelines/${id}/original-link`)
  return response.data
}

export async function createJenkinsRawPipeline(
  payload: CreateJenkinsRawPipelinePayload,
): Promise<PipelineDataResponse> {
  const response = await http.post<PipelineDataResponse>('/jenkins/pipelines/raw', payload)
  return response.data
}

export async function updateJenkinsRawPipeline(
  id: string,
  payload: UpdateJenkinsRawPipelinePayload,
): Promise<PipelineDataResponse> {
  const response = await http.put<PipelineDataResponse>(`/pipelines/${id}/raw`, payload)
  return response.data
}

export async function deleteJenkinsRawPipeline(id: string): Promise<PipelineDataResponse> {
  const response = await http.delete<PipelineDataResponse>(`/pipelines/${id}/raw`)
  return response.data
}

export async function previewJenkinsRawPipelineConfigXML(
  payload: CreateJenkinsRawPipelinePayload,
): Promise<PipelineConfigXMLDataResponse> {
  const response = await http.post<PipelineConfigXMLDataResponse>('/jenkins/pipelines/raw/preview-config-xml', payload)
  return response.data
}

export async function syncJenkinsPipelines(): Promise<PipelineSyncResponse> {
  const response = await http.post<PipelineSyncResponse>('/jenkins/pipelines/sync', undefined, {
    timeout: 120_000,
  })
  return response.data
}

export async function syncJenkinsExecutorParamDefs(): Promise<PipelineSyncResponse> {
  const response = await http.post<PipelineSyncResponse>('/jenkins/executor-param-defs/sync', undefined, {
    timeout: 120_000,
  })
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

export async function listApplicationExecutorParamDefs(
  applicationID: string,
  params: ApplicationExecutorParamListParams,
): Promise<ExecutorParamDefListResponse> {
  const response = await http.get<ExecutorParamDefListResponse>(
    `/applications/${applicationID}/executor-param-defs`,
    { params },
  )
  return response.data
}

export async function listExecutorParamDefs(
  params: ExecutorParamListParams,
): Promise<ExecutorParamDefListResponse> {
  const response = await http.get<ExecutorParamDefListResponse>('/executor-param-defs', { params })
  return response.data
}

export async function getExecutorParamDefByID(id: string): Promise<ExecutorParamDefDataResponse> {
  const response = await http.get<ExecutorParamDefDataResponse>(`/executor-param-defs/${id}`)
  return response.data
}

export async function updateExecutorParamDef(
  id: string,
  payload: UpdateExecutorParamDefPayload,
): Promise<ExecutorParamDefDataResponse> {
  const response = await http.put<ExecutorParamDefDataResponse>(`/executor-param-defs/${id}`, payload)
  return response.data
}
