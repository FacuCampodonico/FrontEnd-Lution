import { isAxiosError } from "axios"
import type { FaltanteStock } from "@/types/insumo"

export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message: unknown = error.response?.data?.message
    if (typeof message === "string") return message
    if (Array.isArray(message)) return message.filter((value) => typeof value === "string").join(". ")
  }
  return error instanceof Error ? error.message : "No se pudo completar la operación"
}

export function faltantesDeStock(error: unknown): FaltanteStock[] | null {
  if (!isAxiosError(error) || error.response?.status !== 409) return null
  const data: unknown = error.response.data
  if (typeof data !== "object" || data === null) return null
  const { codigo, faltantes } = data as { codigo?: unknown; faltantes?: unknown }
  return codigo === "STOCK_INSUFICIENTE" && Array.isArray(faltantes) ? faltantes as FaltanteStock[] : null
}
