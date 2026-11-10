import { useState } from "react"

import { CategoriaDetailModal } from "@/components/modales/CategoriaDetailModal"
import { CrearCategoriaModal } from "@/components/modales/CrearCategoriaModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { useCategorias } from "@/hooks/useCategorias"
import { useProductos } from "@/hooks/useProductos"
import type { Categoria } from "@/types/categoria"

export default function CategoriasPage() {
  const { categorias, loading, error, crearCategoria, refetch } = useCategorias()
  const { productos, actualizarProducto } = useProductos()
  
  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState<string | null>(null)
  const [detalleAbierto, setDetalleAbierto] = useState(false)

  const categoriaSeleccionada = categorias.find((c) => c.id === categoriaSeleccionadaId) || null

  function handleVerCategoria(categoria: Categoria) {
    setCategoriaSeleccionadaId(categoria.id)
    setDetalleAbierto(true)
  }

  async function handleAgregarProductoACategoria(categoriaId: string, productoId: string) {
    await actualizarProducto(productoId, { categoriaId })
    if (!await refetch()) throw new Error("El producto se reasignó, pero no se pudo actualizar el listado de categorías. Recargá la pantalla.")
  }

  const columnas: DataTableColumn<Categoria>[] = [
    { 
      header: "Nombre", 
      cell: (c) => (
        <button
          onClick={() => handleVerCategoria(c)}
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
          onClick={() => handleVerCategoria(c)}
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
        onAction={() => setModalAbierto(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando categorías…</p>}
        {error && <p role="alert">{error}</p>}
        <DataTable
          columns={columnas}
          data={categorias}
          getRowKey={(c) => c.id}
          emptyMessage="Todavía no cargaste categorías."
        />
      </div>

      <CrearCategoriaModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        onSubmit={crearCategoria}
      />

      <CategoriaDetailModal
        open={detalleAbierto}
        onOpenChange={(open) => {
          setDetalleAbierto(open)
          if (!open) setCategoriaSeleccionadaId(null)
        }}
        categoria={categoriaSeleccionada}
        productos={productos}
        onAddProducto={handleAgregarProductoACategoria}
      />
    </div>
  )
}
