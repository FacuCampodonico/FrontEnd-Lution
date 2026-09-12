export interface Categoria {
  id: string
  nombre: string
  productoIds: string[]
}

export interface CrearCategoriaInput {
  nombre: string
  productoIds: string[]
}
