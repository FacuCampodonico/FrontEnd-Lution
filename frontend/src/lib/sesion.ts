const TOKEN_KEY = "lution.token"

export const SESION_EXPIRADA = "lution:sesion-expirada"

let tokenEnMemoria: string | null = null

export function getToken(): string | null {
  if (tokenEnMemoria !== null) return tokenEnMemoria
  try {
    tokenEnMemoria = localStorage.getItem(TOKEN_KEY)
  } catch {
    // La sesión dura lo que la pestaña.
  }
  return tokenEnMemoria
}

export function setToken(token: string) {
  tokenEnMemoria = token
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // La sesión dura lo que la pestaña.
  }
}

export function clearToken() {
  tokenEnMemoria = null
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Nada que limpiar.
  }
}
