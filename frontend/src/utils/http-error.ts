import axios from 'axios'

interface BackendErrorPayload {
  error?: string
}

export function extractHTTPErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<BackendErrorPayload>(error)) {
    return fallback
  }

  const status = error.response?.status
  const backendMessage = error.response?.data?.error?.trim()
  if (backendMessage) {
    return backendMessage
  }

  switch (status) {
    case 400:
      return '请求参数错误'
    case 404:
      return '资源不存在'
    case 409:
      return '应用 Key 已存在'
    case 500:
      return '系统异常，请稍后重试'
    default:
      return fallback
  }
}
