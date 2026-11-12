import { MesaCard } from "@/components/mesas/MesaCard"
import { EmptyState } from "@/components/shared/EmptyState"
import type { Table } from "@/types/mesa"

interface MesaGridProps {
  tables: Table[]
  onSelectTable: (table: Table) => void
  emptyMessage: string
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-xs text-muted-foreground">{count}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

export function MesaGrid({ tables, onSelectTable, emptyMessage }: MesaGridProps) {
  const occupied = tables.filter((table) => table.estado !== "libre")
  const free = tables.filter((table) => table.estado === "libre")

  if (tables.length === 0) return <EmptyState title={emptyMessage} />

  return (
    <div className="flex flex-col gap-8">
      {occupied.length > 0 && (
        <div>
          <SectionHeader label="Ocupadas" count={occupied.length} />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {occupied.map((table) => (
              <MesaCard key={table.id} table={table} onClick={onSelectTable} />
            ))}
          </div>
        </div>
      )}

      {free.length > 0 && (
        <div>
          <SectionHeader label="Libres" count={free.length} />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {free.map((table) => (
              <MesaCard key={table.id} table={table} onClick={onSelectTable} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
