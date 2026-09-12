import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Banknote, CreditCard } from "lucide-react"

import { MetodoPagoCard } from "@/components/pagos/MetodoPagoCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { formatCurrency } from "@/lib/utils"
import { createPago } from "@/services/pagos.service"
import { getPedidoPorMesa } from "@/services/pedidos.service"
import type { Pedido } from "@/types/pedido"
import type { MetodoPago } from "@/types/pago"

export default function PagoPage() {
  const { mesaId } = useParams<{ mesaId: string }>()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState<Pedido | null>(null)

  useEffect(() => {
    void getPedidoPorMesa(mesaId!).then(setPedido)
  }, [mesaId])

  async function handlePago(metodo: MetodoPago) {
    if (!pedido) return
    await createPago({ pedidoId: pedido.id, metodo })
    navigate("/mesas")
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Pago"
        subtitle={`Mesa ${mesaId} / Pedido /`}
        onBack={() => navigate(`/mesas/${mesaId}`)}
      />
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-xs text-muted-foreground">
              Total a cobrar
            </span>
            <span className="font-mono text-5xl font-medium tracking-tight">
              {formatCurrency(pedido?.total ?? 0)}
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-3.5">
            <MetodoPagoCard
              metodo="efectivo"
              label="Efectivo"
              icon={Banknote}
              disabled={!pedido}
              onSelect={handlePago}
            />
            <MetodoPagoCard
              metodo="tarjeta"
              label="Tarjeta"
              icon={CreditCard}
              disabled={!pedido}
              onSelect={handlePago}
            />
          </div>

          <p className="rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground">
            Al confirmar el pago la mesa se cierra y desaparece del listado de
            mesas activas.
          </p>
        </div>
      </div>
    </div>
  )
}
