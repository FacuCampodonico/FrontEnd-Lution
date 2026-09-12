import { useCallback, useEffect, useState } from "react"

import { createEmpleado, getEmpleados } from "@/services/empleados.service"
import type { CrearEmpleadoInput, Empleado } from "@/types/empleado"

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setEmpleados(await getEmpleados())
    } catch {
      setError("No se pudieron cargar los empleados")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function crearEmpleado(input: CrearEmpleadoInput) {
    const nuevo = await createEmpleado(input)
    setEmpleados((prev) => [...prev, nuevo])
    return nuevo
  }

  return { empleados, loading, error, refetch, crearEmpleado }
}
