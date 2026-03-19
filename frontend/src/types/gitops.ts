export interface GitOpsStatus {
  enabled: boolean
  local_root: string
  mode: string
  default_branch: string
  username: string
  author_name: string
  author_email: string
  commit_message_template: string
  command_timeout_sec: number
  path_exists: boolean
  is_git_repo: boolean
  remote_origin: string
  remote_reachable: boolean
  current_branch: string
  head_commit: string
  head_commit_short: string
  head_commit_subject: string
  worktree_dirty: boolean
  status_summary: string[]
}

export interface GitOpsTemplateField {
  param_key: string
  name: string
  description: string
  builtin: boolean
  required: boolean
}

export interface GitOpsFieldCandidate {
  file_path_template: string
  document_kind: string
  document_name: string
  target_path: string
  value_type: string
  sample_value: string
  display_name: string
}

export interface GitOpsValuesCandidate {
  file_path_template: string
  target_path: string
  value_type: string
  sample_value: string
  display_name: string
}
