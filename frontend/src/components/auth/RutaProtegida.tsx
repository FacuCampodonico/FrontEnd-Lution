import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"
import type { Nivel } from "@/types/auth"

interface RutaProtegidaProps {
  niveles?: Nivel[]
}

export function RutaProtegida({ niveles }: RutaProtegidaProps) {
  const { empleado, cargando } = useAuth()
  const location = useLocation()

  if (cargando) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p role="status" className="text-sm text-muted-foreground">Verificando sesión…</p>
      </div>
    )
  }
  if (!empleado) return <Navigate to="/login" state={{ from: location }} replace />
  if (niveles && !niveles.includes(empleado.nivel)) return <Navigate to="/mesas" replace />
  return <Outlet />
}
