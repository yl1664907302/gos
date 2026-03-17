export interface GitOpsStatus {
  enabled: boolean
  local_root: string
  mode: string
  default_branch: string
  username: string
  author_name: string
  author_email: string
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
