import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'

export default function BloodPressurePage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ systolic: '', diastolic: '', measuredAt: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const res = await apiFetch('api/blood-pressure', { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    await apiFetch('api/blood-pressure', { method: 'POST', body: JSON.stringify({ systolic: Number(form.systolic), diastolic: Number(form.diastolic), measuredAt: form.measuredAt }) })
    await load()
    setLoading(false)
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Presión arterial</h1>
      <form onSubmit={submit} style={{ marginBottom: 20 }}>
        <input placeholder="Systolic" value={form.systolic} onChange={(e) => setForm({ ...form, systolic: e.target.value })} />
        <input placeholder="Diastolic" value={form.diastolic} onChange={(e) => setForm({ ...form, diastolic: e.target.value })} />
        <input placeholder="YYYY-MM-DD HH:mm:ss" value={form.measuredAt} onChange={(e) => setForm({ ...form, measuredAt: e.target.value })} />
        <button type="submit" disabled={loading}>Agregar</button>
      </form>
      <ul>
        {list.map((item) => (
          <li key={item.id}>{item.measuredAt} — {item.systolic}/{item.diastolic}</li>
        ))}
      </ul>
    </main>
  )
}
