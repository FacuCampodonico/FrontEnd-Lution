import { useNavigate, useParams } from "react-router-dom"

import { CatalogoProductos } from "@/components/mesas/CatalogoProductos"
import { PanelSeleccion } from "@/components/mesas/PanelSeleccion"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/PageHeader"
import { useAuth } from "@/hooks/useAuth"
import { useMesaDetalle } from "@/hooks/useMesaDetalle"
import type { PedidoItem } from "@/types/pedido"

export default function MesaDetallePage() {
  const { mesaId } = useParams<{ mesaId: string }>()
  const navigate = useNavigate()
  const { empleado } = useAuth()
  const { mesa, pedido, catalogo, carrito, loading, pending, bloqueado, error, refetch, agregarProducto, cambiarCantidad, quitarProducto, confirmarPedido } =
    useMesaDetalle(mesaId!)

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
          puedePagar={empleado?.nivel === "admin"}
          onCantidad={cambiarCantidad}
          onQuitar={quitarProducto}
          onCrearPedido={confirmarPedido}
          onPagar={() => navigate(`/mesas/${mesaId}/pago`)}
        />
      </div>
    </div>
  )
}
