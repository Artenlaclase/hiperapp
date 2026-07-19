const QUEUE_KEY = 'apphiper:syncQueue'

export function getQueue() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
  } catch (e) {
    return []
  }
}

export function setQueue(queue) {
  if (typeof window === 'undefined') return
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export async function queueAction(path, action) {
  const queue = getQueue()
  queue.push({ path, action, createdAt: new Date().toISOString() })
  setQueue(queue)
  return queue
}

export async function syncQueue() {
  if (typeof window === 'undefined' || !navigator.onLine) return
  const queue = getQueue()
  if (!queue.length) return

  const nextQueue = []
  for (const item of queue) {
    try {
      const res = await fetch(`/api/forward/${item.path}`, {
        method: item.action.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(item.action.body),
      })
      if (!res.ok) throw new Error('Sync failed')
    } catch (e) {
      nextQueue.push(item)
    }
  }

  setQueue(nextQueue)
}
