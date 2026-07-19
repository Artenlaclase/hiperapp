import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { isAuthenticated } from '../utils/auth'

export default function Header() {
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsAuth(isAuthenticated())
  }, [router.asPath])

  if (!isAuth) return null

  return (
    <header className="app-header">
      <img src="/logo_app.png" alt="AppHiper" className="header-logo" />
      <div className="header-info">
        <p className="header-title">AppHiper</p>
        <p className="header-subtitle">Controla tu salud con registro de presión, alimentos y medicación.</p>
      </div>
      <nav className="header-nav">
        <Link href="/dashboard" className="header-link">Dashboard</Link>
        <Link href="/blood-pressure" className="header-link">Presión</Link>
        <Link href="/foods" className="header-link">Alimentos</Link>
        <Link href="/food-logs" className="header-link">Consumo</Link>
        <Link href="/medications" className="header-link">Medicinas</Link>
        <Link href="/statistics" className="header-link">Estadísticas</Link>
      </nav>
    </header>
  )
}
