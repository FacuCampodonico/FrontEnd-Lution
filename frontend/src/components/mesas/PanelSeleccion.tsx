import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { SeleccionItem } from "@/components/mesas/SeleccionItem"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { Empleado } from "@/types/empleado"
import type { PedidoItem } from "@/types/pedido"

interface PanelSeleccionProps {
  items: PedidoItem[]
  total: number
  pedidoCreado: boolean
  disabled: boolean
  cierrePendiente: boolean
  empleados: Empleado[]
  empleadosLoading: boolean
  empleadosError: string | null
  empleadoId: string
  empleadoNombre: string | null
  onEmpleado: (empleadoId: string) => void
  onCantidad: (itemId: string, cantidad: number) => Promise<unknown>
  onQuitar: (itemId: string) => Promise<unknown>
  onCrearPedido: () => Promise<unknown>
  onPagar: () => void
  onCancelarPedido: () => void
}

export function PanelSeleccion({
  items,
  total,
  pedidoCreado,
  disabled,
  cierrePendiente,
  empleados,
  empleadosLoading,
  empleadosError,
  empleadoId,
  empleadoNombre,
  onEmpleado,
  onCantidad,
  onQuitar,
  onCrearPedido,
  onPagar,
  onCancelarPedido,
}: PanelSeleccionProps) {
  return (
    <aside className="flex w-[400px] shrink-0 flex-col gap-3.5 border-l bg-background p-6">
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Selección
      </h2>

      {items.length === 0 ? (
        <EmptyState title="Agregá productos del catálogo." />
      ) : (
        <div className="flex flex-col">
          {items.map((item) => (
            <SeleccionItem key={item.id} item={item} disabled={disabled} onCantidad={onCantidad} onQuitar={onQuitar} />
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3.5">
        <div className="flex items-baseline justify-between border-t pt-3.5">
          <span className="text-sm font-semibold">Total</span>
          <span className="font-mono text-2xl font-medium tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {!cierrePendiente && (
              <Select disabled={disabled || pedidoCreado || empleadosLoading || !empleados.length} value={empleadoId} onValueChange={onEmpleado}>
                <SelectTrigger aria-label="Empleado que toma el pedido" className="h-10 min-w-0 flex-1">
                  <SelectValue placeholder={pedidoCreado ? empleadoNombre ?? "Sin empleado" : empleadosLoading ? "Cargando empleados…" : empleados.length ? "Elegir empleado" : "No hay empleados"} />
                </SelectTrigger>
                <SelectContent>{empleados.map((empleado) => <SelectItem key={empleado.id} value={empleado.id}>{`${empleado.nombre} ${empleado.apellido}`.trim()}</SelectItem>)}</SelectContent>
              </Select>
            )}
            {pedidoCreado && !cierrePendiente ? (
              <Button
                size="lg"
                variant="outline"
                className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={disabled}
                onClick={onCancelarPedido}
              >
                Cancelar pedido
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1"
                disabled={disabled || pedidoCreado || cierrePendiente || items.length === 0 || !empleadoId}
                onClick={() => { void onCrearPedido() }}
              >
                Crear pedido
              </Button>
            )}
          </div>
          {!pedidoCreado && !cierrePendiente && empleadosError && (
            <p role="alert" className="text-xs text-destructive">{empleadosError}</p>
          )}
          <Button
            size="lg"
            variant="secondary"
            disabled={(!cierrePendiente && (!pedidoCreado || items.length === 0)) || (disabled && !cierrePendiente)}
            onClick={onPagar}
          >
            {cierrePendiente ? "Continuar al cierre" : "Pagar"}
          </Button>
          {!pedidoCreado && !cierrePendiente && (
            <p className="text-center font-mono text-xs text-muted-foreground">
              Pagar se habilita al crear el pedido
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
