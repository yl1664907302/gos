import { http } from './http'
import type {
  ApplicationPipelineParamListParams,
  CreateJenkinsRawPipelinePayload,
  CreatePipelineBindingPayload,
  PipelineBindingDataResponse,
  PipelineBindingListParams,
  PipelineBindingListResponse,
  PipelineConfigXMLDataResponse,
  PipelineDataResponse,
  PipelineParamDefDataResponse,
  PipelineParamDefListResponse,
  PipelineOriginalLinkDataResponse,
  PipelineRawScriptDataResponse,
  PipelineListParams,
  PipelineListResponse,
  UpdateJenkinsRawPipelinePayload,
  UpdatePipelineParamDefPayload,
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

export async function listApplicationPipelineParamDefs(
  applicationID: string,
  params: ApplicationPipelineParamListParams,
): Promise<PipelineParamDefListResponse> {
  const response = await http.get<PipelineParamDefListResponse>(
    `/applications/${applicationID}/pipeline-param-defs`,
    { params },
  )
  return response.data
}

export async function getPipelineParamDefByID(id: string): Promise<PipelineParamDefDataResponse> {
  const response = await http.get<PipelineParamDefDataResponse>(`/pipeline-param-defs/${id}`)
  return response.data
}

export async function updatePipelineParamDef(
  id: string,
  payload: UpdatePipelineParamDefPayload,
): Promise<PipelineParamDefDataResponse> {
  const response = await http.put<PipelineParamDefDataResponse>(`/pipeline-param-defs/${id}`, payload)
  return response.data
}
