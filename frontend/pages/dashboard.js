import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { clearAuth, getUserName, isAuthenticated } from '../utils/auth'

export default function Dashboard() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/')
      return
    }
    setName(getUserName() || '')
    setReady(true)
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.replace('/')
  }

  if (!ready) return <p style={{ padding: 24 }}>Comprobando sesión...</p>

  return (
    <main style={{ padding: 24, minHeight: '100vh', background: 'var(--color-bg)' }}>
      <section style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <img src="/logo_app.png" alt="AppHiper" style={{ width: 80, borderRadius: 22, background: 'var(--color-surface)', padding: 12 }} />
          <div>
            <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>Hola{ name ? `, ${name}` : '' }</h1>
            <p style={{ margin: '8px 0 0', color: 'var(--color-muted)' }}>Gestión simple de presión arterial, alimentos y medicación.</p>
          </div>
        </div>

        <section style={{ display: 'grid', gap: 16 }}>
          <button onClick={() => router.push('/blood-pressure')} style={cardButton}>Registro de presión arterial</button>
          <button onClick={() => router.push('/foods')} style={cardButton}>Catálogo de alimentos</button>
          <button onClick={() => router.push('/food-logs')} style={cardButton}>Registro de consumo</button>
          <button onClick={() => router.push('/medications')} style={cardButton}>Medicamentos</button>
          <button onClick={() => router.push('/statistics')} style={cardButton}>Estadísticas</button>
        </section>

        <section style={{ marginTop: 32 }}>
          <button onClick={handleLogout} style={logoutButton}>Cerrar sesión</button>
        </section>
      </section>
    </main>
  )
}

const cardButton = {
  padding: '18px 22px',
  borderRadius: 18,
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: 16,
}

const logoutButton = {
  padding: '13px 18px',
  borderRadius: 14,
  border: 'none',
  background: 'var(--color-alert)',
  color: '#fff',
  cursor: 'pointer',
}
