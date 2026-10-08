import { createContext } from "react"

import type { EmpleadoSesion } from "@/types/auth"

export interface AuthContextValue {
  empleado: EmpleadoSesion | null
  cargando: boolean
  login: (dni: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
