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
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif', background: '#F9F9F9', minHeight: '100vh' }}>
      <section style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ color: '#2C7699' }}>Catálogo de alimentos</h1>
        <button onClick={load} style={buttonStyle}>Recargar</button>
        <div style={{ marginTop: 20, display: 'grid', gap: 14 }}>
          {list.map((f) => (
            <article key={f.id} style={foodCard}>
              <h2 style={{ margin: 0, color: '#1f2937' }}>{f.name}</h2>
              <p style={{ margin: '8px 0 0', color: '#4b5563' }}>{f.category || 'Categoría no definida'}</p>
              <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={tagStyle}>{f.sodiumLevel ? `Sodio: ${f.sodiumLevel}` : 'Sodio: N/D'}</span>
                <span style={tagStyle}>{f.potassium ? `Potasio: ${f.potassium}` : 'Potasio: N/D'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

const buttonStyle = { padding: '10px 16px', borderRadius: 10, border: 'none', background: '#2C7699', color: '#fff', cursor: 'pointer' }
const foodCard = { background: '#ffffff', padding: 18, borderRadius: 16, boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }
const tagStyle = { padding: '6px 10px', borderRadius: 999, background: '#eef6f9', color: '#2C7699', fontSize: 12 }
