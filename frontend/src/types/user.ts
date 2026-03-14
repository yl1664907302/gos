export type UserRole = 'admin' | 'normal'
export type UserStatus = 'active' | 'inactive'

export interface UserProfile {
  id: string
  username: string
  display_name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface UserOption {
  id: string
  username: string
  display_name: string
}

export interface UserPermission {
  id: string
  user_id: string
  permission_code: string
  scope_type: string
  scope_value: string
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface UserParamPermission {
  id: string
  user_id: string
  param_key: string
  application_id: string
  can_view: boolean
  can_edit: boolean
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  data: {
    access_token: string
    expired_at: string
    user: UserProfile
  }
}

export interface MeResponse {
  data: {
    user: UserProfile
    permissions: UserPermission[]
    param_permissions: UserParamPermission[]
  }
}

export interface UserListResponse {
  data: UserProfile[]
  page: number
  page_size: number
  total: number
}

export interface UserDataResponse {
  data: UserProfile
}

export interface UserOptionListResponse {
  data: UserOption[]
}

export interface UserPermissionListResponse {
  data: UserPermission[]
}

export interface PermissionMeta {
  id: string
  code: string
  name: string
  module: string
  action: string
  description: string
  created_at: string
  updated_at: string
}

export interface PermissionListResponse {
  data: PermissionMeta[]
}

export interface UserParamPermissionListResponse {
  data: UserParamPermission[]
}
