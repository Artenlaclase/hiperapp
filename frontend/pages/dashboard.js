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

  const handleLogout = async () => {
    clearAuth()
    router.replace('/')
  }

  if (!ready) return <p style={{ padding: 24 }}>Comprobando sesión...</p>

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Bienvenido{ name ? `, ${name}` : '' }</h1>
      <p>En AppHiper puedes registrar presión arterial, alimentos, medicinas y ver tu progreso.</p>

      <section style={{ display: 'grid', gap: 12, maxWidth: 560, marginTop: 24 }}>
        <button onClick={() => router.push('/blood-pressure')} style={cardButton}>Presión arterial</button>
        <button onClick={() => router.push('/foods')} style={cardButton}>Catálogo de alimentos</button>
        <button onClick={() => router.push('/food-logs')} style={cardButton}>Registro de consumo</button>
        <button onClick={() => router.push('/medications')} style={cardButton}>Medicamentos</button>
      </section>

      <section style={{ marginTop: 32 }}>
        <button onClick={handleLogout} style={{ ...cardButton, background: '#ef4444' }}>Cerrar sesión</button>
      </section>
    </main>
  )
}

const cardButton = {
  padding: '16px 20px',
  borderRadius: 12,
  border: 'none',
  background: '#0ea5a4',
  color: '#fff',
  cursor: 'pointer',
  textAlign: 'left',
}
