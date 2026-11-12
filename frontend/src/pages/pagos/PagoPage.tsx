import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { QRCodeSVG } from "qrcode.react"
import { Banknote, CreditCard, Wallet } from "lucide-react"
import { MetodoPagoCard } from "@/components/pagos/MetodoPagoCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePago } from "@/hooks/usePago"
import { formatCurrency } from "@/lib/utils"

export default function PagoPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const navigate = useNavigate()
  const { table, order, payment, loading, pending, error, notice, canCharge, pendingRelease, qr, awaitingCharge, charge, generateQr, cancelQr, release, refetch } = usePago(tableId!)
  const [cashReceived, setCashReceived] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const isValidCash = cashReceived !== "" && Number.isFinite(Number(cashReceived)) && Number(cashReceived) > 0 && Number(cashReceived) >= (order?.total ?? 0)

  async function copyLink() {
    if (!qr) return
    try {
      await navigator.clipboard.writeText(qr.checkoutUrl)
      setLinkCopied(true)
      window.setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      // No clipboard permission: the cashier can use the QR.
    }
  }

  async function handleRelease() {
    if (await release()) navigate("/mesas")
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Pago" subtitle={`Mesa ${table?.numero ?? tableId}`} onBack={() => navigate(payment ? "/mesas" : `/mesas/${tableId}`)} />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-6">
          {loading && <p role="status">Cargando pago…</p>}
          {error && <p role="alert" className="text-destructive">{error}</p>}
          {notice && !error && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
          {error && !payment && <Button variant="outline" disabled={loading || pending} onClick={refetch}>Recargar datos</Button>}
          {payment ? (
            <>
              <p role="status">Pago registrado. La mesa quedó libre.</p>
              <div className="flex flex-col gap-1">
                <p>Total cobrado: {formatCurrency(payment.total)}</p>
                <p>Vuelto: <strong>{formatCurrency(payment.vuelto)}</strong></p>
              </div>
              <Button onClick={() => navigate("/mesas")}>Volver a mesas</Button>
            </>
          ) : pendingRelease ? (
            <>
              <p role="status">Esta mesa ya fue cobrada, pero quedó pendiente de liberar.</p>
              <Button disabled={pending} onClick={handleRelease}>{pending ? "Liberando…" : "Liberar mesa"}</Button>
            </>
          ) : order && awaitingCharge ? (
            <>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cobrar con Mercado Pago</p>
                <p className="font-mono text-4xl">{formatCurrency(order.total)}</p>
              </div>
              {qr ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-xl bg-white p-4">
                    <QRCodeSVG value={qr.checkoutUrl} size={240} marginSize={0} title="QR de pago de Mercado Pago" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">El cliente escanea el QR con su celular y paga. Esta pantalla se actualiza sola cuando el pago se acredita.</p>
                  <Button variant="outline" size="sm" onClick={() => copyLink()}>{linkCopied ? "Link copiado" : "Copiar link de pago"}</Button>
                </div>
              ) : (
                <p role="status" className="text-center text-sm text-muted-foreground">Hay un cobro con Mercado Pago en curso para este pedido. Esperando el pago… Si el QR se perdió, generá uno nuevo.</p>
              )}
              <p role="status" className="text-center text-sm">Esperando el pago…</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" disabled={pending} onClick={() => cancelQr()}>Cancelar cobro</Button>
                {!qr && <Button className="flex-1" disabled={pending} onClick={() => generateQr()}>Generar QR nuevo</Button>}
              </div>
            </>
          ) : order ? (
            <>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total a cobrar</p>
                <p className="font-mono text-4xl">{formatCurrency(order.total)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cash-received">Monto recibido en efectivo</Label>
                <Input id="cash-received" type="number" min="0.01" step="0.01" disabled={!canCharge} value={cashReceived} onChange={(event) => setCashReceived(event.target.value)} />
                {cashReceived !== "" && !isValidCash && <p className="text-sm text-destructive">El monto recibido debe cubrir el total y ser mayor que cero.</p>}
              </div>
              <div className="grid grid-cols-3 gap-3.5">
                <MetodoPagoCard method="cash" label="Cobrar efectivo" icon={Banknote} disabled={!canCharge || !isValidCash} onSelect={() => charge("cash", Number(cashReceived))} />
                <MetodoPagoCard method="card" label="Cobrar tarjeta" icon={CreditCard} disabled={!canCharge} onSelect={() => charge("card")} />
                <MetodoPagoCard method="mercadopago" label="Mercado Pago" icon={Wallet} disabled={!canCharge} onSelect={() => generateQr()} />
              </div>
              <p className="text-sm text-muted-foreground">Al cobrar, la mesa queda libre y se muestra el vuelto. Con Mercado Pago se muestra un QR para que el cliente pague desde su celular y el pago se confirma solo.</p>
            </>
          ) : !loading && <p>No hay un pedido abierto para cobrar.</p>}
          {pending && <p role="status">Procesando…</p>}
        </div>
      </div>
    </div>
  )
}
