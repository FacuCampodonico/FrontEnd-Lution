import { useCallback, useEffect, useRef, useState } from "react"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { errorMessage, stockShortages } from "@/lib/errors"
import { getTable } from "@/services/mesas.service"
import { addItem, updateItem, removeItem, createOrder, cancelOrder as cancelOrderService, getOrderByTable } from "@/services/pedidos.service"
import { getProducts } from "@/services/productos.service"
import type { StockShortage } from "@/types/insumo"
import type { Table } from "@/types/mesa"
import type { Order } from "@/types/pedido"
import type { Product } from "@/types/producto"

export interface CartItem {
  product: Product
  quantity: number
}

type StockOperation = (allowWithoutStock: boolean) => Promise<Order>

/** Operation stopped for lack of stock, waiting for the user to decide whether to save it anyway. */
export interface StockWarning {
  shortages: StockShortage[]
  operation: StockOperation
}

export function useMesaDetalle(tableId: string, fixedEmployeeId?: string) {
  const [table, setTable] = useState<Table | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [catalog, setCatalog] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedEmployeeId, setEmployeeId] = useState("")
  // A waiter always takes the order under their own name; an admin picks the employee.
  const employeeId = fixedEmployeeId ?? selectedEmployeeId
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const [stockWarning, setStockWarning] = useState<StockWarning | null>(null)
  const action = useAsyncAction()
  const { clearError } = action
  const currentTableId = useRef(tableId)
  currentTableId.current = tableId

  const refetch = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    clearError()
    try {
      const [tableData, orderData, catalogData] = await Promise.all([
        getTable(tableId), getOrderByTable(tableId), getProducts(),
      ])
      if (currentTableId.current !== tableId) return
      setTable(tableData)
      setOrder(orderData)
      setCatalog(catalogData)
      setNeedsRefresh(false)
      if (orderData) setCart([])
    } catch (cause) {
      if (currentTableId.current === tableId) setLoadError(errorMessage(cause))
    } finally {
      if (currentTableId.current === tableId) setLoading(false)
    }
  }, [tableId, clearError])

  useEffect(() => {
    setTable(null)
    setOrder(null)
    setCart([])
    setEmployeeId("")
    setNeedsRefresh(false)
    setStockWarning(null)
    void refetch()
  }, [refetch])

  const locked = loading || loadError !== null || action.pending || needsRefresh || stockWarning !== null || !table || table.estado === "por_pagar" || order?.estado === "pagado"

  async function receiveOrder(updated: Order) {
    if (currentTableId.current !== tableId) return
    setOrder(updated)
    setCart([])
    setNeedsRefresh(true)
    try {
      const freshTable = await getTable(tableId)
      if (currentTableId.current !== tableId) return
      setTable(freshTable)
      setNeedsRefresh(false)
    } catch {
      throw new Error("El pedido se guardó, pero no se pudo actualizar la mesa. Recargá los datos antes de continuar.")
    }
  }

  // If the backend runs out of stock, keep the warning to ask the user instead of showing an error.
  async function withStockCheck(operation: StockOperation) {
    let updated: Order
    try {
      updated = await operation(false)
    } catch (cause) {
      const shortages = stockShortages(cause)
      if (!shortages) throw cause
      if (currentTableId.current === tableId) setStockWarning({ shortages, operation })
      return
    }
    await receiveOrder(updated)
  }

  async function confirmWithoutStock() {
    if (!stockWarning) return false
    const { operation } = stockWarning
    return action.run(async () => {
      const updated = await operation(true)
      // It's already saved: even if refreshing the table fails, don't offer to retry.
      setStockWarning(null)
      await receiveOrder(updated)
    })
  }

  function dismissStockWarning() {
    if (action.pending) return
    setStockWarning(null)
    clearError()
  }

  async function addProduct(product: Product) {
    if (locked) return
    if (order) {
      await action.run(() => withStockCheck((allowWithoutStock) =>
        addItem(order.id, { productoId: product.id, cantidad: 1 }, allowWithoutStock)))
      return
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      return existing
        ? prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { product, quantity: 1 }]
    })
  }

  async function changeQuantity(itemId: string, quantity: number) {
    if (locked || !Number.isSafeInteger(quantity) || quantity < 1) return
    if (order) {
      await action.run(() => withStockCheck((allowWithoutStock) =>
        updateItem(order.id, itemId, { cantidad: quantity }, allowWithoutStock)))
    } else {
      setCart((prev) => prev.map((item) => item.product.id === itemId ? { ...item, quantity } : item))
    }
  }

  async function removeProduct(itemId: string) {
    if (locked) return
    if (order) {
      await action.run(async () => receiveOrder(await removeItem(order.id, itemId)))
    } else {
      setCart((prev) => prev.filter((item) => item.product.id !== itemId))
    }
  }

  async function confirmOrder() {
    if (locked || order || cart.length === 0 || !employeeId) return
    const items = cart.map((item) => ({ productoId: item.product.id, cantidad: item.quantity }))
    await action.run(() => withStockCheck(async (allowWithoutStock) => {
      const created = await createOrder(tableId, items, employeeId, allowWithoutStock)
      if (created) return created
      setNeedsRefresh(true)
      const recovered = await getOrderByTable(tableId)
      if (!recovered) throw new Error("El backend no devolvió el pedido creado. Recargá los datos de la mesa antes de continuar.")
      return recovered
    }))
  }

  async function cancelOrder() {
    if (locked || !order) return false
    return action.run(async () => {
      await cancelOrderService(order.id)
      if (currentTableId.current !== tableId) return
      setOrder(null)
      setCart([])
      setEmployeeId("")
      setNeedsRefresh(true)
      try {
        const freshTable = await getTable(tableId)
        if (currentTableId.current !== tableId) return
        setTable(freshTable)
        setNeedsRefresh(false)
      } catch {
        throw new Error("El pedido se canceló, pero no se pudo actualizar la mesa. Recargá los datos antes de continuar.")
      }
    })
  }

  return {
    table, order, catalog, cart, employeeId, setEmployeeId, loading, pending: action.pending, locked,
    error: loadError ?? action.error, refetch, addProduct, changeQuantity,
    removeProduct, confirmOrder, cancelOrder, stockWarning, confirmWithoutStock, dismissStockWarning,
  }
}
