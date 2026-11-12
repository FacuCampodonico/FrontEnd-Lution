import { useState } from "react"

import { CategoriaDetailModal } from "@/components/modales/CategoriaDetailModal"
import { CrearCategoriaModal } from "@/components/modales/CrearCategoriaModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { useCategorias } from "@/hooks/useCategorias"
import { useProductos } from "@/hooks/useProductos"
import type { Category } from "@/types/categoria"

export default function CategoriasPage() {
  const { categories, loading, error, createCategory, refetch } = useCategorias()
  const { products, updateProduct } = useProductos()

  const [createOpen, setCreateOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || null

  function handleViewCategory(category: Category) {
    setSelectedCategoryId(category.id)
    setDetailOpen(true)
  }

  async function handleAddProductToCategory(categoryId: string, productId: string) {
    await updateProduct(productId, { categoriaId: categoryId })
    if (!await refetch()) throw new Error("El producto se reasignó, pero no se pudo actualizar el listado de categorías. Recargá la pantalla.")
  }

  const columns: DataTableColumn<Category>[] = [
    {
      header: "Nombre",
      cell: (c) => (
        <button
          onClick={() => handleViewCategory(c)}
          className="font-medium text-primary hover:underline text-left cursor-pointer"
        >
          {c.nombre}
        </button>
      )
    },
    {
      header: "Productos",
      cell: (c) => Array.isArray(c.productoIds) ? c.productoIds.length : 0
    },
    {
      header: "Acciones",
      cell: (c) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewCategory(c)}
        >
          Ver productos
        </Button>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Categorías"
        actionLabel="Crear categoría"
        onAction={() => setCreateOpen(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando categorías…</p>}
        {error && <p role="alert">{error}</p>}
        <DataTable
          columns={columns}
          data={categories}
          getRowKey={(c) => c.id}
          emptyMessage="Todavía no cargaste categorías."
        />
      </div>

      <CrearCategoriaModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={createCategory}
      />

      <CategoriaDetailModal
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open)
          if (!open) setSelectedCategoryId(null)
        }}
        category={selectedCategory}
        products={products}
        onAddProduct={handleAddProductToCategory}
      />
    </div>
  )
}
