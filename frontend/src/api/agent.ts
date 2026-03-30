import { http } from './http'
import type {
  AgentConfigResponse,
  AgentDataResponse,
  AgentHeartbeatPayload,
  AgentListParams,
  AgentListResponse,
  AgentScriptDataResponse,
  AgentScriptListParams,
  AgentScriptListResponse,
  AgentTaskDataResponse,
  AgentTaskListResponse,
  CreateAgentTaskPayload,
  UpsertAgentPayload,
  UpsertAgentScriptPayload,
} from '../types/agent'

export async function listAgents(params: AgentListParams = {}): Promise<AgentListResponse> {
  const response = await http.get<AgentListResponse>('/agents', { params })
  return response.data
}

export async function getAgent(id: string): Promise<AgentDataResponse> {
  const response = await http.get<AgentDataResponse>(`/agents/${id}`)
  return response.data
}

export async function getAgentConfig(id: string): Promise<AgentConfigResponse> {
  const response = await http.get<AgentConfigResponse>(`/agents/${id}/config`)
  return response.data
}

export async function createAgent(payload: UpsertAgentPayload): Promise<AgentDataResponse> {
  const response = await http.post<AgentDataResponse>('/agents', payload)
  return response.data
}

export async function updateAgent(id: string, payload: UpsertAgentPayload): Promise<AgentDataResponse> {
  const response = await http.put<AgentDataResponse>(`/agents/${id}`, payload)
  return response.data
}

export async function resetAgentToken(id: string): Promise<AgentDataResponse> {
  const response = await http.post<AgentDataResponse>(`/agents/${id}/reset-token`)
  return response.data
}

export async function listAgentTasks(id: string, params: { page?: number; page_size?: number } = {}): Promise<AgentTaskListResponse> {
  const response = await http.get<AgentTaskListResponse>(`/agents/${id}/tasks`, { params })
  return response.data
}

export async function listAllAgentTasks(params: { page?: number; page_size?: number } = {}): Promise<AgentTaskListResponse> {
  const response = await http.get<AgentTaskListResponse>('/agent-tasks', { params })
  return response.data
}

export async function createAgentTask(id: string, payload: CreateAgentTaskPayload): Promise<AgentTaskDataResponse> {
  const response = await http.post<AgentTaskDataResponse>(`/agents/${id}/tasks`, payload)
  return response.data
}

export async function createUnassignedAgentTask(payload: CreateAgentTaskPayload): Promise<AgentTaskDataResponse> {
  const response = await http.post<AgentTaskDataResponse>('/agent-tasks', payload)
  return response.data
}

export async function updateAgentTask(agentID: string, taskID: string, payload: CreateAgentTaskPayload): Promise<AgentTaskDataResponse> {
  const response = await http.put<AgentTaskDataResponse>(`/agents/${agentID}/tasks/${taskID}`, payload)
  return response.data
}

export async function stopAgentTask(agentID: string, taskID: string): Promise<AgentTaskDataResponse> {
  const response = await http.post<AgentTaskDataResponse>(`/agents/${agentID}/tasks/${taskID}/stop`)
  return response.data
}

export async function resumeAgentTask(agentID: string, taskID: string): Promise<AgentTaskDataResponse> {
  const response = await http.post<AgentTaskDataResponse>(`/agents/${agentID}/tasks/${taskID}/resume`)
  return response.data
}

export async function deleteAgentTask(agentID: string, taskID: string): Promise<{ ok: boolean }> {
  const response = await http.delete<{ ok: boolean }>(`/agents/${agentID}/tasks/${taskID}`)
  return response.data
}

export async function listAgentScripts(params: AgentScriptListParams = {}): Promise<AgentScriptListResponse> {
  const response = await http.get<AgentScriptListResponse>('/agent-scripts', { params })
  return response.data
}

export async function getAgentScript(id: string): Promise<AgentScriptDataResponse> {
  const response = await http.get<AgentScriptDataResponse>(`/agent-scripts/${id}`)
  return response.data
}

export async function createAgentScript(payload: UpsertAgentScriptPayload): Promise<AgentScriptDataResponse> {
  const response = await http.post<AgentScriptDataResponse>('/agent-scripts', payload)
  return response.data
}

export async function updateAgentScript(id: string, payload: UpsertAgentScriptPayload): Promise<AgentScriptDataResponse> {
  const response = await http.put<AgentScriptDataResponse>(`/agent-scripts/${id}`, payload)
  return response.data
}

export async function deleteAgentScript(id: string): Promise<{ ok: boolean }> {
  const response = await http.delete<{ ok: boolean }>(`/agent-scripts/${id}`)
  return response.data
}

export async function enableAgent(id: string): Promise<AgentDataResponse> {
  const response = await http.post<AgentDataResponse>(`/agents/${id}/enable`)
  return response.data
}

export async function disableAgent(id: string): Promise<AgentDataResponse> {
  const response = await http.post<AgentDataResponse>(`/agents/${id}/disable`)
  return response.data
}

export async function maintenanceAgent(id: string): Promise<AgentDataResponse> {
  const response = await http.post<AgentDataResponse>(`/agents/${id}/maintenance`)
  return response.data
}

export async function heartbeatAgent(payload: AgentHeartbeatPayload): Promise<AgentDataResponse> {
  const response = await http.post<AgentDataResponse>('/agent/heartbeat', payload, { timeout: 10000 })
  return response.data
}
