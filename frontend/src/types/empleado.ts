export type EmployeeRole = "mozo" | "admin"

export interface Employee {
  id: string
  nombre: string
  apellido: string
  dni: string
  idTipoRol: number
  rolNombre: string | null
  rol: EmployeeRole | null
  activo: boolean | null
}

export interface CreateEmployeeInput {
  nombre: string
  dni: string
  idTipoRol: number
  password: string
}

export type EmployeeResponse = Employee

export interface AvailableRole {
  id: number
  nombre: string
}
