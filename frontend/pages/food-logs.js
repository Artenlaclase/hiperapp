import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'

export default function FoodLogsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ foodId: '', portion: '', consumedAt: '' })

  useEffect(() => { load() }, [])

  async function load() {
    const res = await apiFetch('api/food-logs', { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  async function submit(e) {
    e.preventDefault()
    await apiFetch('api/food-logs', { method: 'POST', body: JSON.stringify({ foodId: Number(form.foodId), portion: form.portion, consumedAt: form.consumedAt }) })
    setForm({ foodId: '', portion: '', consumedAt: '' })
    await load()
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Registro de consumo</h1>
      <form onSubmit={submit}>
        <input placeholder="foodId" value={form.foodId} onChange={(e)=>setForm({...form, foodId:e.target.value})} />
        <input placeholder="portion" value={form.portion} onChange={(e)=>setForm({...form, portion:e.target.value})} />
        <input placeholder="YYYY-MM-DD HH:mm:ss" value={form.consumedAt} onChange={(e)=>setForm({...form, consumedAt:e.target.value})} />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {list.map(l => <li key={l.id}>{l.consumedAt} — {l.portion} (food {l.foodId})</li>)}
      </ul>
    </main>
  )
}
