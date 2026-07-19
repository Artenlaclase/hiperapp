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
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>Catálogo de alimentos</h1>
            <p style={{ margin: '8px 0 0', color: 'var(--color-muted)' }}>Consulta tus alimentos y sus valores clave.</p>
          </div>
          <button onClick={load} style={buttonStyle}>Recargar</button>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {list.map((f) => (
            <article key={f.id} style={foodCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <h2 style={{ margin: 0, color: 'var(--color-text)' }}>{f.name}</h2>
                <span style={{ ...tagStyle, background: 'rgba(92,184,92,0.12)', color: 'var(--color-success)' }}>{f.category || 'Sin categoría'}</span>
              </div>
              <p style={{ margin: '10px 0 0', color: 'var(--color-muted)' }}>{f.description || 'Descripción no disponible'}</p>
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={infoTag}>{f.sodiumLevel ? `Sodio: ${f.sodiumLevel}` : 'Sodio: N/D'}</span>
                <span style={infoTag}>{f.potassium ? `Potasio: ${f.potassium}` : 'Potasio: N/D'}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

const buttonStyle = { padding: '10px 16px', borderRadius: 12, border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer' }
const foodCard = { background: 'var(--color-surface)', padding: 20, borderRadius: 20, boxShadow: '0 16px 32px rgba(0,0,0,0.06)' }
const tagStyle = { padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }
const infoTag = { padding: '8px 12px', borderRadius: 999, background: '#f3f8fb', color: 'var(--color-primary)', fontSize: 12 }
