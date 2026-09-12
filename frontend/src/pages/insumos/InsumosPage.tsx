import { useState } from "react"

import { CrearInsumoModal } from "@/components/modales/CrearInsumoModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { useInsumos } from "@/hooks/useInsumos"
import type { Insumo } from "@/types/insumo"

const columnas: DataTableColumn<Insumo>[] = [
  { header: "Nombre", cell: (i) => i.nombre },
  { header: "Stock disponible", cell: (i) => i.stock },
  { header: "Unidad de medida", cell: (i) => i.unidad },
]

export default function InsumosPage() {
  const { insumos, crearInsumo } = useInsumos()
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Insumos"
        actionLabel="Crear insumo"
        onAction={() => setModalAbierto(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        <DataTable
          columns={columnas}
          data={insumos}
          getRowKey={(i) => i.id}
          emptyMessage="Todavía no cargaste insumos."
        />
      </div>

      <CrearInsumoModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        onSubmit={crearInsumo}
      />
    </div>
  )
}
