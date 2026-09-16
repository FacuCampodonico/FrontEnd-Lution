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
import { useInsumos } from "@/hooks/useInsumos"
import { useProductos } from "@/hooks/useProductos"
import { formatCurrency } from "@/lib/utils"
import type { Producto } from "@/types/producto"

export default function ProductosPage() {
  const { productos, crearProducto, actualizarProducto, eliminarProducto } = useProductos()
  const { categorias } = useCategorias()
  const { insumos } = useInsumos()

  const [modalAbierto, setModalAbierto] = useState(false)

  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)

  const [productoEliminar, setProductoEliminar] = useState<Producto | null>(null)
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false)

  function handleAbrirEditar(producto: Producto) {
    setProductoEditar(producto)
    setModalEditarAbierto(true)
  }

  function handleGuardarEdicion(id: string, datosActualizados: Partial<Producto>) {
    let categoriaNombre = productoEditar?.categoriaNombre

    if (datosActualizados.categoriaId) {
      const categoriaEncontrada = categorias.find((c) => c.id === datosActualizados.categoriaId)
      if (categoriaEncontrada) {
        categoriaNombre = categoriaEncontrada.nombre
      }
    }

    actualizarProducto(id, {
      ...datosActualizados,
      categoriaNombre,
    })
  }

  function handleAbrirEliminar(producto: Producto) {
    setProductoEliminar(producto)
    setModalEliminarAbierto(true)
  }

  function handleConfirmarEliminar() {
    if (!productoEliminar) return
    void eliminarProducto(productoEliminar.id)
    setModalEliminarAbierto(false)
    setProductoEliminar(null)
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
        insumosDisponibles={insumos}
        onSubmit={crearProducto}
      />

      <EditarProductoModal
        open={modalEditarAbierto}
        onOpenChange={setModalEditarAbierto}
        producto={productoEditar}
        categorias={categorias}
        insumosDisponibles={insumos}
        onSubmit={handleGuardarEdicion}
      />

      <Dialog open={modalEliminarAbierto} onOpenChange={setModalEliminarAbierto}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés eliminar el producto{" "}
              <strong className="text-gray-900">{productoEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setModalEliminarAbierto(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
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