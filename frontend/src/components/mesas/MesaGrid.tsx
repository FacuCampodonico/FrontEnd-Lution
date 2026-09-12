import { MesaCard } from "@/components/mesas/MesaCard"
import type { Mesa } from "@/types/mesa"

interface MesaGridProps {
  mesas: Mesa[]
  onSelectMesa: (mesa: Mesa) => void
  onCreateMesa: () => void
}

export function MesaGrid({ mesas, onSelectMesa, onCreateMesa }: MesaGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      {mesas.map((mesa) => (
        <MesaCard key={mesa.id} mesa={mesa} onClick={onSelectMesa} />
      ))}
      <button
        type="button"
        onClick={onCreateMesa}
        className="flex min-h-[150px] items-center justify-center gap-2 rounded-xl border border-dashed text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
      >
        <span className="text-lg leading-none">+</span> Nueva mesa
      </button>
    </div>
  )
}
