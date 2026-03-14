import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getMe, login as loginAPI, logout as logoutAPI } from '../api/auth'
import type { UserParamPermission, UserPermission, UserProfile } from '../types/user'

const TOKEN_KEY = 'gos_access_token'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string>(localStorage.getItem(TOKEN_KEY) || '')
  const profile = ref<UserProfile | null>(null)
  const permissions = ref<UserPermission[]>([])
  const paramPermissions = ref<UserParamPermission[]>([])
  const meLoaded = ref(false)

  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const releaseScopedPermissionCodes = new Set(['release.create', 'release.execute', 'release.cancel'])

  function setToken(token: string) {
    const value = String(token || '').trim()
    accessToken.value = value
    if (value) {
      localStorage.setItem(TOKEN_KEY, value)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  function clearAuthState() {
    setToken('')
    profile.value = null
    permissions.value = []
    paramPermissions.value = []
    meLoaded.value = false
  }

  async function login(username: string, password: string) {
    const response = await loginAPI({ username, password })
    setToken(response.data.access_token)
    await loadMe(true)
  }

  async function logout() {
    try {
      if (accessToken.value) {
        await logoutAPI()
      }
    } finally {
      clearAuthState()
    }
  }

  async function loadMe(force = false) {
    if (!accessToken.value) {
      clearAuthState()
      return
    }
    if (!force && meLoaded.value && profile.value) {
      return
    }
    const response = await getMe()
    profile.value = response.data.user
    permissions.value = response.data.permissions || []
    paramPermissions.value = response.data.param_permissions || []
    meLoaded.value = true
  }

  function hasPermission(permissionCode: string) {
    const code = String(permissionCode || '').trim()
    if (!code) {
      return false
    }
    const normalizedCode = code.toLowerCase()
    if (isAdmin.value) {
      return true
    }
    if (releaseScopedPermissionCodes.has(normalizedCode)) {
      return permissions.value.some((item) => {
        if (!item.enabled || String(item.permission_code || '').trim().toLowerCase() !== normalizedCode) {
          return false
        }
        const scopeType = String(item.scope_type || '').trim().toLowerCase()
        const scopeValue = String(item.scope_value || '').trim()
        return scopeType === 'application' && scopeValue !== ''
      })
    }
    return permissions.value.some(
      (item) => item.enabled && String(item.permission_code || '').trim().toLowerCase() === normalizedCode,
    )
  }

  function hasApplicationPermission(permissionCode: string, applicationID: string) {
    const code = String(permissionCode || '').trim().toLowerCase()
    const appID = String(applicationID || '').trim()
    if (!code || !appID) {
      return false
    }
    if (isAdmin.value) {
      return true
    }
    return permissions.value.some((item) => {
      if (!item.enabled || String(item.permission_code || '').trim().toLowerCase() !== code) {
        return false
      }
      return (
        String(item.scope_type || '').trim().toLowerCase() === 'application' &&
        String(item.scope_value || '').trim() === appID
      )
    })
  }

  function resolveParamPermission(paramKey: string, applicationID: string) {
    const key = String(paramKey || '').trim().toLowerCase()
    const appID = String(applicationID || '').trim()
    if (!key) {
      return { canView: false, canEdit: false }
    }
    if (isAdmin.value) {
      return { canView: true, canEdit: true }
    }

    let globalRule: UserParamPermission | null = null
    let appRule: UserParamPermission | null = null
    for (const item of paramPermissions.value) {
      if (String(item.param_key || '').trim().toLowerCase() !== key) {
        continue
      }
      const scopeAppID = String(item.application_id || '').trim()
      if (!scopeAppID) {
        globalRule = item
        continue
      }
      if (scopeAppID === appID) {
        appRule = item
      }
    }
    const target = appRule || globalRule
    if (!target) {
      return { canView: false, canEdit: false }
    }
    return { canView: Boolean(target.can_view), canEdit: Boolean(target.can_edit) }
  }

  function canViewParam(paramKey: string, applicationID: string) {
    return resolveParamPermission(paramKey, applicationID).canView
  }

  function canEditParam(paramKey: string, applicationID: string) {
    return resolveParamPermission(paramKey, applicationID).canEdit
  }

  return {
    accessToken,
    profile,
    permissions,
    paramPermissions,
    meLoaded,
    isAuthenticated,
    isAdmin,
    setToken,
    clearAuthState,
    login,
    logout,
    loadMe,
    hasPermission,
    hasApplicationPermission,
    canViewParam,
    canEditParam,
  }
})
