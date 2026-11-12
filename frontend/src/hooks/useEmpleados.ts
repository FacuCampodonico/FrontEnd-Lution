import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createEmpleado, getEmpleados } from "@/services/empleados.service"
import type { CrearEmpleadoInput, Empleado } from "@/types/empleado"

export function useEmpleados(habilitado = true) {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: habilitado, failureMessage: "No se pudieron cargar los empleados" })

  const refetch = useCallback(() => run(async () => setEmpleados(await getEmpleados())), [run])

  useEffect(() => {
    if (habilitado) void refetch()
  }, [habilitado, refetch])

  async function crearEmpleado(input: CrearEmpleadoInput) {
    const nuevo = await createEmpleado(input)
    setEmpleados((prev) => [...prev, nuevo])
    return nuevo
  }

  return { empleados, loading, error, refetch, crearEmpleado }
}
