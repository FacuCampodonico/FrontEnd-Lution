import { useCallback, useRef, useState } from "react"
import { errorMessage } from "@/lib/errors"

interface AsyncActionOptions {
  /** Start as pending, for data that loads on mount. */
  initialPending?: boolean
  /** Fixed message instead of the one the backend returns. */
  failureMessage?: string
}

export function useAsyncAction({ initialPending = false, failureMessage }: AsyncActionOptions = {}) {
  const locked = useRef(false)
  const [pending, setPending] = useState(initialPending)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (action: () => Promise<unknown>): Promise<boolean> => {
    if (locked.current) return false
    locked.current = true
    setPending(true)
    setError(null)
    try {
      await action()
      return true
    } catch (cause) {
      setError(failureMessage ?? errorMessage(cause))
      return false
    } finally {
      locked.current = false
      setPending(false)
    }
  }, [failureMessage])

  const clearError = useCallback(() => setError(null), [])

  return { pending, error, run, clearError }
}
