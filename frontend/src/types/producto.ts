export interface Producto {
  id: string
  nombre: string
  precio: number
  categoriaId: string
  categoriaNombre: string
  insumoIds: string[]
}

export interface CrearProductoInput {
  nombre: string
  precio: number
  categoriaId: string
  insumoIds: string[]
}
