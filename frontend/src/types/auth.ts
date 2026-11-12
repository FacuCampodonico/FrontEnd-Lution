export type AccessLevel = "admin" | "mozo"

export interface SessionEmployee {
  id: string
  nombre: string
  dni: string
  rolNombre: string
  nivel: AccessLevel
}

export interface LoginInput {
  dni: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  empleado: SessionEmployee
}
