import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { SeleccionItem } from "@/components/mesas/SeleccionItem"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { Employee } from "@/types/empleado"
import type { OrderItem } from "@/types/pedido"

interface PanelSeleccionProps {
  items: OrderItem[]
  total: number
  orderCreated: boolean
  disabled: boolean
  releasePending: boolean
  /** Enables picking the employee, cancelling the order and charging. */
  isAdmin: boolean
  employees: Employee[]
  employeesLoading: boolean
  employeesError: string | null
  employeeId: string
  employeeName: string | null
  onEmployee: (employeeId: string) => void
  onQuantity: (itemId: string, quantity: number) => Promise<unknown>
  onRemove: (itemId: string) => Promise<unknown>
  onCreateOrder: () => Promise<unknown>
  onPay: () => void
  onCancelOrder: () => void
}

export function PanelSeleccion({
  items,
  total,
  orderCreated,
  disabled,
  releasePending,
  isAdmin,
  employees,
  employeesLoading,
  employeesError,
  employeeId,
  employeeName,
  onEmployee,
  onQuantity,
  onRemove,
  onCreateOrder,
  onPay,
  onCancelOrder,
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
            <SeleccionItem key={item.id} item={item} disabled={disabled} onQuantity={onQuantity} onRemove={onRemove} />
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
            {isAdmin && !releasePending && (
              <Select disabled={disabled || orderCreated || employeesLoading || !employees.length} value={employeeId} onValueChange={onEmployee}>
                <SelectTrigger aria-label="Empleado que toma el pedido" className="h-10 min-w-0 flex-1">
                  <SelectValue placeholder={orderCreated ? employeeName ?? "Sin empleado" : employeesLoading ? "Cargando empleados…" : employees.length ? "Elegir empleado" : "No hay empleados"} />
                </SelectTrigger>
                <SelectContent>{employees.map((employee) => <SelectItem key={employee.id} value={employee.id}>{`${employee.nombre} ${employee.apellido}`.trim()}</SelectItem>)}</SelectContent>
              </Select>
            )}
            {isAdmin && orderCreated && !releasePending ? (
              <Button
                size="lg"
                variant="outline"
                className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={disabled}
                onClick={onCancelOrder}
              >
                Cancelar pedido
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1"
                disabled={disabled || orderCreated || releasePending || items.length === 0 || !employeeId}
                onClick={() => onCreateOrder()}
              >
                Crear pedido
              </Button>
            )}
          </div>
          {isAdmin && !orderCreated && !releasePending && employeesError && (
            <p role="alert" className="text-xs text-destructive">{employeesError}</p>
          )}
          {isAdmin ? (
            <>
              <Button
                size="lg"
                variant="secondary"
                disabled={(!releasePending && (!orderCreated || items.length === 0)) || (disabled && !releasePending)}
                onClick={onPay}
              >
                {releasePending ? "Liberar mesa" : "Pagar"}
              </Button>
              {!orderCreated && !releasePending && (
                <p className="text-center font-mono text-xs text-muted-foreground">
                  Pagar se habilita al crear el pedido
                </p>
              )}
            </>
          ) : (
            (orderCreated || releasePending) && (
              <p className="text-center font-mono text-xs text-muted-foreground">
                El cobro lo hace un administrador
              </p>
            )
          )}
        </div>
      </div>
    </aside>
  )
}
