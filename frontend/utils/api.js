export async function decodeJwt(token) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch (e) {
    return null
  }
}

async function refreshTokens() {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  if (!refreshToken || !userId) return false
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: Number(userId), refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken)
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken)
    }
    return true
  } catch (e) {
    console.warn('refreshTokens failed', e)
    return false
  }
}

export async function apiFetch(path, options = {}) {
  const headers = options.headers || {}
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  if (token) headers['Authorization'] = `Bearer ${token}`
  options.headers = { ...headers, 'Content-Type': headers['Content-Type'] || 'application/json' }

  const resp = await fetch(`/api/forward/${path}`, options)
  if (resp.status !== 401) return resp

  // Try refresh once
  const ok = await refreshTokens()
  if (!ok) return resp

  // Retry with new token
  const newToken = localStorage.getItem('accessToken')
  if (newToken) options.headers['Authorization'] = `Bearer ${newToken}`
  return fetch(`/api/forward/${path}`, options)
}

export default apiFetch
