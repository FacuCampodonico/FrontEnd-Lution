import type { AxiosRequestConfig, AxiosResponse } from "axios"

import {
  mockCategorias,
  mockEmpleados,
  mockInsumos,
  mockMesas,
  mockPagos,
  mockPedidos,
  mockProductos,
} from "@/lib/mockData"
import type { Categoria, CrearCategoriaInput } from "@/types/categoria"
import type { CrearEmpleadoInput, Empleado } from "@/types/empleado"
import type { CrearInsumoInput, Insumo } from "@/types/insumo"
import type { CrearMesaInput, Mesa } from "@/types/mesa"
import type { CrearPagoInput } from "@/types/pago"
import type { AgregarItemInput, Pedido, PedidoItem } from "@/types/pedido"
import type { CrearProductoInput, Producto } from "@/types/producto"

const DELAY_MS = 350
let idSeq = 1000
const nextId = (prefix: string) => `${prefix}-${idSeq++}`

function respond<T>(config: AxiosRequestConfig, data: T, status = 200): Promise<AxiosResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        status,
        statusText: "OK",
        headers: {},
        config: config as AxiosResponse<T>["config"],
      })
    }, DELAY_MS)
  })
}

function readBody<T>(config: AxiosRequestConfig): T {
  if (!config.data) return {} as T
  return typeof config.data === "string" ? JSON.parse(config.data) : config.data
}

function calcularTotal(items: PedidoItem[]): number {
  return items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0)
}

function recalcularMesa(mesa: Mesa, pedido: Pedido) {
  mesa.pedidoActualId = pedido.id
  mesa.totalActual = pedido.total
  mesa.cantidadItems = pedido.items.reduce((acc, item) => acc + item.cantidad, 0)
  if (mesa.estado === "libre") mesa.estado = "abierta"
}

