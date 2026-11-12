import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createSupply as createSupplyService, getSupplies } from "@/services/insumos.service"
import type { CreateSupplyInput, Supply } from "@/types/insumo"

export function useInsumos() {
  const [supplies, setSupplies] = useState<Supply[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: true, failureMessage: "No se pudieron cargar los insumos" })

  const refetch = useCallback(() => run(async () => setSupplies(await getSupplies())), [run])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function createSupply(input: CreateSupplyInput) {
    const created = await createSupplyService(input)
    setSupplies((prev) => [...prev, created])
    return created
  }

  return { supplies, loading, error, refetch, createSupply }
}
