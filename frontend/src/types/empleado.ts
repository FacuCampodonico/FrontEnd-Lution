// El proposal pide CRUD Empleado y CRUD Admin (que depende de Empleado).
// Se modela como un único recurso con `rol` discriminante para mantener
// el frontend simple; si el backend los expone como recursos separados,
// alcanza con ajustar `empleados.service.ts`.
export type RolEmpleado = "mozo" | "admin"

export interface Empleado {
  id: string
  nombre: string
  apellido: string
  rol: RolEmpleado
  activo: boolean
}

export interface CrearEmpleadoInput {
  nombre: string
  apellido: string
  rol: RolEmpleado
}
