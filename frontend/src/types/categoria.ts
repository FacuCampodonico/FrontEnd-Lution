export interface Category {
  id: string
  nombre: string
  productoIds: string[]
}

export interface CreateCategoryInput {
  nombre: string
}

export type CreateCategoryRequest = CreateCategoryInput
