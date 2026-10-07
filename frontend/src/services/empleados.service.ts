import { api } from "@/lib/api"
import type { EmpleadoServicio, CrearEmpleadoInput } from "@/types/empleado"

export async function getEmpleados(): Promise<EmpleadoServicio[]> {
  const { data } = await api.get<EmpleadoServicio[]>("/empleados")
  return data
}

export async function getEmpleado(id: string | number): Promise<EmpleadoServicio> {
  const { data } = await api.get<EmpleadoServicio>(`/empleados/${id}`)
  return data
}

export async function createEmpleado(
  input:   CrearEmpleadoInput
): Promise<EmpleadoServicio> {
  if (!input.dni?.trim()) throw new Error("El DNI del empleado es obligatorio")
  const idTipoRol = input.idTipoRol
  if (idTipoRol === undefined || !Number.isSafeInteger(idTipoRol) || idTipoRol <= 0) {
    throw new Error("El ID del rol del empleado debe ser un entero positivo")
  }
  const body = {
    nombre: "apellido" in input ? `${input.nombre} ${input.apellido}`.trim() : input.nombre,
    dni: input.dni, idTipoRol,
  }
  const { data } = await api.post<EmpleadoServicio>("/empleados", body)
  return data
}
