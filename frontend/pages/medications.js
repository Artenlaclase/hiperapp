import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId } from '../utils/auth'
import { queueAction, syncQueue } from '../utils/sync'

export default function MedicationsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', dosage: '', instructions: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    load()
    window.addEventListener('online', syncQueue)
    return () => window.removeEventListener('online', syncQueue)
  }, [])

  async function load() {
    const res = await apiFetch('medications', { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    const payload = { ...form, userId: Number(getUserId()) }

    try {
      const res = await apiFetch('medications', { method: 'POST', body: JSON.stringify(payload) })
      if (res.ok) {
        setForm({ name: '', dosage: '', instructions: '' })
        await load()
      } else {
        const data = await res.json()
        setMessage(data.error || 'Error al guardar')
      }
    } catch (err) {
      await queueAction('medications', { method: 'POST', body: payload })
      setMessage('Sin conexión. La medicación se sincronizará cuando vuelvas a estar en línea.')
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Medicaciones</h1>
        <p style={{ color: 'var(--color-muted)' }}>Agrega y revisa tus recetas y dosis.</p>

        <form onSubmit={submit} style={{ display: 'grid', gap: 14, marginBottom: 20, padding: 18, background: 'var(--color-surface)', borderRadius: 20, boxShadow: '0 14px 32px rgba(0,0,0,0.06)' }}>
          <input placeholder="Nombre del medicamento" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Dosis" value={form.dosage} onChange={(e)=>setForm({...form,dosage:e.target.value})} required />
          <textarea placeholder="Instrucciones" value={form.instructions} onChange={(e)=>setForm({...form,instructions:e.target.value})} rows={3} />
          <button type="submit" style={buttonStyle}>Agregar medicamento</button>
        </form>

        {message && <p style={{ color: 'var(--color-alert)' }}>{message}</p>}

        <section style={{ display: 'grid', gap: 14 }}>
          <h2 style={{ color: 'var(--color-primary)' }}>Listado</h2>
          {list.map(m => (
            <article key={m.id} style={medCard}>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text)' }}>{m.name}</strong>
                <span style={{ color: 'var(--color-muted)' }}>{m.dosage}</span>
              </div>
              <p style={{ margin: '10px 0 0', color: 'var(--color-muted)' }}>{m.instructions || 'Sin instrucciones'}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

const buttonStyle = { padding: '12px 16px', borderRadius: 12, border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer' }
const medCard = { padding: 18, borderRadius: 20, background: 'var(--color-surface)', boxShadow: '0 12px 28px rgba(0,0,0,0.05)' }
