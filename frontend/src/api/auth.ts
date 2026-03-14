import { http } from './http'
import type { LoginResponse, MeResponse } from '../types/user'

export async function login(payload: { username: string; password: string }): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>('/auth/login', payload)
  return response.data
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout')
}

export async function getMe(): Promise<MeResponse> {
  const response = await http.get<MeResponse>('/me')
  return response.data
}
