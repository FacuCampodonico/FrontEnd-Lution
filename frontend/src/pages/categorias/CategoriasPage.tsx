import { useState } from "react"

import { CrearCategoriaModal } from "@/components/modales/CrearCategoriaModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { useCategorias } from "@/hooks/useCategorias"
import { useProductos } from "@/hooks/useProductos"
import type { Categoria } from "@/types/categoria"

const columnas: DataTableColumn<Categoria>[] = [
  { header: "Nombre", cell: (c) => c.nombre },
  { header: "Productos", cell: (c) => c.productoIds.length },
]

export default function CategoriasPage() {
  const { categorias, crearCategoria } = useCategorias()
  const { productos } = useProductos()
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Categorías"
        actionLabel="Crear categoría"
        onAction={() => setModalAbierto(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
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
        productosDisponibles={productos}
        onSubmit={crearCategoria}
      />
    </div>
  )
}
