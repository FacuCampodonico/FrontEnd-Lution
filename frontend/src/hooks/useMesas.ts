import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createMesa, getMesas } from "@/services/mesas.service"
import type { CrearMesaInput, Mesa } from "@/types/mesa"

export function useMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: true, failureMessage: "No se pudieron cargar las mesas" })

  const refetch = useCallback(() => run(async () => setMesas(await getMesas())), [run])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function crearMesa(input: CrearMesaInput) {
    const nueva = await createMesa(input)
    setMesas((prev) => [...prev, nueva])
    return nueva
  }

  return { mesas, loading, error, refetch, crearMesa }
}
