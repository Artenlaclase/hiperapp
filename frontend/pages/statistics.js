import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId, isAuthenticated } from '../utils/auth'
import { useRouter } from 'next/router'

export default function StatisticsPage() {
  const router = useRouter()
  const [stats, setStats] = useState({ bloodPressure: [], foodLogs: [], foodNames: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/')
      return
    }
    loadStats()
  }, [])

  async function loadStats() {
    const userId = getUserId()
    if (!userId) return

    const [bpRes, logsRes, foodsRes] = await Promise.all([
      apiFetch(`blood-pressure/user/${userId}`, { method: 'GET' }),
      apiFetch(`food-logs/user/${userId}`, { method: 'GET' }),
      apiFetch('foods', { method: 'GET' }),
    ])

    const bloodPressure = bpRes.ok ? await bpRes.json() : []
    const foodLogs = logsRes.ok ? await logsRes.json() : []
    const foods = foodsRes.ok ? await foodsRes.json() : []
    const foodNames = Object.fromEntries((foods || []).map((food) => [food.id, food.name]))

    setStats({ bloodPressure, foodLogs, foodNames })
    setLoading(false)
  }

  const averagePressure = () => {
    if (!stats.bloodPressure.length) return null
    const systolicSum = stats.bloodPressure.reduce((sum, item) => sum + Number(item.systolic), 0)
    const diastolicSum = stats.bloodPressure.reduce((sum, item) => sum + Number(item.diastolic), 0)
    return {
      systolic: Math.round(systolicSum / stats.bloodPressure.length),
      diastolic: Math.round(diastolicSum / stats.bloodPressure.length),
    }
  }

  const mostConsumed = () => {
    if (!stats.foodLogs.length) return null
    const counts = stats.foodLogs.reduce((acc, item) => {
      const key = item.foodId
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const [foodId, count] = sorted[0] || []
    return foodId ? { name: stats.foodNames[foodId] || `Alimento #${foodId}`, count } : null
  }

  const average = averagePressure()
  const favorite = mostConsumed()

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <img src="/logo_app.png" alt="AppHiper" style={{ width: 72, borderRadius: 18, background: 'var(--color-surface)', padding: 12 }} />
          <div>
            <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>Estadísticas</h1>
            <p style={{ margin: '8px 0 0', color: 'var(--color-muted)' }}>Resumen de tus últimas mediciones y hábitos de consumo.</p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--color-muted)' }}>Cargando estadísticas...</p>
        ) : (
          <section style={{ display: 'grid', gap: 18 }}>
            <div style={statCard}>
              <h2 style={cardTitle}>Presiones registradas</h2>
              <p style={cardValue}>{stats.bloodPressure.length}</p>
              <p style={cardNote}>{stats.bloodPressure.length ? 'Total de registros de presión arterial' : 'Aún no hay registros'}</p>
            </div>

            <div style={statCard}>
              <h2 style={cardTitle}>Promedio actual</h2>
              {average ? (
                <p style={cardValue}>{average.systolic}/{average.diastolic} mmHg</p>
              ) : (
                <p style={cardValue}>Sin datos</p>
              )}
              <p style={cardNote}>Promedio basado en tus últimas mediciones.</p>
            </div>

            <div style={statCard}>
              <h2 style={cardTitle}>Consumos registrados</h2>
              <p style={cardValue}>{stats.foodLogs.length}</p>
              <p style={cardNote}>{stats.foodLogs.length ? 'Total de entradas de consumo' : 'Aún no hay consumos'}</p>
            </div>

            <div style={statCard}>
              <h2 style={cardTitle}>Alimento más consumido</h2>
              {favorite ? (
                <>
                  <p style={cardValue}>{favorite.name}</p>
                  <p style={cardNote}>{favorite.count} veces</p>
                </>
              ) : (
                <p style={cardValue}>Sin datos</p>
              )}
            </div>

            <section style={{ display: 'grid', gap: 12, padding: 18, borderRadius: 22, background: 'var(--color-surface)', boxShadow: '0 14px 32px rgba(0,0,0,0.06)' }}>
              <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Interpretación rápida</h2>
              <p style={{ margin: '10px 0 0', color: 'var(--color-muted)' }}>
                Si tu promedio de presión está en un rango elevado, prioriza el control y sigue las recomendaciones médicas. Llevar un registro te ayuda a detectar tendencias y cambios a tiempo.
              </p>
            </section>
          </section>
        )}
      </section>
    </main>
  )
}

const statCard = {
  padding: 24,
  borderRadius: 24,
  background: 'var(--color-surface)',
  boxShadow: '0 14px 36px rgba(0,0,0,0.05)',
}
const cardTitle = { margin: 0, color: 'var(--color-text)' }
const cardValue = { margin: '14px 0 6px', fontSize: 32, fontWeight: 700, color: 'var(--color-primary)' }
const cardNote = { margin: 0, color: 'var(--color-muted)' }
