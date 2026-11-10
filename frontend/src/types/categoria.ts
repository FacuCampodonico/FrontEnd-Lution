export interface Categoria {
  id: string
  nombre: string
  productoIds: string[]
}

export interface CrearCategoriaInput {
  nombre: string
}

export type CrearCategoriaRequest = CrearCategoriaInput
