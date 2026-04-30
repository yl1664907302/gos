export type ReleaseConcurrencyLockScope = 'application' | 'application_env' | 'gitops_repo_branch'
export type ReleaseConcurrencyConflictStrategy = 'reject' | 'queue'

export interface ReleaseConcurrencySettings {
  enabled: boolean
  lock_scope: ReleaseConcurrencyLockScope
  conflict_strategy: ReleaseConcurrencyConflictStrategy
  lock_timeout_sec: number
}

export interface ReleaseGitOpsConfig {
  helm_scan_path: string
  kustomize_scan_path: string
}

export interface ReleaseSettings {
  env_options: string[]
  concurrency: ReleaseConcurrencySettings
  gitops_config: ReleaseGitOpsConfig
}

export interface ReleaseSettingsDataResponse {
  data: ReleaseSettings
}

export interface UpdateReleaseSettingsPayload {
  env_options: string[]
  concurrency: ReleaseConcurrencySettings
  gitops_config: ReleaseGitOpsConfig
}
