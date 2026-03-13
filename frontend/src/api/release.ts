import { http } from './http'
import type {
  CreateReleaseOrderPayload,
  ReleaseOrderDataResponse,
  ReleaseOrderListParams,
  ReleaseOrderListResponse,
  ReleaseOrderParamListResponse,
  ReleaseOrderStepListResponse,
} from '../types/release'

export async function listReleaseOrders(params: ReleaseOrderListParams): Promise<ReleaseOrderListResponse> {
  const response = await http.get<ReleaseOrderListResponse>('/release-orders', { params })
  return response.data
}

export async function createReleaseOrder(payload: CreateReleaseOrderPayload): Promise<ReleaseOrderDataResponse> {
  const response = await http.post<ReleaseOrderDataResponse>('/release-orders', payload)
  return response.data
}

export async function getReleaseOrderByID(id: string): Promise<ReleaseOrderDataResponse> {
  const response = await http.get<ReleaseOrderDataResponse>(`/release-orders/${id}`)
  return response.data
}

export async function cancelReleaseOrder(id: string): Promise<ReleaseOrderDataResponse> {
  const response = await http.post<ReleaseOrderDataResponse>(`/release-orders/${id}/cancel`)
  return response.data
}

export async function executeReleaseOrder(id: string): Promise<ReleaseOrderDataResponse> {
  const response = await http.post<ReleaseOrderDataResponse>(`/release-orders/${id}/execute`)
  return response.data
}

export async function listReleaseOrderParams(id: string): Promise<ReleaseOrderParamListResponse> {
  const response = await http.get<ReleaseOrderParamListResponse>(`/release-orders/${id}/params`)
  return response.data
}

export async function listReleaseOrderSteps(id: string): Promise<ReleaseOrderStepListResponse> {
  const response = await http.get<ReleaseOrderStepListResponse>(`/release-orders/${id}/steps`)
  return response.data
}
