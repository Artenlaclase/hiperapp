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
        setMessage(data.message || data.error || 'Error en la petición')
      } else if (mode === 'login') {
        if (data.accessToken) {
          setAccessToken(data.accessToken)
          const payload = decodeJwt(data.accessToken)
          if (payload?.sub) setUserId(payload.sub)
          setUserName(form.name || payload?.name || payload?.email || '')
          router.push('/dashboard')
        } else {
          setMessage(data.message || data.error || 'Error en la petición')
        }
      } else {
        if (data.error && !data.id) {
          setMessage(data.message || data.error || 'Error en el registro')
        } else {
          // Registro exitoso → login automático
          setMessage('✅ Cuenta creada. Iniciando sesión...')
          try {
            const loginRes = await apiFetch('auth/login', {
              method: 'POST',
              body: JSON.stringify({ email: form.email, password: form.password }),
            })
            const loginData = await loginRes.json()
            if (loginRes.ok && loginData.accessToken) {
              setAccessToken(loginData.accessToken)
              const decoded = decodeJwt(loginData.accessToken)
              if (decoded?.sub) setUserId(decoded.sub)
              setUserName(form.name || decoded?.name || decoded?.email || '')
              router.push('/dashboard')
            } else {
              // Si el auto-login falla, llevar al form de login con email pre-rellenado
              setMode('login')
              setForm((prev) => ({ ...initialForm, email: form.email }))
              setMessage('Cuenta creada. Ingresa tu contraseña para continuar.')
            }
          } catch {
            setMode('login')
            setForm((prev) => ({ ...initialForm, email: form.email }))
            setMessage('Cuenta creada. Inicia sesión para continuar.')
          }
        }
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
      <section style={{ display: 'grid', placeItems: 'center', gap: 20, marginBottom: 32, textAlign: 'center' }}>
        <img src="/logo_app.png" alt="AppHiper logo" style={{ width: 96, borderRadius: 24, border: '1px solid rgba(44,118,153,0.12)', background: 'white' }} />
        <div>
          <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>AppHiper</h1>
          <p style={{ color: 'var(--color-muted)', maxWidth: 560, margin: '12px auto 0' }}>Registra tu salud cardiovascular con calma, accede a tus estadísticas y usa la app como PWA.</p>
        </div>
      </section>

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
