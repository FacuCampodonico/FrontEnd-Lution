import axios, { isAxiosError } from 'axios'

import { clearToken, getToken, SESION_EXPIRADA } from '@/lib/sesion'

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, ''),
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(undefined, (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 401 && error.config?.url !== '/auth/login') {
    clearToken()
    window.dispatchEvent(new Event(SESION_EXPIRADA))
  }
  return Promise.reject(error)
})
