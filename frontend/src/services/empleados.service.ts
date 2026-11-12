import { api } from "@/lib/api"
import type { EmployeeResponse, CreateEmployeeInput, AvailableRole } from "@/types/empleado"

export const MIN_PASSWORD_LENGTH = 6

export async function getRoles(): Promise<AvailableRole[]> {
  const { data } = await api.get<AvailableRole[]>("/empleados/roles")
  return data
}

export async function getEmployees(): Promise<EmployeeResponse[]> {
  const { data } = await api.get<EmployeeResponse[]>("/empleados")
  return data
}

export async function getEmployee(id: string | number): Promise<EmployeeResponse> {
  const { data } = await api.get<EmployeeResponse>(`/empleados/${id}`)
  return data
}

export async function createEmployee(
  input:   CreateEmployeeInput
): Promise<EmployeeResponse> {
  if (!input.dni?.trim()) throw new Error("El DNI del empleado es obligatorio")
  const roleId = input.idTipoRol
  if (roleId === undefined || !Number.isSafeInteger(roleId) || roleId <= 0) {
    throw new Error("El ID del rol del empleado debe ser un entero positivo")
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
  }
  const body = {
    nombre: input.nombre,
    dni: input.dni, idTipoRol: roleId,
    password: input.password,
  }
  const { data } = await api.post<EmployeeResponse>("/empleados", body)
  return data
}
