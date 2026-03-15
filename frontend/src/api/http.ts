import axios from 'axios'

function resolveDefaultAPIBaseURL() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8081'
  }
  const protocol = window.location.protocol || 'http:'
  const hostname = window.location.hostname || 'localhost'
  return `${protocol}//${hostname}:8081`
}

export const apiBaseURL = import.meta.env.VITE_API_BASE_URL?.trim() || resolveDefaultAPIBaseURL()

export const http = axios.create({
  baseURL: apiBaseURL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let requestInterceptorRegistered = false
let responseInterceptorRegistered = false

export function registerHTTPInterceptors(options: {
  getAccessToken: () => string
  onUnauthorized: () => void
}) {
  if (!requestInterceptorRegistered) {
    http.interceptors.request.use((config) => {
      const token = String(options.getAccessToken() || '').trim()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else if (config.headers?.Authorization) {
        delete config.headers.Authorization
      }
      return config
    })
    requestInterceptorRegistered = true
  }

  if (!responseInterceptorRegistered) {
    http.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = Number(error?.response?.status || 0)
        if (status === 401) {
          options.onUnauthorized()
        }
        return Promise.reject(error)
      },
    )
    responseInterceptorRegistered = true
  }
}
