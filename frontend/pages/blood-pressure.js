import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId } from '../utils/auth'
import { queueAction, syncQueue } from '../utils/sync'

function classifyPressure(systolic, diastolic) {
  if (systolic >= 180 || diastolic >= 120) return { label: 'Crisis hipertensiva', color: 'var(--color-alert)' }
  if (systolic >= 140 || diastolic >= 90) return { label: 'Presión alta', color: 'var(--color-alert)' }
  if (systolic >= 120 || diastolic >= 80) return { label: 'Elevada', color: '#F0AD4E' }
  return { label: 'Controlada', color: 'var(--color-success)' }
}

function nowDate() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function nowTime() {
  const d = new Date()
  return d.toTimeString().slice(0, 5)
}

export default function BloodPressurePage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ systolic: '', diastolic: '', date: nowDate(), time: nowTime() })
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
    const measuredAt = `${form.date}T${form.time}`
    const payload = {
      systolic: Number(form.systolic),
      diastolic: Number(form.diastolic),
      measuredAt,
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
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Presión arterial</h1>
        <p style={{ color: 'var(--color-muted)' }}>Registra tus mediciones y consulta tu historial con un semáforo de estado.</p>

        <form onSubmit={submit} style={{ display: 'grid', gap: 14, marginBottom: 20, padding: 18, background: 'var(--color-surface)', borderRadius: 20, boxShadow: '0 14px 32px rgba(0,0,0,0.06)' }}>
          <input placeholder="Sistólica" value={form.systolic} onChange={(e) => setForm({ ...form, systolic: e.target.value })} required />
          <input placeholder="Diastólica" value={form.diastolic} onChange={(e) => setForm({ ...form, diastolic: e.target.value })} required />
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} style={submitStyle}>{loading ? 'Guardando...' : 'Agregar medición'}</button>
        </form>

        {message && <p style={{ color: 'var(--color-alert)' }}>{message}</p>}

        <section style={{ display: 'grid', gap: 14 }}>
          <h2 style={{ color: 'var(--color-primary)' }}>Historial</h2>
          {list.map((item) => {
            const status = classifyPressure(item.systolic, item.diastolic)
            return (
              <article key={item.id} style={bpCard}>
                <div>
                  <strong style={{ fontSize: 18 }}>{item.systolic}/{item.diastolic} mmHg</strong>
                  <p style={{ margin: '8px 0 0', color: 'var(--color-muted)' }}>{item.measuredAt}</p>
                </div>
                <span style={{ color: '#fff', background: status.color, borderRadius: 999, padding: '8px 14px', fontWeight: 700 }}>{status.label}</span>
              </article>
            )
          })}
        </section>
      </section>
    </main>
  )
}

const submitStyle = { padding: '14px 16px', borderRadius: 12, border: 'none', background: 'var(--color-primary)', color: '#ffffff', cursor: 'pointer' }
const bpCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 18, background: 'var(--color-surface)', boxShadow: '0 10px 26px rgba(0,0,0,0.05)' }
