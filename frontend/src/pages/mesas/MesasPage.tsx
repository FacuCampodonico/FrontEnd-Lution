import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { CrearMesaModal } from "@/components/modales/CrearMesaModal"
import { MesaGrid } from "@/components/mesas/MesaGrid"
import { PageHeader } from "@/components/shared/PageHeader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMesas } from "@/hooks/useMesas"
import type { Mesa } from "@/types/mesa"

type FiltroMesa = "todas" | "libres" | "ocupadas"

const MENSAJE_VACIO: Record<FiltroMesa, string> = {
  todas: "Todavía no hay mesas.",
  libres: "No hay mesas libres.",
  ocupadas: "No hay mesas ocupadas.",
}

function coincideConFiltro(mesa: Mesa, filtro: FiltroMesa) {
  if (filtro === "libres") return mesa.estado === "libre"
  if (filtro === "ocupadas") return mesa.estado !== "libre"
  return true
}

export default function MesasPage() {
  const { mesas, loading, error, crearMesa } = useMesas()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [filtro, setFiltro] = useState<FiltroMesa>("todas")
  const navigate = useNavigate()

  const ocupadas = mesas.filter((mesa) => mesa.estado !== "libre").length
  const mesasFiltradas = mesas.filter((mesa) => coincideConFiltro(mesa, filtro))

  function handleSelectMesa(mesa: Mesa) {
    navigate(`/mesas/${mesa.id}`)
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Mesas activas"
        subtitle={`${ocupadas} ocupadas de ${mesas.length}`}
        actionLabel="Crear mesa"
        onAction={() => setModalAbierto(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        {loading && <p role="status">Cargando…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Select value={filtro} onValueChange={(value) => setFiltro(value as FiltroMesa)}>
                <SelectTrigger aria-label="Filtrar por estado" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las mesas</SelectItem>
                  <SelectItem value="libres">Libres</SelectItem>
                  <SelectItem value="ocupadas">Ocupadas</SelectItem>
                </SelectContent>
              </Select>
              {filtro !== "todas" && (
                <span className="font-mono text-xs text-muted-foreground">{mesasFiltradas.length} de {mesas.length}</span>
              )}
            </div>
            <MesaGrid mesas={mesasFiltradas} onSelectMesa={handleSelectMesa} emptyMessage={MENSAJE_VACIO[filtro]} />
          </>
        )}
      </div>

      <CrearMesaModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        onSubmit={crearMesa}
      />
    </div>
  )
}
