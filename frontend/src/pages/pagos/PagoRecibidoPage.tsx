import { CheckCircle2 } from "lucide-react"

/** Pantalla pública a la que Mercado Pago devuelve al cliente en su celular: no pide sesión. */
export default function PagoRecibidoPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <CheckCircle2 className="size-12 text-primary" aria-hidden />
      <h1 className="text-2xl font-semibold">¡Gracias!</h1>
      <p className="text-muted-foreground">Si el pago se acreditó, el local ya lo ve. Podés cerrar esta página.</p>
    </div>
  )
}
