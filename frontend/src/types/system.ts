export interface ReleaseSettings {
  env_options: string[]
}

export interface ReleaseSettingsDataResponse {
  data: ReleaseSettings
}

export interface UpdateReleaseSettingsPayload {
  env_options: string[]
}
