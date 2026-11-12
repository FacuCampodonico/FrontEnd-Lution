import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { CrearMesaModal } from "@/components/modales/CrearMesaModal"
import { MesaGrid } from "@/components/mesas/MesaGrid"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMesas } from "@/hooks/useMesas"
import type { Table } from "@/types/mesa"

type TableFilter = "all" | "free" | "occupied"

const EMPTY_MESSAGE: Record<TableFilter, string> = {
  all: "Todavía no hay mesas.",
  free: "No hay mesas libres.",
  occupied: "No hay mesas ocupadas.",
}

function matchesFilter(table: Table, filter: TableFilter) {
  if (filter === "free") return table.estado === "libre"
  if (filter === "occupied") return table.estado !== "libre"
  return true
}

export default function MesasPage() {
  const { tables, loading, error, createTable } = useMesas()
  const [createOpen, setCreateOpen] = useState(false)
  const [filter, setFilter] = useState<TableFilter>("all")
  const navigate = useNavigate()

  const occupied = tables.filter((table) => table.estado !== "libre").length
  const filteredTables = tables.filter((table) => matchesFilter(table, filter))

  function handleSelectTable(table: Table) {
    navigate(`/mesas/${table.id}`)
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Mesas activas"
        subtitle={`${occupied} ocupadas de ${tables.length}`}
        actionLabel="Crear mesa"
        onAction={() => setCreateOpen(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Select value={filter} onValueChange={(value) => setFilter(value as TableFilter)}>
                <SelectTrigger aria-label="Filtrar por estado" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las mesas</SelectItem>
                  <SelectItem value="free">Libres</SelectItem>
                  <SelectItem value="occupied">Ocupadas</SelectItem>
                </SelectContent>
              </Select>
              {filter !== "all" && (
                <span className="font-mono text-xs text-muted-foreground">{filteredTables.length} de {tables.length}</span>
              )}
            </div>
            <MesaGrid tables={filteredTables} onSelectTable={handleSelectTable} emptyMessage={EMPTY_MESSAGE[filter]} />
          </>
        )}
      </div>

      <CrearMesaModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={createTable}
      />
    </div>
  )
}
