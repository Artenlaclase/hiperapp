import Link from 'next/link'

export default function Header() {
  return (
    <header style={headerStyle}>
      <img src="/logo_app.png" alt="AppHiper" style={logoStyle} />
      <div style={{ flex: 1 }}>
        <p style={titleStyle}>AppHiper</p>
        <p style={subtitleStyle}>Controla tu salud con registro de presión, alimentos y medicación.</p>
      </div>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link href="/blood-pressure" style={linkStyle}>Presión</Link>
        <Link href="/foods" style={linkStyle}>Alimentos</Link>
        <Link href="/food-logs" style={linkStyle}>Consumo</Link>
        <Link href="/medications" style={linkStyle}>Medicinas</Link>
        <Link href="/statistics" style={linkStyle}>Estadísticas</Link>
      </nav>
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
