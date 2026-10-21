import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Banknote, CreditCard } from "lucide-react"
import { MetodoPagoCard } from "@/components/pagos/MetodoPagoCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePago } from "@/hooks/usePago"
import { formatCurrency } from "@/lib/utils"

export default function PagoPage() {
  const { mesaId } = useParams<{ mesaId: string }>()
  const navigate = useNavigate()
  const { mesa, pedido, pago, loading, pending, error, puedeCobrar, pendienteDeLiberar, cobrar, liberar, refetch } = usePago(mesaId!)
  const [pagaCon, setPagaCon] = useState("")
  const efectivoValido = pagaCon !== "" && Number.isFinite(Number(pagaCon)) && Number(pagaCon) > 0 && Number(pagaCon) >= (pedido?.total ?? 0)

  async function handleLiberar() {
    if (await liberar()) navigate("/mesas")
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Pago" subtitle={`Mesa ${mesa?.numero ?? mesaId}`} onBack={() => navigate(pago ? "/mesas" : `/mesas/${mesaId}`)} />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-6">
          {loading && <p role="status">Cargando pago…</p>}
          {error && <p role="alert" className="text-destructive">{error}</p>}
          {error && !pago && <Button variant="outline" disabled={loading || pending} onClick={refetch}>Recargar datos</Button>}
          {pago ? (
            <>
              <p role="status">Pago registrado. La mesa quedó libre.</p>
              <div className="flex flex-col gap-1">
                <p>Total cobrado: {formatCurrency(pago.total)}</p>
                <p>Vuelto: <strong>{formatCurrency(pago.vuelto)}</strong></p>
              </div>
              <Button onClick={() => navigate("/mesas")}>Volver a mesas</Button>
            </>
          ) : pendienteDeLiberar ? (
            <>
              <p role="status">Esta mesa ya fue cobrada, pero quedó pendiente de liberar.</p>
              <Button disabled={pending} onClick={handleLiberar}>{pending ? "Liberando…" : "Liberar mesa"}</Button>
            </>
          ) : pedido ? (
            <>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total a cobrar</p>
                <p className="font-mono text-4xl">{formatCurrency(pedido.total)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="paga-con">Monto recibido en efectivo</Label>
                <Input id="paga-con" type="number" min="0.01" step="0.01" disabled={!puedeCobrar} value={pagaCon} onChange={(event) => setPagaCon(event.target.value)} />
                {pagaCon !== "" && !efectivoValido && <p className="text-sm text-destructive">El monto recibido debe cubrir el total y ser mayor que cero.</p>}
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <MetodoPagoCard metodo="efectivo" label="Cobrar efectivo" icon={Banknote} disabled={!puedeCobrar || !efectivoValido} onSelect={(metodo) => { void cobrar(metodo, Number(pagaCon)) }} />
                <MetodoPagoCard metodo="tarjeta" label="Cobrar tarjeta" icon={CreditCard} disabled={!puedeCobrar} onSelect={(metodo) => { void cobrar(metodo) }} />
              </div>
              <p className="text-sm text-muted-foreground">Al cobrar, la mesa queda libre y se muestra el vuelto.</p>
            </>
          ) : !loading && <p>No hay un pedido abierto para cobrar.</p>}
          {pending && <p role="status">Procesando…</p>}
        </div>
      </div>
    </div>
  )
}
