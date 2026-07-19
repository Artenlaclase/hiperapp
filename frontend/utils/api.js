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
  const userId = typeof window !== 'undefined' ? localStorage.getItem('apphiper:userId') : null
  if (!userId) return false
  try {
    const res = await fetch('/api/forward/auth/refresh', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: Number(userId) }),
    })
    if (!res.ok) return false
    const data = await res.json()
    if (data.accessToken) {
      localStorage.setItem('apphiper:accessToken', data.accessToken)
    }
    return true
  } catch (e) {
    console.warn('refreshTokens failed', e)
    return false
  }
}

export async function apiFetch(path, options = {}) {
  const headers = options.headers || {}
  const token = typeof window !== 'undefined' ? localStorage.getItem('apphiper:accessToken') : null
  if (token) headers['Authorization'] = `Bearer ${token}`
  options.headers = { ...headers, 'Content-Type': headers['Content-Type'] || 'application/json' }
  options.credentials = 'same-origin'

  const resp = await fetch(`/api/forward/${path}`, options)
  if (resp.status !== 401) return resp

  const ok = await refreshTokens()
  if (!ok) return resp

  const newToken = typeof window !== 'undefined' ? localStorage.getItem('apphiper:accessToken') : null
  if (newToken) options.headers['Authorization'] = `Bearer ${newToken}`
  return fetch(`/api/forward/${path}`, options)
}

export default apiFetch
