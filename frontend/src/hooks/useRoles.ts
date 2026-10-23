import { useCallback, useEffect, useState } from "react"

import { getRoles } from "@/services/empleados.service"
import type { RolDisponible } from "@/types/empleado"

export function useRoles() {
  const [roles, setRoles] = useState<RolDisponible[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setRoles(await getRoles())
    } catch {
      setError("No se pudieron cargar los roles")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { roles, loading, error, refetch }
}
