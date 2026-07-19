export default function Header() {
  return (
    <header style={headerStyle}>
      <img src="/logo_app.png" alt="AppHiper" style={logoStyle} />
      <div>
        <p style={titleStyle}>AppHiper</p>
        <p style={subtitleStyle}>Controla tu salud con registro de presión, alimentos y medicación.</p>
      </div>
    </header>
  )
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  width: '100%',
  maxWidth: 1040,
  margin: '0 auto 24px',
  padding: '18px 24px',
  borderRadius: 24,
  background: 'rgba(255,255,255,0.85)',
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
