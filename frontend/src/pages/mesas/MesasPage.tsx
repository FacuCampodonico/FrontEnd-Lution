import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { CrearMesaModal } from "@/components/modales/CrearMesaModal"
import { MesaGrid } from "@/components/mesas/MesaGrid"
import { PageHeader } from "@/components/shared/PageHeader"
import { useMesas } from "@/hooks/useMesas"
import type { Mesa } from "@/types/mesa"

export default function MesasPage() {
  const { mesas, crearMesa } = useMesas()
  const [modalAbierto, setModalAbierto] = useState(false)
  const navigate = useNavigate()

  function handleSelectMesa(mesa: Mesa) {
    navigate(`/mesas/${mesa.id}`)
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Mesas activas"
        subtitle={`${mesas.length} abiertas`}
        actionLabel="Crear mesa"
        onAction={() => setModalAbierto(true)}
      />
      <div className="flex-1 overflow-y-auto p-7">
        <MesaGrid
          mesas={mesas}
          onSelectMesa={handleSelectMesa}
          onCreateMesa={() => setModalAbierto(true)}
        />
      </div>

      <CrearMesaModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        onSubmit={crearMesa}
      />
    </div>
  )
}
