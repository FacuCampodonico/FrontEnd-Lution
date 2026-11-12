import type { Supply } from "@/types/insumo"
import type { RecipeItem } from "@/types/producto"

/** Editable recipe row: the quantity stays as text while it's being typed. */
export interface RecipeRow {
  id: number
  insumoId: string
  cantidad: string
}

let nextId = 0

export function newRow(insumoId: string, cantidad = ""): RecipeRow {
  return { id: nextId++, insumoId, cantidad }
}

export function rowsFromRecipe(recipe: RecipeItem[]): RecipeRow[] {
  // Recipes saved before quantities existed come with 0: they show as pending, not as an error.
  return recipe.map((item) => newRow(item.insumoId, item.cantidad > 0 ? String(item.cantidad) : ""))
}

export function isValidQuantity(quantity: string) {
  const value = Number(quantity)
  return quantity !== "" && Number.isFinite(value) && value >= 0.001
    && value <= 9999999.999 && (String(value).split(".")[1]?.length ?? 0) <= 3
}

export function isValidRecipe(rows: RecipeRow[], supplies: Supply[]) {
  return new Set(rows.map((row) => row.insumoId)).size === rows.length
    && rows.every((row) => supplies.some((supply) => supply.id === row.insumoId) && isValidQuantity(row.cantidad))
}

export function toRecipe(rows: RecipeRow[]): RecipeItem[] {
  return rows.map((row) => ({ insumoId: row.insumoId, cantidad: Number(row.cantidad) }))
}

export function isSameRecipe(a: RecipeItem[], b: RecipeItem[]) {
  const quantities = new Map(a.map((item) => [item.insumoId, item.cantidad]))
  return a.length === b.length && b.every((item) => quantities.get(item.insumoId) === item.cantidad)
}
