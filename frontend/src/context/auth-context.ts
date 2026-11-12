import { createContext } from "react"

import type { SessionEmployee } from "@/types/auth"

export interface AuthContextValue {
  employee: SessionEmployee | null
  loading: boolean
  login: (dni: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
