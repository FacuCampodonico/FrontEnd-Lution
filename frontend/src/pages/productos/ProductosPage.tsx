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
import { useProductos } from "@/hooks/useProductos"
import { formatCurrency } from "@/lib/utils"
import type { Producto } from "@/types/producto"

export default function ProductosPage() {
  const { productos, loading, error, crearProducto, actualizarProducto, eliminarProducto } = useProductos()
  const { categorias } = useCategorias()
  const eliminar = useAsyncAction()

  const [modalAbierto, setModalAbierto] = useState(false)

  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)

  const [productoEliminar, setProductoEliminar] = useState<Producto | null>(null)
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)

  function handleAbrirEditar(producto: Producto) {
    setProductoEditar(producto)
    setModalEditarAbierto(true)
  }

  function handleAbrirEliminar(producto: Producto) {
    setProductoEliminar(producto)
    setModalEliminarAbierto(true)
  }

  async function handleConfirmarEliminar() {
    if (!productoEliminar) return
    await eliminar.run(async () => {
      await eliminarProducto(productoEliminar.id)
      setModalEliminarAbierto(false)
      setProductoEliminar(null)
    })
  }

  const columnas: DataTableColumn<Producto>[] = [
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
            onClick={() => handleAbrirEditar(p)}
            className="flex items-center gap-1"
          >
            <Edit className="h-3.5 w-3.5" />
            Editar
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirEliminar(p)}
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
        onAction={() => setModalAbierto(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando productos…</p>}
        {error && <p role="alert">{error}</p>}
        <DataTable
          columns={columnas}
          data={productos}
          getRowKey={(p) => p.id}
          emptyMessage="Todavía no cargaste productos."
        />
      </div>

      <CrearProductoModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        categoriasDisponibles={categorias}
        onSubmit={crearProducto}
      />

      <EditarProductoModal
        open={modalEditarAbierto}
        onOpenChange={setModalEditarAbierto}
        producto={productoEditar}
        categorias={categorias}
        onSubmit={actualizarProducto}
      />

      <Dialog open={modalEliminarAbierto} onOpenChange={(value) => !eliminar.pending && setModalEliminarAbierto(value)}>
        <DialogContent className="max-w-sm" showCloseButton={!eliminar.pending}>
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés eliminar el producto{" "}
              <strong className="text-gray-900">{productoEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {eliminar.error && <p role="alert" className="text-sm text-destructive">{eliminar.error}</p>}
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              disabled={eliminar.pending}
              onClick={() => setModalEliminarAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={eliminar.pending}
              onClick={handleConfirmarEliminar}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}