export async function mockAdapter(config: AxiosRequestConfig): Promise<AxiosResponse> {
  const method = (config.method ?? "get").toLowerCase()
  const url = config.url ?? ""

  const pedidoPorMesa = url.match(/^\/mesas\/([^/]+)\/pedido$/)
  if (pedidoPorMesa) {
    const mesaId = pedidoPorMesa[1]
    if (method === "get") {
      const pedido = mockPedidos.find((p) => p.mesaId === mesaId && p.estado === "abierto")
      return respond(config, pedido ?? null)
    }
    if (method === "post") {
      const mesa = mockMesas.find((m) => m.id === mesaId)
      if (!mesa) return Promise.reject(new Error(`Mesa ${mesaId} no encontrada`))
      const { items } = readBody<{ items: AgregarItemInput[] }>(config)
      const pedidoItems: PedidoItem[] = items.map((item) => {
        const producto = mockProductos.find((p) => p.id === item.productoId)
        return {
          id: nextId("item"),
          productoId: item.productoId,
          productoNombre: producto?.nombre ?? "Producto",
          precioUnitario: producto?.precio ?? 0,
          cantidad: item.cantidad,
        }
      })
      const nuevoPedido: Pedido = {
        id: nextId("pedido"),
        mesaId,
        items: pedidoItems,
        total: calcularTotal(pedidoItems),
        estado: "abierto",
      }
      mockPedidos.push(nuevoPedido)
      recalcularMesa(mesa, nuevoPedido)
      return respond(config, nuevoPedido, 201)
    }
  }

  const itemDePedido = url.match(/^\/pedidos\/([^/]+)\/items\/([^/]+)$/)
  if (itemDePedido && method === "delete") {
    const [, pedidoId, itemId] = itemDePedido
    const pedido = mockPedidos.find((p) => p.id === pedidoId)
    if (!pedido) return Promise.reject(new Error(`Pedido ${pedidoId} no encontrado`))
    pedido.items = pedido.items.filter((item) => item.id !== itemId)
    pedido.total = calcularTotal(pedido.items)
    const mesa = mockMesas.find((m) => m.id === pedido.mesaId)
    if (mesa) recalcularMesa(mesa, pedido)
    return respond(config, pedido)
  }

  const itemsDePedido = url.match(/^\/pedidos\/([^/]+)\/items$/)
  if (itemsDePedido && method === "post") {
    const pedidoId = itemsDePedido[1]
    const pedido = mockPedidos.find((p) => p.id === pedidoId)
    if (!pedido) return Promise.reject(new Error(`Pedido ${pedidoId} no encontrado`))
    const input = readBody<AgregarItemInput>(config)
    const producto = mockProductos.find((p) => p.id === input.productoId)
    const existente = pedido.items.find((item) => item.productoId === input.productoId)
    if (existente) {
      existente.cantidad += input.cantidad
    } else {
      pedido.items.push({
        id: nextId("item"),
        productoId: input.productoId,
        productoNombre: producto?.nombre ?? "Producto",
        precioUnitario: producto?.precio ?? 0,
        cantidad: input.cantidad,
      })
    }
    pedido.total = calcularTotal(pedido.items)
    const mesa = mockMesas.find((m) => m.id === pedido.mesaId)
    if (mesa) recalcularMesa(mesa, pedido)
    return respond(config, pedido)
  }

  const mesaPorId = url.match(/^\/mesas\/([^/]+)$/)
  if (mesaPorId && method === "get") {
    const mesa = mockMesas.find((m) => m.id === mesaPorId[1])
    if (!mesa) return Promise.reject(new Error(`Mesa ${mesaPorId[1]} no encontrada`))
    return respond(config, mesa)
  }

  if (url === "/mesas" && method === "get") {
    return respond(config, [...mockMesas])
  }
  if (url === "/mesas" && method === "post") {
    const input = readBody<CrearMesaInput>(config)
    const nueva: Mesa = {
      id: nextId("mesa"),
      numero: input.numero,
      estado: "libre",
      pedidoActualId: null,
      totalActual: 0,
      cantidadItems: 0,
    }
    mockMesas.push(nueva)
    return respond(config, nueva, 201)
  }

  if (url === "/categorias" && method === "get") {
    return respond(config, [...mockCategorias])
  }
  if (url === "/categorias" && method === "post") {
    const input = readBody<CrearCategoriaInput>(config)
    const nueva: Categoria = {
      id: nextId("cat"),
      nombre: input.nombre,
      productoIds: input.productoIds ?? [],
    }
    mockCategorias.push(nueva)
    return respond(config, nueva, 201)
  }

  if (url === "/insumos" && method === "get") {
    return respond(config, [...mockInsumos])
  }
  if (url === "/insumos" && method === "post") {
    const input = readBody<CrearInsumoInput>(config)
    const nuevo: Insumo = {
      id: nextId("ins"),
      nombre: input.nombre,
      stock: input.stock,
      unidad: input.unidad,
    }
    mockInsumos.push(nuevo)
    return respond(config, nuevo, 201)
  }

  if (url === "/empleados" && method === "get") {
    return respond(config, [...mockEmpleados])
  }
  if (url === "/empleados" && method === "post") {
    const input = readBody<CrearEmpleadoInput>(config)
    const nuevo: Empleado = {
      id: nextId("emp"),
      nombre: input.nombre,
      apellido: input.apellido,
      rol: input.rol,
      activo: true,
    }
    mockEmpleados.push(nuevo)
    return respond(config, nuevo, 201)
  }

  if (url === "/productos" && method === "get") {
    return respond(config, [...mockProductos])
  }
  if (url === "/productos" && method === "post") {
    const input = readBody<CrearProductoInput>(config)
    const categoria = mockCategorias.find((c) => c.id === input.categoriaId)
    const nuevo: Producto = {
      id: nextId("prod"),
      nombre: input.nombre,
      precio: input.precio,
      categoriaId: input.categoriaId,
      categoriaNombre: categoria?.nombre ?? "Sin categoría",
      insumoIds: input.insumoIds,
    }
    mockProductos.push(nuevo)
    if (categoria) categoria.productoIds.push(nuevo.id)
    return respond(config, nuevo, 201)
  }

  if (url === "/pagos" && method === "post") {
    const input = readBody<CrearPagoInput>(config)
    const pedido = mockPedidos.find((p) => p.id === input.pedidoId)
    if (!pedido) return Promise.reject(new Error(`Pedido ${input.pedidoId} no encontrado`))
    pedido.estado = "pagado"
    const mesa = mockMesas.find((m) => m.pedidoActualId === pedido.id)
    if (mesa) {
      mesa.estado = "libre"
      mesa.pedidoActualId = null
      mesa.totalActual = 0
      mesa.cantidadItems = 0
    }
    const nuevo = {
      id: nextId("pago"),
      pedidoId: input.pedidoId,
      metodo: input.metodo,
      monto: pedido.total,
      fecha: new Date().toISOString(),
    }
    mockPagos.push(nuevo)
    return respond(config, nuevo, 201)
  }

  return Promise.reject(new Error(`Mock no implementado para ${method.toUpperCase()} ${url}`))
}
