import { useCallback, useEffect, useState } from "react"

import { createEmpleado, getEmpleados } from "@/services/empleados.service"
import type { CrearEmpleadoInput, Empleado, RolDisponible } from "@/types/empleado"

export function useEmpleados(habilitado = true) {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(habilitado)
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
    if (habilitado) void refetch()
  }, [habilitado, refetch])

  async function crearEmpleado(input: CrearEmpleadoInput) {
    const nuevo = await createEmpleado(input)
    setEmpleados((prev) => [...prev, nuevo])
    return nuevo
  }

  const rolesDisponibles: RolDisponible[] = Array.from(
    new Map(empleados.filter((empleado) => empleado.rolNombre !== null).map((empleado) => [
      empleado.idTipoRol, { id: empleado.idTipoRol, nombre: empleado.rolNombre! },
    ])).values(),
  )

  return { empleados, rolesDisponibles, loading, error, refetch, crearEmpleado }
}
