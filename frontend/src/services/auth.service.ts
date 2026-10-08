import { api } from "@/lib/api"
import type { EmpleadoSesion, LoginInput, LoginResponse } from "@/types/auth"

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", input)
  return data
}

export async function me(): Promise<EmpleadoSesion> {
  const { data } = await api.get<EmpleadoSesion>("/auth/me")
  return data
}
