import axios from 'axios'

export const apiBaseURL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8081'

export const http = axios.create({
  baseURL: apiBaseURL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})
