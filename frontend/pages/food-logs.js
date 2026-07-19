import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId } from '../utils/auth'
import { queueAction, syncQueue } from '../utils/sync'

function getCurrentLocalDateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export default function FoodLogsPage() {
  const [list, setList] = useState([])
  const [foods, setFoods] = useState([])
  const [form, setForm] = useState({ foodId: '', portion: '', consumedAt: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    load()
    setForm((prev) => ({ ...prev, consumedAt: getCurrentLocalDateTime() }))
    window.addEventListener('online', syncQueue)
    return () => window.removeEventListener('online', syncQueue)
  }, [])

  async function load() {
    const userId = getUserId()
    if (!userId) return

    const [foodsRes, logsRes] = await Promise.all([
      apiFetch('foods', { method: 'GET' }),
      apiFetch(`food-logs/user/${userId}`, { method: 'GET' }),
    ])

    if (foodsRes.ok) {
      setFoods(await foodsRes.json())
    }

    if (logsRes.ok) {
      setList(await logsRes.json())
    }
  }

  const foodNameById = (id) => {
    const found = foods.find((food) => food.id === id)
    return found ? found.name : `Alimento #${id}`
  }

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    const payload = {
      foodId: Number(form.foodId),
      portion: form.portion,
      consumedAt: form.consumedAt ? form.consumedAt.replace('T', ' ') + ':00' : '',
      userId: Number(getUserId()),
    }

    try {
      const res = await apiFetch('food-logs', { method: 'POST', body: JSON.stringify(payload) })
      if (res.ok) {
        setForm({ foodId: '', portion: '', consumedAt: getCurrentLocalDateTime() })
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
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Registro de consumo</h1>

        <form onSubmit={submit} style={{ display: 'grid', gap: 14, marginBottom: 20, background: 'var(--color-surface)', padding: 18, borderRadius: 18, boxShadow: '0 12px 28px rgba(0,0,0,0.06)' }}>
          <label style={{ display: 'grid', gap: 8 }}>
            Selecciona un alimento
            <select value={form.foodId} onChange={(e) => setForm({ ...form, foodId: e.target.value })} required style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }}>
              <option value="">Elige una opción</option>
              {foods.map((food) => (
                <option key={food.id} value={food.id}>{food.name}</option>
              ))}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            Porción
            <input placeholder="Porción" value={form.portion} onChange={(e)=>setForm({...form, portion:e.target.value})} required style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            Fecha y hora
            <input placeholder="YYYY-MM-DD HH:mm:ss" value={form.consumedAt} onChange={(e)=>setForm({...form, consumedAt:e.target.value})} required style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
          </label>
          <button type="submit" style={buttonStyle}>Agregar consumo</button>
        </form>

        {message && <p style={{ color: 'var(--color-alert)' }}>{message}</p>}

        <section style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ color: 'var(--color-primary)' }}>Historial</h2>
          {list.map((l) => (
            <article key={l.id} style={logCard}>
              <div>
                <strong style={{ color: 'var(--color-text)' }}>{foodNameById(l.foodId)}</strong>
                <div style={{ color: 'var(--color-muted)', marginTop: 6 }}>{l.consumedAt}</div>
              </div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{l.portion}</span>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

const buttonStyle = { padding: '12px 16px', borderRadius: 10, border: 'none', background: 'var(--color-success)', color: '#ffffff', cursor: 'pointer' }
const logCard = { padding: 16, borderRadius: 16, background: 'var(--color-surface)', boxShadow: '0 10px 24px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
