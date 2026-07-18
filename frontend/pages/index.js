import { useState } from 'react'

const initialForm = { name: '', email: '', password: '' }

export default function Home() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const action = mode === 'register' ? 'register' : 'login'
    const payload = {
      email: form.email,
      password: form.password,
      ...(mode === 'register' ? { name: form.name } : {}),
    }

    try {
      const response = await fetch(`/api/auth/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Error en la petición')
      } else {
        setMessage(`Éxito: ${mode === 'register' ? 'Usuario creado' : 'Login correcto'}`)
      }
    } catch (error) {
      console.error(error)
      setMessage('Error al conectar con el backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 32, fontFamily: 'Arial, sans-serif', maxWidth: 700, margin: '0 auto' }}>
      <section style={{ marginBottom: 32 }}>
        <h1>AppHiper</h1>
        <p>Frontend PWA con Next.js que consume el backend NestJS.</p>
      </section>

      <section style={{ background: '#f9fafb', padding: 24, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button type="button" onClick={() => setMode('login')} style={{ padding: '10px 18px', borderRadius: 8, border: mode === 'login' ? '2px solid #0ea5a4' : '1px solid #d1d5db', background: mode === 'login' ? '#ecfeff' : '#ffffff', cursor: 'pointer' }}>
            Login
          </button>
          <button type="button" onClick={() => setMode('register')} style={{ padding: '10px 18px', borderRadius: 8, border: mode === 'register' ? '2px solid #0ea5a4' : '1px solid #d1d5db', background: mode === 'register' ? '#ecfeff' : '#ffffff', cursor: 'pointer' }}>
            Registro
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label style={{ display: 'block', marginBottom: 16 }}>
              Nombre
              <input type="text" name="name" value={form.name} onChange={handleChange} required={mode === 'register'} style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }} />
            </label>
          )}

          <label style={{ display: 'block', marginBottom: 16 }}>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }} />
          </label>

          <label style={{ display: 'block', marginBottom: 24 }}>
            Contraseña
            <input type="password" name="password" value={form.password} onChange={handleChange} required style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }} />
          </label>

          <button type="submit" disabled={loading} style={{ padding: '12px 20px', borderRadius: 8, border: 'none', background: '#0ea5a4', color: '#ffffff', cursor: 'pointer' }}>
            {loading ? 'Enviando...' : mode === 'register' ? 'Registrar' : 'Entrar'}
          </button>
        </form>

        {message && <p style={{ marginTop: 20, color: '#111827' }}>{message}</p>}
      </section>

      <section style={{ marginTop: 32, padding: 24, background: '#eef2ff', borderRadius: 12 }}>
        <h2>Cómo funciona</h2>
        <ol>
          <li>El frontend hace POST a <code>/api/auth/login</code> o <code>/api/auth/register</code>.</li>
          <li>La ruta API proxy envía la petición al backend NestJS en <code>http://localhost:3001/api/auth</code>.</li>
          <li>El backend responde tokens JWT y datos de usuario.</li>
        </ol>
      </section>
    </main>
  )
}
