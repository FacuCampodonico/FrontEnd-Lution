import { isAxiosError } from "axios"

export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message: unknown = error.response?.data?.message
    if (typeof message === "string") return message
    if (Array.isArray(message)) return message.filter((value) => typeof value === "string").join(". ")
  }
  return error instanceof Error ? error.message : "No se pudo completar la operación"
}
