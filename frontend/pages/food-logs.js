import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId } from '../utils/auth'
import { queueAction, syncQueue } from '../utils/sync'

export default function FoodLogsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ foodId: '', portion: '', consumedAt: '' })
  const [message, setMessage] = useState('')

  useEffect(() => { load(); window.addEventListener('online', syncQueue); return () => window.removeEventListener('online', syncQueue) }, [])

  async function load() {
    const userId = getUserId()
    if (!userId) return
    const res = await apiFetch(`food-logs/user/${userId}`, { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    const payload = {
      foodId: Number(form.foodId),
      portion: form.portion,
      consumedAt: form.consumedAt,
      userId: Number(getUserId()),
    }

    try {
      const res = await apiFetch('food-logs', { method: 'POST', body: JSON.stringify(payload) })
      if (res.ok) {
        setForm({ foodId: '', portion: '', consumedAt: '' })
        await load()
      } else {
        const data = await res.json()
        setMessage(data.error || 'Error al guardar')
      }
    } catch (err) {
      await queueAction('food-logs', { method: 'POST', body: payload })
      setMessage('Sin conexión. La entrada se sincronizará cuando vuelvas a estar en línea.')
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Registro de consumo</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 540, marginBottom: 20 }}>
        <input placeholder="ID de alimento" value={form.foodId} onChange={(e)=>setForm({...form, foodId:e.target.value})} required />
        <input placeholder="Porción" value={form.portion} onChange={(e)=>setForm({...form, portion:e.target.value})} required />
        <input placeholder="YYYY-MM-DD HH:mm:ss" value={form.consumedAt} onChange={(e)=>setForm({...form, consumedAt:e.target.value})} required />
        <button type="submit" style={buttonStyle}>Agregar consumo</button>
      </form>
      {message && <p style={{ color: '#b91c1c' }}>{message}</p>}
      <section>
        <h2>Historial</h2>
        <ul>
          {list.map(l => <li key={l.id}>{l.consumedAt} — {l.portion} (alimento {l.foodId})</li>)}
        </ul>
      </section>
    </main>
  )
}

const buttonStyle = {
  padding: '12px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#0ea5a4',
  color: '#fff',
  cursor: 'pointer',
}
