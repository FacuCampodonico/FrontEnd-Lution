import { api } from "@/lib/api"
import type { CrearEmpleadoInput, Empleado } from "@/types/empleado"

export async function getEmpleados(): Promise<Empleado[]> {
  const { data } = await api.get<Empleado[]>("/empleados")
  return data
}

export async function createEmpleado(
  input: CrearEmpleadoInput
): Promise<Empleado> {
  const { data } = await api.post<Empleado>("/empleados", input)
  return data
}
