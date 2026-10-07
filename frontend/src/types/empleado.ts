export type RolEmpleado = "mozo" | "admin"

export interface Empleado {
  id: string
  nombre: string
  apellido: string
  dni: string
  idTipoRol: number
  rolNombre: string | null
  rol: RolEmpleado | null
  activo: boolean | null
}

export interface CrearEmpleadoInput {
  nombre: string
  dni: string
  idTipoRol: number
}

export type EmpleadoServicio = Empleado

export interface RolDisponible {
  id: number
  nombre: string
}
