const TOKEN_KEY = "lution.token"

export const SESSION_EXPIRED = "lution:session-expired"

let tokenInMemory: string | null = null

export function getToken(): string | null {
  if (tokenInMemory !== null) return tokenInMemory
  try {
    tokenInMemory = localStorage.getItem(TOKEN_KEY)
  } catch {
    // The session lasts as long as the tab.
  }
  return tokenInMemory
}

export function setToken(token: string) {
  tokenInMemory = token
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // The session lasts as long as the tab.
  }
}

export function clearToken() {
  tokenInMemory = null
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Nothing to clear.
  }
}
