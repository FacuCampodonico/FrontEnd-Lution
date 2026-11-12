import { useCallback, useEffect, useState } from "react"

import { useAsyncAction } from "@/hooks/useAsyncAction"
import { createTable as createTableService, getTables } from "@/services/mesas.service"
import type { CreateTableInput, Table } from "@/types/mesa"

export function useMesas() {
  const [tables, setTables] = useState<Table[]>([])
  const { pending: loading, error, run } = useAsyncAction({ initialPending: true, failureMessage: "No se pudieron cargar las mesas" })

  const refetch = useCallback(() => run(async () => setTables(await getTables())), [run])

  useEffect(() => {
    void refetch()
  }, [refetch])

  async function createTable(input: CreateTableInput) {
    const created = await createTableService(input)
    setTables((prev) => [...prev, created])
    return created
  }

  return { tables, loading, error, refetch, createTable }
}
