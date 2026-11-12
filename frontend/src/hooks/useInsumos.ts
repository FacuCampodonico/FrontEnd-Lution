import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createInsumo, getInsumos } from "@/services/insumos.service"
import type { CrearInsumoInput, Insumo } from "@/types/insumo"

export function useInsumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: true, failureMessage: "No se pudieron cargar los insumos" })

  const refetch = useCallback(() => run(async () => setInsumos(await getInsumos())), [run])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function crearInsumo(input: CrearInsumoInput) {
    const nuevo = await createInsumo(input)
    setInsumos((prev) => [...prev, nuevo])
    return nuevo
  }

  return { insumos, loading, error, refetch, crearInsumo }
}
