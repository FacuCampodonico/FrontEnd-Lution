import axios from 'axios'

import { mockAdapter } from '@/lib/mockAdapter'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  adapter: useMocks ? mockAdapter : undefined,
})
