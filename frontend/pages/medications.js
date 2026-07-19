import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'

export default function MedicationsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', dosage: '', instructions: '' })

  useEffect(() => { load() }, [])

  async function load() {
    const res = await apiFetch('api/medications', { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  async function submit(e) {
    e.preventDefault()
    await apiFetch('api/medications', { method: 'POST', body: JSON.stringify(form) })
    setForm({ name: '', dosage: '', instructions: '' })
    await load()
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Medicaciones</h1>
      <form onSubmit={submit}>
        <input placeholder="name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input placeholder="dosage" value={form.dosage} onChange={(e)=>setForm({...form,dosage:e.target.value})} />
        <input placeholder="instructions" value={form.instructions} onChange={(e)=>setForm({...form,instructions:e.target.value})} />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {list.map(m => <li key={m.id}>{m.name} — {m.dosage}</li>)}
      </ul>
    </main>
  )
}
