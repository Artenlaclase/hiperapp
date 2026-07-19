import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import apiFetch, { decodeJwt } from '../utils/api'
import { getAccessToken, setAccessToken, setUserId, setUserName, isAuthenticated } from '../utils/auth'

const initialForm = { name: '', email: '', password: '' }

export default function Home() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard')
    }
  }, [])

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const action = mode === 'register' ? 'register' : 'login'
    const payload = { email: form.email, password: form.password, ...(mode === 'register' ? { name: form.name } : {}) }

    try {
      const response = await apiFetch(`auth/${action}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Error en la petición')
      } else if (mode === 'login') {
        if (data.accessToken) {
          setAccessToken(data.accessToken)
          const payload = decodeJwt(data.accessToken)
          if (payload?.sub) setUserId(payload.sub)
          setUserName(form.name || payload?.name || payload?.email || '')
        }
        router.push('/dashboard')
      } else {
        setMessage('Usuario registrado. Inicia sesión.')
        setMode('login')
        setForm(initialForm)
      }
    } catch (error) {
      console.error(error)
      setMessage('Error al conectar con el backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 760, margin: '0 auto', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ background: 'var(--color-surface)', padding: 28, borderRadius: 20, boxShadow: '0 18px 44px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
          <button type="button" onClick={() => setMode('login')} style={buttonMode('login', mode)}>Login</button>
          <button type="button" onClick={() => setMode('register')} style={buttonMode('register', mode)}>Registro</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label style={fieldStyle}>
              Nombre
              <input type="text" name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
            </label>
          )}

          <label style={fieldStyle}>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
          </label>

          <label style={fieldStyle}>
            Contraseña
            <input type="password" name="password" value={form.password} onChange={handleChange} required style={inputStyle} />
          </label>

          <button type="submit" disabled={loading} style={submitStyle}>{loading ? 'Enviando...' : mode === 'register' ? 'Registrar' : 'Entrar'}</button>
        </form>

        {message && <p style={{ marginTop: 20, color: 'var(--color-alert)' }}>{message}</p>}
      </section>

      <section style={{ marginTop: 32, padding: 24, borderRadius: 20, background: 'var(--color-surface)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
        <h2 style={{ marginTop: 0, color: 'var(--color-primary)' }}>Funcionalidades principales</h2>
        <ul style={{ color: 'var(--color-muted)', paddingLeft: 20 }}>
          <li>Registro e inicio de sesión seguros.</li>
          <li>Registro de presión arterial, alimentos y medicación.</li>
          <li>Catálogo de alimentos y estadísticas personales.</li>
          <li>Instalable como PWA y funciona offline con sincronización.</li>
        </ul>
      </section>
    </main>
  )
}

const fieldStyle = { display: 'block', marginBottom: 18 }
const inputStyle = { width: '100%', marginTop: 8, padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }
const submitStyle = { width: '100%', padding: '14px 18px', borderRadius: 12, border: 'none', background: 'var(--color-primary)', color: '#ffffff', cursor: 'pointer' }
const buttonMode = (button, mode) => ({ padding: '10px 18px', borderRadius: 10, border: button === mode ? '2px solid var(--color-primary)' : '1px solid #d1d5db', background: button === mode ? '#ecfeff' : '#ffffff', color: 'var(--color-text)', cursor: 'pointer' })
