import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { getRoles } from "@/services/empleados.service"
import type { RolDisponible } from "@/types/empleado"

export function useRoles() {
  const [roles, setRoles] = useState<RolDisponible[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: true, failureMessage: "No se pudieron cargar los roles" })

  const refetch = useCallback(() => run(async () => setRoles(await getRoles())), [run])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { roles, loading, error, refetch }
}
