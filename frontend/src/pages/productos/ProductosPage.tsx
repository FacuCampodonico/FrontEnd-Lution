import { useState } from "react"

import { CrearProductoModal } from "@/components/modales/CrearProductoModal"
import { EditarProductoModal } from "@/components/modales/EditarProductoModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { useCategorias } from "@/hooks/useCategorias"
import { useInsumos } from "@/hooks/useInsumos"
import { useProductos } from "@/hooks/useProductos"
import { formatCurrency } from "@/lib/utils"
import type { Producto } from "@/types/producto"

export default function ProductosPage() {
  const { productos, crearProducto, actualizarProducto } = useProductos()
  const { categorias } = useCategorias()
  const { insumos } = useInsumos()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)

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

  const columnas: DataTableColumn<Producto>[] = [
    { header: "Nombre", cell: (p) => p.nombre },
    { header: "Categoría", cell: (p) => p.categoriaNombre || "-" },
    { 
      header: "Insumos", 
      cell: (p) => (Array.isArray(p.insumoIds) ? p.insumoIds.length : 0) 
    },
    { header: "Precio", cell: (p) => formatCurrency(p.precio) },
    {
      header: "Acciones",
      cell: (p) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAbrirEditar(p)}
        >
          Editar
        </Button>
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
    </div>
  )
}