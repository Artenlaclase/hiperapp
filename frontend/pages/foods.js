import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'

export default function FoodsPage() {
  const [list, setList] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    const res = await apiFetch('api/foods', { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Alimentos</h1>
      <button onClick={load}>Recargar</button>
      <ul>
        {list.map((f) => <li key={f.id}>{f.name} — {f.category || '—'}</li>)}
      </ul>
    </main>
  )
}
