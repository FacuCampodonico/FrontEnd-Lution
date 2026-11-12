import { api } from "@/lib/api"
import type { SessionEmployee, LoginInput, LoginResponse } from "@/types/auth"

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", input)
  return data
}

export async function me(): Promise<SessionEmployee> {
  const { data } = await api.get<SessionEmployee>("/auth/me")
  return data
}
