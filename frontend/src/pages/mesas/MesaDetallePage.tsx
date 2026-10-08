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
import type { PedidoItem } from "@/types/pedido"

export default function MesaDetallePage() {
  const { mesaId } = useParams<{ mesaId: string }>()
  const navigate = useNavigate()
  const { empleado } = useAuth()
  const esAdmin = empleado?.nivel === "admin"
  const { mesa, pedido, catalogo, carrito, empleadoId, setEmpleadoId, loading, pending, bloqueado, error, refetch, agregarProducto, cambiarCantidad, quitarProducto, confirmarPedido, cancelarPedido } =
    useMesaDetalle(mesaId!, esAdmin ? undefined : empleado?.id)
  const empleados = useEmpleados(esAdmin)
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false)

  async function handleConfirmarCancelar() {
    if (await cancelarPedido()) setModalCancelarAbierto(false)
  }

  const pedidoCreado = pedido !== null

  const itemsAMostrar: PedidoItem[] = pedidoCreado
    ? pedido.items
    : carrito.map((item) => ({
        id: item.producto.id,
        productoId: item.producto.id,
        productoNombre: item.producto.nombre,
        precioUnitario: item.producto.precio,
        cantidad: item.cantidad,
      }))

  const total = pedidoCreado
    ? pedido.total
    : carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={mesa ? `Mesa ${mesa.numero}` : "Mesa"}
        subtitle="Mesas /"
        onBack={() => navigate("/mesas")}
      />
      {loading && <p role="status" className="px-7">Cargando mesa…</p>}
      {error && <div className="px-7"><p role="alert" className="text-destructive">{error}</p><Button variant="outline" disabled={loading || pending} onClick={refetch}>Recargar datos</Button></div>}
      {mesa?.estado === "por_pagar" && <p role="status" className="px-7">El pedido ya fue cobrado. La mesa está pendiente de cierre.</p>}
      <div className="flex flex-1 overflow-hidden">
        <CatalogoProductos productos={catalogo} disabled={bloqueado} onAgregar={agregarProducto} />
        <PanelSeleccion
          items={itemsAMostrar}
          total={total}
          pedidoCreado={pedidoCreado}
          disabled={bloqueado}
          cierrePendiente={mesa?.estado === "por_pagar"}
          esAdmin={esAdmin}
          empleados={empleados.empleados.filter((empleado) => empleado.activo !== false)}
          empleadosLoading={empleados.loading}
          empleadosError={empleados.error}
          empleadoId={pedido ? pedido.empleadoId ?? "" : empleadoId}
          empleadoNombre={pedido?.empleadoNombre ?? null}
          onEmpleado={setEmpleadoId}
          onCantidad={cambiarCantidad}
          onQuitar={quitarProducto}
          onCrearPedido={confirmarPedido}
          onPagar={() => navigate(`/mesas/${mesaId}/pago`)}
          onCancelarPedido={() => setModalCancelarAbierto(true)}
        />
      </div>

      <Dialog open={modalCancelarAbierto} onOpenChange={(value) => !pending && setModalCancelarAbierto(value)}>
        <DialogContent className="max-w-sm" showCloseButton={!pending}>
          <DialogHeader>
            <DialogTitle>Cancelar pedido</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que querés cancelar el pedido de la{" "}
              <strong className="text-gray-900">{mesa ? `Mesa ${mesa.numero}` : "mesa"}</strong>? Se eliminan todos sus productos y la mesa queda libre. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => setModalCancelarAbierto(false)}
            >
              Volver
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={handleConfirmarCancelar}
            >
              {pending ? "Cancelando…" : "Cancelar pedido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
