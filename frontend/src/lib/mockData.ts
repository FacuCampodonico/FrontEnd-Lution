import type { Categoria } from "@/types/categoria"
import type { Empleado } from "@/types/empleado"
import type { Insumo } from "@/types/insumo"
import type { Mesa } from "@/types/mesa"
import type { Pago } from "@/types/pago"
import type { Pedido } from "@/types/pedido"
import type { Producto } from "@/types/producto"

export const mockInsumos: Insumo[] = [
  { id: "ins-1", nombre: "Harina 000", stock: 25, unidad: "kg" },
  { id: "ins-2", nombre: "Muzzarella", stock: 12, unidad: "kg" },
  { id: "ins-3", nombre: "Carne picada", stock: 18, unidad: "kg" },
  { id: "ins-4", nombre: "Papa", stock: 40, unidad: "kg" },
  { id: "ins-5", nombre: "Tomate", stock: 15, unidad: "kg" },
  { id: "ins-6", nombre: "Lechuga", stock: 10, unidad: "kg" },
  { id: "ins-7", nombre: "Coca-Cola 354ml", stock: 60, unidad: "latas" },
  { id: "ins-8", nombre: "Malbec reserva", stock: 24, unidad: "unidades" },
]

export const mockProductos: Producto[] = [
  { id: "prod-1", nombre: "Papas fritas", precio: 3200, categoriaId: "cat-1", categoriaNombre: "Entradas", insumoIds: ["ins-4"] },
  { id: "prod-2", nombre: "Provoleta", precio: 3800, categoriaId: "cat-1", categoriaNombre: "Entradas", insumoIds: ["ins-2"] },
  { id: "prod-7", nombre: "Ensalada mixta", precio: 3400, categoriaId: "cat-1", categoriaNombre: "Entradas", insumoIds: ["ins-5", "ins-6"] },
  { id: "prod-3", nombre: "Milanesa con papas", precio: 7200, categoriaId: "cat-2", categoriaNombre: "Platos principales", insumoIds: ["ins-3", "ins-4"] },
  { id: "prod-4", nombre: "Bife de chorizo", precio: 9500, categoriaId: "cat-2", categoriaNombre: "Platos principales", insumoIds: ["ins-3"] },
  { id: "prod-5", nombre: "Pizza muzzarella", precio: 6800, categoriaId: "cat-3", categoriaNombre: "Pizzas", insumoIds: ["ins-1", "ins-2", "ins-5"] },
  { id: "prod-6", nombre: "Pizza napolitana", precio: 7300, categoriaId: "cat-3", categoriaNombre: "Pizzas", insumoIds: ["ins-1", "ins-2", "ins-5"] },
  { id: "prod-8", nombre: "Coca-Cola 354ml", precio: 1500, categoriaId: "cat-4", categoriaNombre: "Bebidas", insumoIds: ["ins-7"] },
  { id: "prod-9", nombre: "Copa de Malbec", precio: 2600, categoriaId: "cat-4", categoriaNombre: "Bebidas", insumoIds: ["ins-8"] },
  { id: "prod-10", nombre: "Flan casero", precio: 2400, categoriaId: "cat-5", categoriaNombre: "Postres", insumoIds: [] },
]

export const mockCategorias: Categoria[] = [
  { id: "cat-1", nombre: "Entradas", productoIds: ["prod-1", "prod-2", "prod-7"] },
  { id: "cat-2", nombre: "Platos principales", productoIds: ["prod-3", "prod-4"] },
  { id: "cat-3", nombre: "Pizzas", productoIds: ["prod-5", "prod-6"] },
  { id: "cat-4", nombre: "Bebidas", productoIds: ["prod-8", "prod-9"] },
  { id: "cat-5", nombre: "Postres", productoIds: ["prod-10"] },
]

export const mockEmpleados: Empleado[] = [
  { id: "emp-1", nombre: "Sofía", apellido: "Martínez", rol: "admin", activo: true },
  { id: "emp-2", nombre: "Lucas", apellido: "Fernández", rol: "mozo", activo: true },
  { id: "emp-3", nombre: "Martina", apellido: "Gómez", rol: "mozo", activo: true },
  { id: "emp-4", nombre: "Nicolás", apellido: "Pereyra", rol: "mozo", activo: false },
  { id: "emp-5", nombre: "Camila", apellido: "Rodríguez", rol: "mozo", activo: true },
]

export const mockPedidos: Pedido[] = [
  {
    id: "pedido-1",
    mesaId: "mesa-2",
    estado: "abierto",
    items: [
      { id: "item-1", productoId: "prod-5", productoNombre: "Pizza muzzarella", precioUnitario: 6800, cantidad: 1 },
      { id: "item-2", productoId: "prod-8", productoNombre: "Coca-Cola 354ml", precioUnitario: 1500, cantidad: 2 },
    ],
    total: 9800,
  },
  {
    id: "pedido-2",
    mesaId: "mesa-4",
    estado: "abierto",
    items: [
      { id: "item-3", productoId: "prod-3", productoNombre: "Milanesa con papas", precioUnitario: 7200, cantidad: 2 },
      { id: "item-4", productoId: "prod-9", productoNombre: "Copa de Malbec", precioUnitario: 2600, cantidad: 2 },
    ],
    total: 19600,
  },
  {
    id: "pedido-3",
    mesaId: "mesa-5",
    estado: "abierto",
    items: [
      { id: "item-5", productoId: "prod-2", productoNombre: "Provoleta", precioUnitario: 3800, cantidad: 1 },
      { id: "item-6", productoId: "prod-4", productoNombre: "Bife de chorizo", precioUnitario: 9500, cantidad: 1 },
      { id: "item-7", productoId: "prod-10", productoNombre: "Flan casero", precioUnitario: 2400, cantidad: 1 },
    ],
    total: 15700,
  },
  {
    id: "pedido-4",
    mesaId: "mesa-8",
    estado: "abierto",
    items: [
      { id: "item-8", productoId: "prod-1", productoNombre: "Papas fritas", precioUnitario: 3200, cantidad: 1 },
      { id: "item-9", productoId: "prod-8", productoNombre: "Coca-Cola 354ml", precioUnitario: 1500, cantidad: 3 },
    ],
    total: 7700,
  },
]

export const mockMesas: Mesa[] = [
  { id: "mesa-1", numero: "1", estado: "libre", pedidoActualId: null, totalActual: 0, cantidadItems: 0 },
  { id: "mesa-2", numero: "2", estado: "abierta", pedidoActualId: "pedido-1", totalActual: 9800, cantidadItems: 3 },
  { id: "mesa-3", numero: "3", estado: "libre", pedidoActualId: null, totalActual: 0, cantidadItems: 0 },
  { id: "mesa-4", numero: "4", estado: "por_pagar", pedidoActualId: "pedido-2", totalActual: 19600, cantidadItems: 4 },
  { id: "mesa-5", numero: "5", estado: "abierta", pedidoActualId: "pedido-3", totalActual: 15700, cantidadItems: 3 },
  { id: "mesa-6", numero: "6", estado: "libre", pedidoActualId: null, totalActual: 0, cantidadItems: 0 },
  { id: "mesa-7", numero: "7", estado: "libre", pedidoActualId: null, totalActual: 0, cantidadItems: 0 },
  { id: "mesa-8", numero: "8", estado: "abierta", pedidoActualId: "pedido-4", totalActual: 7700, cantidadItems: 4 },
]

export const mockPagos: Pago[] = []
