import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId } from '../utils/auth'
import { queueAction, syncQueue } from '../utils/sync'

export default function MedicationsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', dosage: '', instructions: '' })
  const [message, setMessage] = useState('')

  useEffect(() => { load(); window.addEventListener('online', syncQueue); return () => window.removeEventListener('online', syncQueue) }, [])

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
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Medicaciones</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 560, marginBottom: 20 }}>
        <input placeholder="Nombre del medicamento" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <input placeholder="Dosis" value={form.dosage} onChange={(e)=>setForm({...form,dosage:e.target.value})} required />
        <input placeholder="Instrucciones" value={form.instructions} onChange={(e)=>setForm({...form,instructions:e.target.value})} />
        <button type="submit" style={buttonStyle}>Agregar medicamento</button>
      </form>
      {message && <p style={{ color: '#b91c1c' }}>{message}</p>}
      <section>
        <h2>Listado</h2>
        <ul>
          {list.map(m => <li key={m.id}>{m.name} — {m.dosage} — {m.instructions || 'Sin instrucciones'}</li>)}
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
