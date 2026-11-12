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
  const { mesaId } = useParams<{ mesaId: string }>()
  const navigate = useNavigate()
  const { mesa, pedido, pago, loading, pending, error, aviso, puedeCobrar, pendienteDeLiberar, qr, esperandoCobro, cobrar, generarQr, cancelarQr, liberar, refetch } = usePago(mesaId!)
  const [pagaCon, setPagaCon] = useState("")
  const [linkCopiado, setLinkCopiado] = useState(false)
  const efectivoValido = pagaCon !== "" && Number.isFinite(Number(pagaCon)) && Number(pagaCon) > 0 && Number(pagaCon) >= (pedido?.total ?? 0)

  async function copiarLink() {
    if (!qr) return
    try {
      await navigator.clipboard.writeText(qr.checkoutUrl)
      setLinkCopiado(true)
      window.setTimeout(() => setLinkCopiado(false), 2000)
    } catch {
      // Sin permiso de portapapeles: el cajero puede usar el QR.
    }
  }

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
          {aviso && !error && <p role="status" className="text-sm text-muted-foreground">{aviso}</p>}
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
          ) : pedido && esperandoCobro ? (
            <>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cobrar con Mercado Pago</p>
                <p className="font-mono text-4xl">{formatCurrency(pedido.total)}</p>
              </div>
              {qr ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-xl bg-white p-4">
                    <QRCodeSVG value={qr.checkoutUrl} size={240} marginSize={0} title="QR de pago de Mercado Pago" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">El cliente escanea el QR con su celular y paga. Esta pantalla se actualiza sola cuando el pago se acredita.</p>
                  <Button variant="outline" size="sm" onClick={() => copiarLink()}>{linkCopiado ? "Link copiado" : "Copiar link de pago"}</Button>
                </div>
              ) : (
                <p role="status" className="text-center text-sm text-muted-foreground">Hay un cobro con Mercado Pago en curso para este pedido. Esperando el pago… Si el QR se perdió, generá uno nuevo.</p>
              )}
              <p role="status" className="text-center text-sm">Esperando el pago…</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" disabled={pending} onClick={() => cancelarQr()}>Cancelar cobro</Button>
                {!qr && <Button className="flex-1" disabled={pending} onClick={() => generarQr()}>Generar QR nuevo</Button>}
              </div>
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
              <div className="grid grid-cols-3 gap-3.5">
                <MetodoPagoCard metodo="efectivo" label="Cobrar efectivo" icon={Banknote} disabled={!puedeCobrar || !efectivoValido} onSelect={() => cobrar("efectivo", Number(pagaCon))} />
                <MetodoPagoCard metodo="tarjeta" label="Cobrar tarjeta" icon={CreditCard} disabled={!puedeCobrar} onSelect={() => cobrar("tarjeta")} />
                <MetodoPagoCard metodo="mercadopago" label="Mercado Pago" icon={Wallet} disabled={!puedeCobrar} onSelect={() => generarQr()} />
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
