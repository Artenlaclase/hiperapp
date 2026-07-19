import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId } from '../utils/auth'
import { queueAction, syncQueue } from '../utils/sync'

export default function MedicationsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', dosage: '', instructions: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    load()
    window.addEventListener('online', syncQueue)
    return () => window.removeEventListener('online', syncQueue)
  }, [])

  async function load() {
    const userId = getUserId()
    if (!userId) return
    const res = await apiFetch(`medications/user/${userId}`, { method: 'GET' })
    if (res.ok) setList(await res.json())
  }

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    const payload = { ...form, userId: Number(getUserId()) }

    try {
      const res = await apiFetch('medications', { method: 'POST', body: JSON.stringify(payload) })
      if (res.ok) {
        setForm({ name: '', dosage: '', instructions: '' })
        await load()
      } else {
        const data = await res.json()
        setMessage(data.error || 'Error al guardar')
      }
    } catch (err) {
      await queueAction('medications', { method: 'POST', body: payload })
      setMessage('Sin conexión. La medicación se sincronizará cuando vuelvas a estar en línea.')
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Medicaciones</h1>
        <p style={{ color: 'var(--color-muted)' }}>Agrega y revisa tus recetas y dosis, y configura alarmas de toma.</p>

        <form onSubmit={submit} style={{ display: 'grid', gap: 14, marginBottom: 24, padding: 18, background: 'var(--color-surface)', borderRadius: 20, boxShadow: '0 14px 32px rgba(0,0,0,0.06)' }}>
          <input placeholder="Nombre del medicamento (ej: Losartán)" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
          <input placeholder="Dosis (ej: 50mg)" value={form.dosage} onChange={(e)=>setForm({...form,dosage:e.target.value})} required style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
          <textarea placeholder="Instrucciones (ej: Tomar una vez al día)" value={form.instructions} onChange={(e)=>setForm({...form,instructions:e.target.value})} rows={3} style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
          <button type="submit" style={buttonStyle}>Agregar medicamento</button>
        </form>

        {message && <p style={{ color: 'var(--color-alert)', marginBottom: 20 }}>{message}</p>}

        <section style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ color: 'var(--color-primary)', margin: '0 0 4px' }}>Listado</h2>
          {list.map(m => (
            <MedicationCard key={m.id} medication={m} onReload={load} />
          ))}
        </section>
      </section>
    </main>
  )
}

function MedicationCard({ medication, onReload }) {
  const [alarmTime, setAlarmTime] = useState('08:00')
  const [days, setDays] = useState([true, true, true, true, true, true, true]) // Lun-Dom
  const [loading, setLoading] = useState(false)

  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const dayValues = [1, 2, 3, 4, 5, 6, 7]

  const handleToggleDay = (idx) => {
    setDays(prev => {
      const next = [...prev]
      next[idx] = !next[idx]
      return next
    })
  }

  const handleAddAlarm = async (e) => {
    e.preventDefault()
    const selectedDays = dayValues.filter((_, idx) => days[idx])
    if (selectedDays.length === 0) {
      alert('Por favor selecciona al menos un día')
      return
    }

    setLoading(true)
    const payload = {
      alarmTime,
      daysOfWeek: selectedDays.join(','),
      userId: Number(getUserId())
    }

    try {
      const res = await apiFetch(`medications/${medication.id}/alarms`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        onReload()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAlarm = async (alarmId) => {
    if (!confirm('¿Seguro que deseas eliminar esta alarma?')) return
    try {
      const res = await apiFetch(`medications/${medication.id}/alarms/${alarmId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        onReload()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleAlarmActive = async (alarm) => {
    try {
      const res = await apiFetch(`medications/${medication.id}/alarms/${alarm.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !alarm.active })
      })
      if (res.ok) {
        onReload()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <article style={medCard}>
      <div>
        <strong style={{ display: 'block', fontSize: 18, color: 'var(--color-text)' }}>{medication.name}</strong>
        <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>{medication.dosage}</span>
      </div>
      <p style={{ margin: '10px 0 0', color: 'var(--color-muted)' }}>{medication.instructions || 'Sin instrucciones'}</p>
      
      <div style={{ marginTop: 18, borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
        <strong style={{ display: 'block', fontSize: 13, color: 'var(--color-text)', marginBottom: 8 }}>⏰ Alarmas configuradas:</strong>
        
        {(!medication.alarms || medication.alarms.length === 0) ? (
          <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--color-muted)', fontStyle: 'italic' }}>No hay alarmas para este medicamento.</p>
        ) : (
          <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
            {medication.alarms.map(alarm => {
              const alarmDaysList = alarm.daysOfWeek.split(',').map(d => {
                const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
                return dayNames[Number(d) - 1]
              })
              const daysStr = alarmDaysList.length === 7 ? 'Todos los días' : alarmDaysList.join(', ')

              return (
                <div key={alarm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(44,118,153,0.05)', padding: '8px 12px', borderRadius: 10, fontSize: 13 }}>
                  <div style={{ opacity: alarm.active ? 1 : 0.6 }}>
                    <strong style={{ fontSize: 14, color: 'var(--color-text)' }}>{alarm.alarmTime}</strong>
                    <span style={{ marginLeft: 8, color: 'var(--color-muted)' }}>({daysStr})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--color-text)' }}>
                      <input type="checkbox" checked={alarm.active} onChange={() => handleToggleAlarmActive(alarm)} style={{ cursor: 'pointer' }} />
                      <span>Activa</span>
                    </label>
                    <button onClick={() => handleDeleteAlarm(alarm.id)} style={{ border: 'none', background: 'none', color: 'var(--color-alert)', cursor: 'pointer', fontWeight: 600 }}>Eliminar</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <form onSubmit={handleAddAlarm} style={{ display: 'grid', gap: 10, background: '#fbfbfb', padding: 12, borderRadius: 12, border: '1px dashed var(--color-border)' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>Añadir Alarma</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="time" value={alarmTime} onChange={(e) => setAlarmTime(e.target.value)} required style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db' }} />
            <button type="submit" disabled={loading} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              {loading ? 'Guardando...' : '+ Alarma'}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dayLabels.map((lbl, idx) => (
              <button key={lbl} type="button" onClick={() => handleToggleDay(idx)} style={{
                padding: '5px 8px',
                borderRadius: 6,
                border: days[idx] ? '1px solid var(--color-primary)' : '1px solid #d1d5db',
                background: days[idx] ? 'rgba(44,118,153,0.12)' : '#fff',
                color: days[idx] ? 'var(--color-primary)' : 'var(--color-muted)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                {lbl}
              </button>
            ))}
          </div>
        </form>
      </div>
    </article>
  )
}

const buttonStyle = { padding: '12px 16px', borderRadius: 12, border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: 600 }
const medCard = { padding: 18, borderRadius: 20, background: 'var(--color-surface)', boxShadow: '0 12px 28px rgba(0,0,0,0.05)' }
