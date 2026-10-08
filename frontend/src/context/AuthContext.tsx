import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

import { AuthContext, type AuthContextValue } from "@/context/auth-context"
import { clearToken, getToken, SESION_EXPIRADA, setToken } from "@/lib/sesion"
import { login as loginService, me } from "@/services/auth.service"
import type { EmpleadoSesion } from "@/types/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [empleado, setEmpleado] = useState<EmpleadoSesion | null>(null)
  const [cargando, setCargando] = useState(() => getToken() !== null)

  useEffect(() => {
    if (getToken() === null) return
    let cancelado = false
    me()
      .then((actual) => {
        if (!cancelado) setEmpleado(actual)
      })
      .catch(() => {
        if (!cancelado) setEmpleado(null)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
    }
  }, [])

  useEffect(() => {
    function alExpirar() {
      setEmpleado(null)
    }
    window.addEventListener(SESION_EXPIRADA, alExpirar)
    return () => window.removeEventListener(SESION_EXPIRADA, alExpirar)
  }, [])

  const login = useCallback(async (dni: string, password: string) => {
    const respuesta = await loginService({ dni, password })
    setToken(respuesta.accessToken)
    setEmpleado(respuesta.empleado)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setEmpleado(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ empleado, cargando, login, logout }),
    [empleado, cargando, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
