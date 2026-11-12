import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { CatalogoProductos } from "@/components/mesas/CatalogoProductos"
import { PanelSeleccion } from "@/components/mesas/PanelSeleccion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/shared/PageHeader"
import { useAuth } from "@/hooks/useAuth"
import { useEmpleados } from "@/hooks/useEmpleados"
import { useMesaDetalle } from "@/hooks/useMesaDetalle"
import type { OrderItem } from "@/types/pedido"

function formatQuantity(value: number) {
  return value.toLocaleString("es-AR", { maximumFractionDigits: 3 })
}

export default function MesaDetallePage() {
  const { tableId } = useParams<{ tableId: string }>()
  const navigate = useNavigate()
  const { employee } = useAuth()
  const isAdmin = employee?.nivel === "admin"
  const { table, order, catalog, cart, employeeId, setEmployeeId, loading, pending, locked, error, refetch, addProduct, changeQuantity, removeProduct, confirmOrder, cancelOrder, stockWarning, confirmWithoutStock, dismissStockWarning } =
    useMesaDetalle(tableId!, isAdmin ? undefined : employee?.id)
  const employees = useEmpleados(isAdmin)
  const [cancelOpen, setCancelOpen] = useState(false)

  async function handleConfirmCancel() {
    if (await cancelOrder()) setCancelOpen(false)
  }

  const orderCreated = order !== null

  const visibleItems: OrderItem[] = orderCreated
    ? order.items
    : cart.map((item) => ({
        id: item.product.id,
        productoId: item.product.id,
        productoNombre: item.product.nombre,
        precioUnitario: item.product.precio,
        cantidad: item.quantity,
      }))

  const total = orderCreated
    ? order.total
    : cart.reduce((acc, item) => acc + item.product.precio * item.quantity, 0)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={table ? `Mesa ${table.numero}` : "Mesa"}
        subtitle="Mesas /"
        onBack={() => navigate("/mesas")}
      />
      {loading && <p role="status" className="px-7">Cargando mesa…</p>}
      {error && <div className="px-7"><p role="alert" className="text-destructive">{error}</p><Button variant="outline" disabled={loading || pending} onClick={refetch}>Recargar datos</Button></div>}
      {table?.estado === "por_pagar" && <p role="status" className="px-7">El pedido ya fue cobrado, pero la mesa quedó pendiente de liberar.</p>}
      <div className="flex flex-1 overflow-hidden">
        <CatalogoProductos products={catalog} disabled={locked} onAdd={addProduct} />
        <PanelSeleccion
          items={visibleItems}
          total={total}
          orderCreated={orderCreated}
          disabled={locked}
          releasePending={table?.estado === "por_pagar"}
          isAdmin={isAdmin}
          employees={employees.employees.filter((employee) => employee.activo !== false)}
          employeesLoading={employees.loading}
          employeesError={employees.error}
          employeeId={order ? order.empleadoId ?? "" : employeeId}
          employeeName={order?.empleadoNombre ?? null}
          onEmployee={setEmployeeId}
          onQuantity={changeQuantity}
          onRemove={removeProduct}
          onCreateOrder={confirmOrder}
          onPay={() => navigate(`/mesas/${tableId}/pago`)}
          onCancelOrder={() => setCancelOpen(true)}
        />
      </div>

      <Dialog open={stockWarning !== null} onOpenChange={(value) => !value && dismissStockWarning()}>
        <DialogContent className="max-w-md" showCloseButton={!pending}>
          <DialogHeader>
            <DialogTitle>Stock insuficiente</DialogTitle>
            <DialogDescription>
              No alcanza el stock de algunos insumos. Si lo cargás igual, el stock queda en negativo.
            </DialogDescription>
          </DialogHeader>

          <ul className="divide-y rounded-md border">
            {stockWarning?.shortages.map((shortage) => (
              <li key={shortage.insumoId} className="flex flex-col gap-0.5 px-3 py-2">
                <span className="text-sm font-medium">{shortage.nombre}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  Hay {formatQuantity(shortage.disponible)} {shortage.unidad}, se necesitan {formatQuantity(shortage.necesario)} {shortage.unidad}
                </span>
              </li>
            ))}
          </ul>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" disabled={pending} onClick={dismissStockWarning}>
              Volver
            </Button>
            <Button disabled={pending} onClick={() => confirmWithoutStock()}>
              {pending ? "Cargando…" : "Cargar igual"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={(value) => !pending && setCancelOpen(value)}>
        <DialogContent className="max-w-sm" showCloseButton={!pending}>
          <DialogHeader>
            <DialogTitle>Cancelar pedido</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés cancelar el pedido de la{" "}
              <strong className="text-gray-900">{table ? `Mesa ${table.numero}` : "mesa"}</strong>? Se eliminan todos sus productos y la mesa queda libre. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => setCancelOpen(false)}
            >
              Volver
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={handleConfirmCancel}
            >
              {pending ? "Cancelando…" : "Cancelar pedido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
