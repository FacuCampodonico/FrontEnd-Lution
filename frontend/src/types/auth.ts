export type Nivel = "admin" | "mozo"

export interface EmpleadoSesion {
  id: string
  nombre: string
  dni: string
  rolNombre: string
  nivel: Nivel
}

export interface LoginInput {
  dni: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  empleado: EmpleadoSesion
}
