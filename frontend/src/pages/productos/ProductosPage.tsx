import { useState } from "react"
import { Trash2, Edit } from "lucide-react"

import { CrearProductoModal } from "@/components/modales/CrearProductoModal"
import { EditarProductoModal } from "@/components/modales/EditarProductoModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCategorias } from "@/hooks/useCategorias"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { useInsumos } from "@/hooks/useInsumos"
import { useProductos } from "@/hooks/useProductos"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types/producto"

export default function ProductosPage() {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProductos()
  const { categories } = useCategorias()
  const { supplies, loading: loadingSupplies, error: suppliesError, refetch: reloadSupplies } = useInsumos()
  const deletion = useAsyncAction()

  const [createOpen, setCreateOpen] = useState(false)

  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleOpenEdit(product: Product) {
    setProductToEdit(product)
    setEditOpen(true)
  }

  function handleOpenDelete(product: Product) {
    setProductToDelete(product)
    setDeleteOpen(true)
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return
    await deletion.run(async () => {
      await deleteProduct(productToDelete.id)
      setDeleteOpen(false)
      setProductToDelete(null)
    })
  }

  const columns: DataTableColumn<Product>[] = [
    { header: "Nombre", cell: (p) => p.nombre },
    { header: "Categoría", cell: (p) => p.categoriaNombre || "-" },
    {
      header: "Insumos",
      cell: (p) => (Array.isArray(p.insumoIds) ? p.insumoIds.length : 0),
    },
    { header: "Precio", cell: (p) => formatCurrency(p.precio) },
    {
      header: "Acciones",
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(p)}
            className="flex items-center gap-1"
          >
            <Edit className="h-3.5 w-3.5" />
            Editar
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDelete(p)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Productos"
        actionLabel="Crear producto"
        onAction={() => setCreateOpen(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando productos…</p>}
        {error && <p role="alert">{error}</p>}
        <DataTable
          columns={columns}
          data={products}
          getRowKey={(p) => p.id}
          emptyMessage="Todavía no cargaste productos."
        />
      </div>

      <CrearProductoModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        availableCategories={categories}
        supplies={supplies}
        loadingSupplies={loadingSupplies}
        suppliesError={suppliesError}
        onReloadSupplies={reloadSupplies}
        onSubmit={createProduct}
      />

      <EditarProductoModal
        open={editOpen}
        onOpenChange={setEditOpen}
        product={productToEdit}
        categories={categories}
        supplies={supplies}
        loadingSupplies={loadingSupplies}
        suppliesError={suppliesError}
        onReloadSupplies={reloadSupplies}
        onSubmit={updateProduct}
      />

      <Dialog open={deleteOpen} onOpenChange={(value) => !deletion.pending && setDeleteOpen(value)}>
        <DialogContent className="max-w-sm" showCloseButton={!deletion.pending}>
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés eliminar el producto{" "}
              <strong className="text-gray-900">{productToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {deletion.error && <p role="alert" className="text-sm text-destructive">{deletion.error}</p>}
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              disabled={deletion.pending}
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deletion.pending}
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
