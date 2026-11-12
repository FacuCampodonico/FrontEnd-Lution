import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"
import type { AccessLevel } from "@/types/auth"

interface RutaProtegidaProps {
  levels?: AccessLevel[]
}

export function RutaProtegida({ levels }: RutaProtegidaProps) {
  const { employee, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p role="status" className="text-sm text-muted-foreground">Verificando sesión…</p>
      </div>
    )
  }
  if (!employee) return <Navigate to="/login" state={{ from: location }} replace />
  if (levels && !levels.includes(employee.nivel)) return <Navigate to="/mesas" replace />
  return <Outlet />
}
