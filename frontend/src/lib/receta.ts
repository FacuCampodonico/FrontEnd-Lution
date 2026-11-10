import type { Insumo } from "@/types/insumo"
import type { RecetaProducto } from "@/types/producto"

/** Fila editable de una receta: la cantidad queda como texto mientras se tipea. */
export interface FilaReceta {
  id: number
  insumoId: string
  cantidad: string
}

let siguienteId = 0

export function nuevaFila(insumoId: string, cantidad = ""): FilaReceta {
  return { id: siguienteId++, insumoId, cantidad }
}

export function filasDesdeReceta(recetas: RecetaProducto[]): FilaReceta[] {
  // Las recetas cargadas antes de tener cantidades vienen con 0: se muestran como pendientes, no como error.
  return recetas.map((receta) => nuevaFila(receta.insumoId, receta.cantidad > 0 ? String(receta.cantidad) : ""))
}

export function cantidadValida(cantidad: string) {
  const numero = Number(cantidad)
  return cantidad !== "" && Number.isFinite(numero) && numero >= 0.001
    && numero <= 9999999.999 && (String(numero).split(".")[1]?.length ?? 0) <= 3
}

export function recetaValida(filas: FilaReceta[], insumos: Insumo[]) {
  return new Set(filas.map((fila) => fila.insumoId)).size === filas.length
    && filas.every((fila) => insumos.some((insumo) => insumo.id === fila.insumoId) && cantidadValida(fila.cantidad))
}

export function aReceta(filas: FilaReceta[]): RecetaProducto[] {
  return filas.map((fila) => ({ insumoId: fila.insumoId, cantidad: Number(fila.cantidad) }))
}

export function mismaReceta(a: RecetaProducto[], b: RecetaProducto[]) {
  const cantidades = new Map(a.map((receta) => [receta.insumoId, receta.cantidad]))
  return a.length === b.length && b.every((receta) => cantidades.get(receta.insumoId) === receta.cantidad)
}
