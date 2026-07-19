import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { isAuthenticated } from '../utils/auth'

export default function Header() {
  const [auth, setAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setAuth(isAuthenticated())
  }, [router.pathname])

  return (
    <header className="header">
      <img src="/logo_app.png" alt="AppHiper" className="logo" />
      <div style={{ flex: 1 }}>
        <p className="title">AppHiper</p>
        <p className="subtitle">Controla tu salud con registro de presión, alimentos y medicación.</p>
      </div>
      {auth && (
        <nav className="nav">
          <Link href="/dashboard" className="link">Dashboard</Link>
          <Link href="/blood-pressure" className="link">Presión</Link>
          <Link href="/foods" className="link">Alimentos</Link>
          <Link href="/food-logs" className="link">Consumo</Link>
          <Link href="/medications" className="link">Medicinas</Link>
          <Link href="/statistics" className="link">Estadísticas</Link>
        </nav>
      )}
    <style jsx>{`
      .header {
        display: flex;
        align-items: center;
        gap: 20px;
        width: 100%;
        max-width: 1040px;
        margin: 0 auto 24px;
        padding: 18px 24px;
        border-radius: 24px;
        background: rgba(255,255,255,0.95);
        box-shadow: 0 16px 40px rgba(0,0,0,0.06);
        flex-wrap: wrap;
      }
      .logo {
        width: 96px;
        min-width: 96px;
        border-radius: 20px;
        background: var(--color-surface);
        padding: 12px;
      }
      .title {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: var(--color-primary);
      }
      .subtitle {
        margin: 6px 0 0;
        color: var(--color-muted);
      }
      .nav {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        justify-content: flex-end;
      }
      .link {
        display: inline-flex;
        padding: 10px 16px;
        border-radius: 14px;
        background: rgba(44,118,153,0.14);
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 600;
      }
      @media (max-width: 820px) {
        .header {
          padding: 16px;
          justify-content: center;
        }
        .nav {
          justify-content: center;
        }
      }
      @media (max-width: 560px) {
        .logo {
          width: 84px;
          min-width: 84px;
        }
        .header {
          gap: 16px;
        }
        .title {
          font-size: 24px;
        }
      }
    `}</style>
    </header>
  )
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  width: '100%',
  maxWidth: 1040,
  margin: '0 auto 24px',
  padding: '18px 24px',
  borderRadius: 24,
  background: 'rgba(255,255,255,0.95)',
  boxShadow: '0 16px 40px rgba(0,0,0,0.06)',
}

const logoStyle = {
  width: 64,
  minWidth: 64,
  borderRadius: 18,
  background: 'var(--color-surface)',
  padding: 10,
}

const titleStyle = {
  margin: 0,
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--color-primary)',
}

const subtitleStyle = {
  margin: '6px 0 0',
  color: 'var(--color-muted)',
}

const navStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  alignItems: 'center',
}

const linkStyle = {
  padding: '10px 14px',
  borderRadius: 12,
  background: 'rgba(44,118,153,0.12)',
  color: 'var(--color-primary)',
  textDecoration: 'none',
  fontWeight: 600,
}
