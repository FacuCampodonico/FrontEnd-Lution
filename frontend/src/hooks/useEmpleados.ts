import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createEmployee as createEmployeeService, getEmployees } from "@/services/empleados.service"
import type { CreateEmployeeInput, Employee } from "@/types/empleado"

export function useEmpleados(enabled = true) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: enabled, failureMessage: "No se pudieron cargar los empleados" })

  const refetch = useCallback(() => run(async () => setEmployees(await getEmployees())), [run])

  useEffect(() => {
    if (enabled) void refetch()
  }, [enabled, refetch])

  async function createEmployee(input: CreateEmployeeInput) {
    const created = await createEmployeeService(input)
    setEmployees((prev) => [...prev, created])
    return created
  }

  return { employees, loading, error, refetch, createEmployee }
}
