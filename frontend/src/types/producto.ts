export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoriaId: string
  categoriaNombre: string
  insumoIds: string[]
}

export interface CrearProductoInput {
  nombre: string
  descripcion: string
  precio: number
  categoriaId: string
}

export interface ActualizarProductoInput {
  nombre?: string
  descripcion?: string
  precio?: number
  categoriaId?: string
}

export type ProductoServicio = Producto
