import '../styles/globals.css'
import Header from '../components/Header'
import { useEffect, useState, useRef } from 'react'
import { isAuthenticated, getUserId } from '../utils/auth'
import apiFetch from '../utils/api'

function playNotificationSound() {
  if (typeof window === 'undefined') return
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, audioCtx.currentTime)
    gain.gain.setValueAtTime(0, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1)
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8)
    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + 0.8)
  } catch (e) {
    console.warn('Audio Context error', e)
  }
}

export default function App({ Component, pageProps }) {
  const [activeAlert, setActiveAlert] = useState(null)
  const lastTriggeredRef = useRef({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    const interval = setInterval(async () => {
      if (!isAuthenticated()) return

      const userId = getUserId()
      if (!userId) return

      try {
        const res = await apiFetch(`medications/user/${userId}`, { method: 'GET' })
        if (!res.ok) return
        const medications = await res.json()

        const now = new Date()
        const currentHour = String(now.getHours()).padStart(2, '0')
        const currentMinute = String(now.getMinutes()).padStart(2, '0')
        const currentHHMM = `${currentHour}:${currentMinute}`
        
        const rawDay = now.getDay()
        const prismaDay = rawDay === 0 ? 7 : rawDay

        const todayStr = now.toISOString().split('T')[0]
        const currentMinuteKey = `${todayStr} ${currentHHMM}`

        for (const med of medications) {
          if (!med.alarms) continue
          for (const alarm of med.alarms) {
            if (!alarm.active) continue

            const daysList = alarm.daysOfWeek.split(',')
            const isToday = daysList.includes(String(prismaDay))
            const isTimeMatch = alarm.alarmTime === currentHHMM

            if (isToday && isTimeMatch) {
              const triggeredTime = lastTriggeredRef.current[alarm.id]
              if (triggeredTime !== currentMinuteKey) {
                lastTriggeredRef.current[alarm.id] = currentMinuteKey
                setActiveAlert({ medication: med, alarm: alarm })
                playNotificationSound()
              }
            }
          }
        }
      } catch (err) {
        console.error('Error running alarm checks', err)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const handleTakeMedication = async () => {
    if (!activeAlert) return
    const { medication } = activeAlert
    const userId = getUserId()

    try {
      const res = await apiFetch(`medications/${medication.id}/logs`, {
        method: 'POST',
        body: JSON.stringify({
          userId: Number(userId),
          status: 'taken',
          takenAt: new Date().toISOString()
        })
      })
      if (res.ok) {
        alert(`¡Medicamento ${medication.name} registrado como tomado!`)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setActiveAlert(null)
    }
  }

  return (
    <>
      <Header />
      <Component {...pageProps} />

      {activeAlert && (
        <div className="alarm-overlay">
          <div className="alarm-modal">
            <h3 className="alarm-modal-title">
              🔔 RECORDATORIO DE MEDICINA
            </h3>
            <h2 className="alarm-modal-med">{activeAlert.medication.name}</h2>
            <span className="alarm-modal-dosage">Dosis: {activeAlert.medication.dosage}</span>
            {activeAlert.medication.instructions && (
              <p className="alarm-modal-inst">
                📝 {activeAlert.medication.instructions}
              </p>
            )}
            <button className="alarm-modal-btn-take" onClick={handleTakeMedication}>
              ✓ Marcar como Tomado
            </button>
            <button className="alarm-modal-btn-close" onClick={() => setActiveAlert(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
