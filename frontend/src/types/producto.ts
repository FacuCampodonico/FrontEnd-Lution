export interface Producto {
  id: string
  nombre: string
  precio: number
  categoriaId: string
  categoriaNombre: string
  // El backend carga la receta; null queda permitido para consumidores anteriores.
  insumoIds: string[] | null
}

export interface CrearProductoInput {
  nombre: string
  descripcion: string
  precio: number
  categoriaId: string
  insumoIds: string[]
}

export interface ProductoServicio extends Producto {
  descripcion: string
}
