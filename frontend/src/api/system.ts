import { http } from './http'
import type { ReleaseSettingsDataResponse, UpdateReleaseSettingsPayload } from '../types/system'

export async function getReleaseSettings(): Promise<ReleaseSettingsDataResponse> {
  const response = await http.get<ReleaseSettingsDataResponse>('/system/settings/release')
  return response.data
}

export async function updateReleaseSettings(
  payload: UpdateReleaseSettingsPayload,
): Promise<ReleaseSettingsDataResponse> {
  const response = await http.put<ReleaseSettingsDataResponse>('/system/settings/release', payload)
  return response.data
}
