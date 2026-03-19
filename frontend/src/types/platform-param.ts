export type PlatformParamType = 'string' | 'choice' | 'bool' | 'number'
export type PlatformParamStatus = 0 | 1

export interface PlatformParamDict {
  id: string
  param_key: string
  name: string
  description: string
  param_type: PlatformParamType
  required: boolean
  gitops_locator: boolean
  builtin: boolean
  status: PlatformParamStatus
  created_at: string
  updated_at: string
}

export interface PlatformParamDictPayload {
  param_key: string
  name: string
  description: string
  param_type: PlatformParamType
  required: boolean
  gitops_locator: boolean
  status: PlatformParamStatus
}

export interface PlatformParamDictListParams {
  param_key?: string
  name?: string
  status?: PlatformParamStatus
  builtin?: boolean
  page?: number
  page_size?: number
}

export interface PlatformParamDictDataResponse {
  data: PlatformParamDict
}

export interface PlatformParamDictListResponse {
  data: PlatformParamDict[]
  page: number
  page_size: number
  total: number
}
