export const ACCESS_TOKEN_KEY = 'apphiper:accessToken'
export const USER_ID_KEY = 'apphiper:userId'
export const USER_NAME_KEY = 'apphiper:userName'

export function getAccessToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null
}

export function setAccessToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getUserId() {
  return typeof window !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null
}

export function setUserId(userId) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_ID_KEY, String(userId))
}

export function getUserName() {
  return typeof window !== 'undefined' ? localStorage.getItem(USER_NAME_KEY) : null
}

export function setUserName(name) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_NAME_KEY, name)
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(USER_NAME_KEY)
}

export function isAuthenticated() {
  return Boolean(getAccessToken() && getUserId())
}
