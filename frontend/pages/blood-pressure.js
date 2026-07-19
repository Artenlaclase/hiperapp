import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId } from '../utils/auth'
import { queueAction, syncQueue } from '../utils/sync'

export default function BloodPressurePage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ systolic: '', diastolic: '', measuredAt: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    load()
    window.addEventListener('online', syncQueue)
    return () => window.removeEventListener('online', syncQueue)
  }, [])

  async function load() {
    const userId = getUserId()
    if (!userId) return
    const res = await apiFetch(`blood-pressure/user/${userId}`, { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const payload = {
      systolic: Number(form.systolic),
      diastolic: Number(form.diastolic),
      measuredAt: form.measuredAt,
      userId: Number(getUserId()),
    }

    try {
      const res = await apiFetch('blood-pressure', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        await load()
        setForm({ systolic: '', diastolic: '', measuredAt: '' })
      } else {
        const data = await res.json()
        setMessage(data.error || 'Error al guardar')
      }
    } catch (err) {
      await queueAction('blood-pressure', { method: 'POST', body: payload })
      setMessage('Sin conexión. Se guardará cuando vuelvas a estar en línea.')
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Presión arterial</h1>
      <p>Registra tus mediciones y consulta tu historial.</p>

      <form onSubmit={submit} style={{ marginBottom: 20, display: 'grid', gap: 12, maxWidth: 480 }}>
        <input placeholder="Systolic" value={form.systolic} onChange={(e) => setForm({ ...form, systolic: e.target.value })} required />
        <input placeholder="Diastolic" value={form.diastolic} onChange={(e) => setForm({ ...form, diastolic: e.target.value })} required />
        <input placeholder="YYYY-MM-DD HH:mm:ss" value={form.measuredAt} onChange={(e) => setForm({ ...form, measuredAt: e.target.value })} required />
        <button type="submit" disabled={loading} style={buttonStyle}>Agregar</button>
      </form>

      {message && <p style={{ color: '#b91c1c' }}>{message}</p>}

      <section>
        <h2>Historial</h2>
        <ul>
          {list.map((item) => (
            <li key={item.id}>{item.measuredAt} — {item.systolic}/{item.diastolic}</li>
          ))}
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
