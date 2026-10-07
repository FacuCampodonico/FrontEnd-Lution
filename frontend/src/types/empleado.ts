export type RolEmpleado = "mozo" | "admin"

export interface Empleado {
  id: string
  nombre: string
  apellido: string
  rol: RolEmpleado | null
  activo: boolean | null
}

export interface CrearEmpleadoInput {
  nombre: string
  apellido?: string
  idTipoRol: number
  dni: string
}


export interface EmpleadoServicio extends Empleado {
  dni: string
  idTipoRol: number
  rolNombre: string | null
}
