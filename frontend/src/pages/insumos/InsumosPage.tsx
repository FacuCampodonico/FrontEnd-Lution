import { useState } from "react"

import { CrearInsumoModal } from "@/components/modales/CrearInsumoModal"
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable"
import { PageHeader } from "@/components/shared/PageHeader"
import { useInsumos } from "@/hooks/useInsumos"
import type { Supply } from "@/types/insumo"

const columns: DataTableColumn<Supply>[] = [
  { header: "Nombre", cell: (s) => s.nombre },
  {
    header: "Stock disponible",
    // Stock ≤ 0 is highlighted: orders can still be saved and leave it negative.
    cell: (s) => <span className={s.stock <= 0 ? "font-medium text-destructive" : undefined}>{s.stock.toLocaleString("es-AR", { maximumFractionDigits: 3 })}</span>,
  },
  { header: "Unidad de medida", cell: (s) => s.unidad },
]

export default function InsumosPage() {
  const { supplies, loading, error, createSupply } = useInsumos()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Insumos"
        actionLabel="Crear insumo"
        onAction={() => setCreateOpen(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando…</p>}
        {error && <p role="alert">{error}</p>}
        <DataTable
          columns={columns}
          data={supplies}
          getRowKey={(s) => s.id}
          emptyMessage="Todavía no cargaste insumos."
        />
      </div>

      <CrearInsumoModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={createSupply}
      />
    </div>
  )
}
