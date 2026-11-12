import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

import { AuthContext, type AuthContextValue } from "@/context/auth-context"
import { clearToken, getToken, SESSION_EXPIRED, setToken } from "@/lib/sesion"
import { login as loginService, me } from "@/services/auth.service"
import type { SessionEmployee } from "@/types/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<SessionEmployee | null>(null)
  const [loading, setLoading] = useState(() => getToken() !== null)

  useEffect(() => {
    if (getToken() === null) return
    let cancelled = false
    me()
      .then((current) => {
        if (!cancelled) setEmployee(current)
      })
      .catch(() => {
        if (!cancelled) setEmployee(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function onExpired() {
      setEmployee(null)
    }
    window.addEventListener(SESSION_EXPIRED, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED, onExpired)
  }, [])

  const login = useCallback(async (dni: string, password: string) => {
    const response = await loginService({ dni, password })
    setToken(response.accessToken)
    setEmployee(response.empleado)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setEmployee(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ employee, loading, login, logout }),
    [employee, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
