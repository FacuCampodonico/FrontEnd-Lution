export interface RecetaProducto {
  insumoId: string
  cantidad: number
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoriaId: string
  categoriaNombre: string
  insumoIds: string[]
  recetas: RecetaProducto[]
}

export interface CrearProductoInput {
  nombre: string
  descripcion: string
  precio: number
  categoriaId: string
  recetas?: RecetaProducto[]
}

export interface ActualizarProductoInput {
  nombre?: string
  descripcion?: string
  precio?: number
  categoriaId?: string
  /** Si viene, reemplaza la receta completa. */
  recetas?: RecetaProducto[]
}

export type ProductoServicio = Producto
