import { useNavigate, useParams } from "react-router-dom"

import { CatalogoProductos } from "@/components/mesas/CatalogoProductos"
import { PanelSeleccion } from "@/components/mesas/PanelSeleccion"
import { PageHeader } from "@/components/shared/PageHeader"
import { useMesaDetalle } from "@/hooks/useMesaDetalle"
import type { PedidoItem } from "@/types/pedido"

export default function MesaDetallePage() {
  const { mesaId } = useParams<{ mesaId: string }>()
  const navigate = useNavigate()
  const { mesa, pedido, catalogo, carrito, agregarAlCarrito, confirmarPedido } =
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
      <div className="flex flex-1 overflow-hidden">
        <CatalogoProductos productos={catalogo} onAgregar={agregarAlCarrito} />
        <PanelSeleccion
          items={itemsAMostrar}
          total={total}
          pedidoCreado={pedidoCreado}
          onCrearPedido={confirmarPedido}
          onPagar={() => navigate(`/mesas/${mesaId}/pago`)}
        />
      </div>
    </div>
  )
}
