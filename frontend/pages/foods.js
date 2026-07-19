import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'

export default function FoodsPage() {
  const [list, setList] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    const res = await apiFetch('foods', { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Catálogo de alimentos</h1>
      <button onClick={load} style={buttonStyle}>Recargar</button>
      <ul style={{ marginTop: 16 }}>
        {list.map((f) => <li key={f.id}>{f.name} — {f.category || 'Sin categoría'} — Sodio: {f.sodiumLevel || 'desconocido'} — Potasio: {f.potassium || 'desconocido'}</li>)}
      </ul>
    </main>
  )
}

const buttonStyle = {
  padding: '10px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#0ea5a4',
  color: '#fff',
  cursor: 'pointer',
}
