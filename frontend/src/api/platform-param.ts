import { http } from './http'
import type {
  PlatformParamDictDataResponse,
  PlatformParamDictListParams,
  PlatformParamDictListResponse,
  PlatformParamDictPayload,
} from '../types/platform-param'

export async function listPlatformParamDicts(
  params: PlatformParamDictListParams,
): Promise<PlatformParamDictListResponse> {
  const response = await http.get<PlatformParamDictListResponse>('/platform-param-dicts', { params })
  return response.data
}

export async function getPlatformParamDictByID(id: string): Promise<PlatformParamDictDataResponse> {
  const response = await http.get<PlatformParamDictDataResponse>(`/platform-param-dicts/${id}`)
  return response.data
}

export async function createPlatformParamDict(
  payload: PlatformParamDictPayload,
): Promise<PlatformParamDictDataResponse> {
  const response = await http.post<PlatformParamDictDataResponse>('/platform-param-dicts', payload)
  return response.data
}

export async function updatePlatformParamDict(
  id: string,
  payload: PlatformParamDictPayload,
): Promise<PlatformParamDictDataResponse> {
  const response = await http.put<PlatformParamDictDataResponse>(`/platform-param-dicts/${id}`, payload)
  return response.data
}

export async function deletePlatformParamDict(id: string): Promise<void> {
  await http.delete(`/platform-param-dicts/${id}`)
}
