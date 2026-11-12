export interface RecipeItem {
  insumoId: string
  cantidad: number
}

export interface Product {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoriaId: string
  categoriaNombre: string
  insumoIds: string[]
  recetas: RecipeItem[]
}

export interface CreateProductInput {
  nombre: string
  descripcion: string
  precio: number
  categoriaId: string
  recetas?: RecipeItem[]
}

export interface UpdateProductInput {
  nombre?: string
  descripcion?: string
  precio?: number
  categoriaId?: string
  /** If present, replaces the whole recipe. */
  recetas?: RecipeItem[]
}

export type ProductResponse = Product
