export type AgentStatus = 'active' | 'disabled' | 'maintenance'
export type AgentRuntimeState = 'online' | 'offline' | 'busy' | 'disabled' | 'maintenance'
export type AgentLastTaskStatus = 'unknown' | 'running' | 'success' | 'failed' | 'cancelled'
export type AgentTaskStatus = 'draft' | 'pending' | 'queued' | 'claimed' | 'running' | 'success' | 'failed' | 'cancelled'
export type AgentTaskMode = 'temporary' | 'resident'

export interface AgentInstance {
  id: string
  agent_code: string
  name: string
  environment_code: string
  work_dir: string
  token?: string
  tags: string[]
  hostname: string
  host_ip: string
  agent_version: string
  os: string
  arch: string
  status: AgentStatus
  runtime_state: AgentRuntimeState
  last_heartbeat_at?: string
  heartbeat_age_sec: number
  current_task_id: string
  current_task_name: string
  current_task_type: string
  current_task_started_at?: string
  current_resident_task_id: string
  current_resident_task_name: string
  current_resident_task_status: AgentTaskStatus | ''
  last_task_status: AgentLastTaskStatus
  last_task_summary: string
  last_task_finished_at?: string
  remark: string
  created_at: string
  updated_at: string
}

export interface AgentListParams {
  keyword?: string
  status?: AgentStatus | ''
  runtime_state?: AgentRuntimeState | ''
  page?: number
  page_size?: number
}

export interface AgentListResponse {
  data: AgentInstance[]
  page: number
  page_size: number
  total: number
}

export interface AgentDataResponse {
  data: AgentInstance
}

export interface UpsertAgentPayload {
  agent_code: string
  name: string
  environment_code?: string
  work_dir: string
  tags?: string[]
  status?: AgentStatus
  remark?: string
}

export interface AgentInstallConfig {
  agent_id: string
  agent_code: string
  registration_token?: string
  suggested_path: string
  launch_command: string
  config_yaml: string
  resolved_server_url: string
  heartbeat_interval: string
  poll_interval: string
}

export type AgentTaskType = 'shell_task' | 'script_file_task' | 'file_distribution_task'
export type AgentShellType = 'sh' | 'bash'
export type AgentScriptTaskType = 'shell_task' | 'script_file_task'

export interface AgentTask {
  id: string
  agent_id: string
  agent_code: string
  target_agent_ids: string[]
  source_task_id: string
  dispatch_batch_id: string
  name: string
  task_mode: AgentTaskMode
  task_type: AgentTaskType
  shell_type: AgentShellType
  work_dir: string
  script_id: string
  script_name: string
  script_path: string
  script_text: string
  variables: Record<string, string>
  timeout_sec: number
  status: AgentTaskStatus
  claimed_at?: string
  started_at?: string
  finished_at?: string
  exit_code: number
  stdout_text: string
  stderr_text: string
  failure_reason: string
  run_count: number
  success_count: number
  failure_count: number
  last_run_status: AgentTaskStatus | ''
  last_run_summary: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface AgentTaskListResponse {
  data: AgentTask[]
  page: number
  page_size: number
  total: number
}

export interface AgentTaskDataResponse {
  data: AgentTask | null
}

export interface CreateAgentTaskPayload {
  name: string
  task_mode?: AgentTaskMode
  task_type?: AgentTaskType
  shell_type?: AgentShellType
  work_dir?: string
  script_id?: string
  script_path?: string
  script_text?: string
  variables?: Record<string, string>
  target_agent_ids?: string[]
  timeout_sec?: number
}

export interface AgentScript {
  id: string
  name: string
  description: string
  task_type: AgentScriptTaskType
  shell_type: AgentShellType
  script_path: string
  script_text: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface AgentScriptListParams {
  keyword?: string
  task_type?: AgentScriptTaskType | ''
  page?: number
  page_size?: number
}

export interface AgentScriptListResponse {
  data: AgentScript[]
  page: number
  page_size: number
  total: number
}

export interface AgentScriptDataResponse {
  data: AgentScript
}

export interface UpsertAgentScriptPayload {
  name: string
  description?: string
  task_type?: AgentScriptTaskType
  shell_type?: AgentShellType
  script_path?: string
  script_text: string
}

export interface AgentHeartbeatPayload {
  agent_code: string
  token: string
  hostname?: string
  host_ip?: string
  agent_version?: string
  os?: string
  arch?: string
  work_dir?: string
  tags?: string[]
  current_task_id?: string
  current_task_name?: string
  current_task_type?: string
  current_task_started_at?: string
  last_task_status?: AgentLastTaskStatus
  last_task_summary?: string
  last_task_finished_at?: string
}

export interface AgentConfigResponse {
  data: AgentInstallConfig
}
