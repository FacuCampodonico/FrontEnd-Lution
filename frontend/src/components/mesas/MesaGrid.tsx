import { MesaCard } from "@/components/mesas/MesaCard"
import { EmptyState } from "@/components/shared/EmptyState"
import type { Mesa } from "@/types/mesa"

interface MesaGridProps {
  mesas: Mesa[]
  onSelectMesa: (mesa: Mesa) => void
  emptyMessage: string
}

function SeccionHeader({ label, count }: { label: string; count: number }) {
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

export function MesaGrid({ mesas, onSelectMesa, emptyMessage }: MesaGridProps) {
  const ocupadas = mesas.filter((mesa) => mesa.estado !== "libre")
  const libres = mesas.filter((mesa) => mesa.estado === "libre")

  if (mesas.length === 0) return <EmptyState title={emptyMessage} />

  return (
    <div className="flex flex-col gap-8">
      {ocupadas.length > 0 && (
        <div>
          <SeccionHeader label="Ocupadas" count={ocupadas.length} />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {ocupadas.map((mesa) => (
              <MesaCard key={mesa.id} mesa={mesa} onClick={onSelectMesa} />
            ))}
          </div>
        </div>
      )}

      {libres.length > 0 && (
        <div>
          <SeccionHeader label="Libres" count={libres.length} />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {libres.map((mesa) => (
              <MesaCard key={mesa.id} mesa={mesa} onClick={onSelectMesa} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
