import { useCallback, useRef, useState } from "react"
import { errorMessage } from "@/lib/errors"

export function useAsyncAction() {
  const locked = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run(action: () => Promise<unknown>): Promise<boolean> {
    if (locked.current) return false
    locked.current = true
    setPending(true)
    setError(null)
    try {
      await action()
      return true
    } catch (cause) {
      setError(errorMessage(cause))
      return false
    } finally {
      locked.current = false
      setPending(false)
    }
  }

  const clearError = useCallback(() => setError(null), [])

  return { pending, error, run, clearError }
}
