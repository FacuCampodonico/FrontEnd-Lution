import { useState } from "react"

import { CrearProductoModal } from "@/components/modales/CrearProductoModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { useCategorias } from "@/hooks/useCategorias"
import { useInsumos } from "@/hooks/useInsumos"
import { useProductos } from "@/hooks/useProductos"
import { formatCurrency } from "@/lib/utils"
import type { Producto } from "@/types/producto"

const columnas: DataTableColumn<Producto>[] = [
  { header: "Nombre", cell: (p) => p.nombre },
  { header: "Categoría", cell: (p) => p.categoriaNombre },
  { header: "Insumos", cell: (p) => p.insumoIds.length },
  { header: "Precio", cell: (p) => formatCurrency(p.precio) },
]

export default function ProductosPage() {
  const { productos, crearProducto } = useProductos()
  const { categorias } = useCategorias()
  const { insumos } = useInsumos()
  const [modalAbierto, setModalAbierto] = useState(false)

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
    </div>
  )
}
