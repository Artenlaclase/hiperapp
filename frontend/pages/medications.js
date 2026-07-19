import { useEffect, useState } from 'react'
import apiFetch from '../utils/api'
import { getUserId } from '../utils/auth'
import { queueAction, syncQueue } from '../utils/sync'

function currentTime() {
  return new Date().toTimeString().slice(0, 5)
}

export default function MedicationsPage() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', dosage: '', instructions: '' })
  const [alarmForm, setAlarmForm] = useState({ medicationId: '', alarmTime: currentTime(), daysOfWeek: 'Mon,Tue,Wed,Thu,Fri' })
  const [alarms, setAlarms] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    load()
    window.addEventListener('online', syncQueue)
    return () => window.removeEventListener('online', syncQueue)
  }, [])

  async function load() {
    const [medsRes, alarmsRes] = await Promise.all([
      apiFetch('medications', { method: 'GET' }),
      apiFetch('medication-alarms', { method: 'GET' }),
    ])

    if (medsRes.ok) {
      const meds = await medsRes.json()
      setList(meds)
      if (!alarmForm.medicationId && meds.length) {
        setAlarmForm((prev) => ({ ...prev, medicationId: String(meds[0].id) }))
      }
    }
    if (alarmsRes.ok) setAlarms(await alarmsRes.json())
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

  async function submitAlarm(e) {
    e.preventDefault()
    setMessage('')
    const payload = {
      medicationId: Number(alarmForm.medicationId),
      alarmTime: alarmForm.alarmTime,
      daysOfWeek: alarmForm.daysOfWeek,
      active: true,
      userId: Number(getUserId()),
    }

    try {
      const res = await apiFetch('medication-alarms', { method: 'POST', body: JSON.stringify(payload) })
      if (res.ok) {
        setAlarmForm((prev) => ({ ...prev, alarmTime: currentTime() }))
        await load()
      } else {
        const data = await res.json()
        setMessage(data.error || 'Error al crear la alarma')
      }
    } catch (err) {
      setMessage('Sin conexión. No se pudo crear la alarma.')
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif', background: 'var(--color-bg)', minHeight: '100vh' }}>
      <section style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Medicaciones</h1>
        <p style={{ color: 'var(--color-muted)' }}>Agrega y revisa tus recetas y dosis.</p>

        <form onSubmit={submit} style={{ display: 'grid', gap: 14, marginBottom: 20, padding: 18, background: 'var(--color-surface)', borderRadius: 20, boxShadow: '0 14px 32px rgba(0,0,0,0.06)' }}>
          <input placeholder="Nombre del medicamento" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
          <input placeholder="Dosis" value={form.dosage} onChange={(e)=>setForm({...form,dosage:e.target.value})} required />
          <textarea placeholder="Instrucciones" value={form.instructions} onChange={(e)=>setForm({...form,instructions:e.target.value})} rows={3} />
          <button type="submit" style={buttonStyle}>Agregar medicamento</button>
        </form>

        <section style={{ display: 'grid', gap: 14, marginBottom: 20, padding: 18, background: 'var(--color-surface)', borderRadius: 20, boxShadow: '0 14px 32px rgba(0,0,0,0.06)' }}>
          <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Agregar alarma</h2>
          <form onSubmit={submitAlarm} style={{ display: 'grid', gap: 14 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              Medicamento
              <select value={alarmForm.medicationId} onChange={(e) => setAlarmForm({ ...alarmForm, medicationId: e.target.value })} required style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }}>
                <option value="">Selecciona un medicamento</option>
                {list.map((med) => (
                  <option key={med.id} value={med.id}>{med.name}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              Hora de alarma
              <input type="time" value={alarmForm.alarmTime} onChange={(e) => setAlarmForm({ ...alarmForm, alarmTime: e.target.value })} required style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
            </label>
            <label style={{ display: 'grid', gap: 8 }}>
              Días
              <input placeholder="Lun,Mar,Mié,Ju,Vi" value={alarmForm.daysOfWeek} onChange={(e) => setAlarmForm({ ...alarmForm, daysOfWeek: e.target.value })} required style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db' }} />
            </label>
            <button type="submit" style={buttonStyle}>Crear alarma</button>
          </form>
        </section>

        {message && <p style={{ color: 'var(--color-alert)' }}>{message}</p>}

        <section style={{ display: 'grid', gap: 14 }}>
          <h2 style={{ color: 'var(--color-primary)' }}>Listado</h2>
          {list.map(m => (
            <article key={m.id} style={medCard}>
              <div>
                <strong style={{ display: 'block', color: 'var(--color-text)' }}>{m.name}</strong>
                <span style={{ color: 'var(--color-muted)' }}>{m.dosage}</span>
                <p style={{ margin: '10px 0 0', color: 'var(--color-muted)' }}>{m.instructions || 'Sin instrucciones'}</p>
              </div>
            </article>
          ))}
        </section>

        <section style={{ display: 'grid', gap: 14, marginTop: 24 }}>
          <h2 style={{ color: 'var(--color-primary)' }}>Alarmas</h2>
          {alarms.length ? alarms.map((alarm) => (
            <article key={alarm.id} style={medCard}>
              <strong style={{ color: 'var(--color-text)' }}>{alarm.medication?.name || `Medicamento #${alarm.medicationId}`}</strong>
              <p style={{ margin: '6px 0 0', color: 'var(--color-muted)' }}>Hora: {alarm.alarmTime} · Días: {alarm.daysOfWeek}</p>
            </article>
          )) : <p style={{ color: 'var(--color-muted)' }}>No hay alarmas configuradas.</p>}
        </section>
      </section>
    </main>
  )
}

const buttonStyle = { padding: '12px 16px', borderRadius: 12, border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer' }
const medCard = { padding: 18, borderRadius: 20, background: 'var(--color-surface)', boxShadow: '0 12px 28px rgba(0,0,0,0.05)' }
