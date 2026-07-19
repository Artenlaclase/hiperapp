import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    if (!token) {
      router.replace('/')
      return
    }
    setReady(true)
  }, [])

  const handleLogout = async () => {
    try {
      // Clear tokens locally; backend logout endpoint requires Auth header and proxy support.
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      router.replace('/')
    }
  }

  if (!ready) return <p style={{ padding: 24 }}>Comprobando sesión...</p>

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard</h1>
      <p>Bienvenido — estás autenticado.</p>

      <section style={{ marginTop: 20 }}>
        <button onClick={() => router.push('/blood-pressure')} style={{ marginRight: 8 }}>Presión arterial</button>
        <button onClick={() => router.push('/foods')} style={{ marginRight: 8 }}>Alimentos</button>
        <button onClick={() => router.push('/food-logs')} style={{ marginRight: 8 }}>Registro consumo</button>
        <button onClick={() => router.push('/medications')} style={{ marginRight: 8 }}>Medicamentos</button>
      </section>

      <section style={{ marginTop: 32 }}>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', borderRadius: 6, border: 'none' }}>Cerrar sesión</button>
      </section>
    </main>
  )
}
