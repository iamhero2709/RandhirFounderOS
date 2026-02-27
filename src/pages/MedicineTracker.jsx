import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { Card } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { MEDICINE_FREQUENCIES } from '../constants'
import { getTodayKey } from '../utils/helpers'

export default function MedicineTracker() {
  const { data, addMedicine, removeMedicine, toggleMedicineLog } = useFounder()
  const todayKey = getTodayKey()

  const [showAdd, setShowAdd] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'once_daily', notes: '' })

  const medicines = data.medicine?.list || []
  const todayLog = data.medicine?.log?.[todayKey] || {}

  const takenCount = medicines.filter(m => todayLog[m.id]).length
  const adherencePercent = medicines.length > 0 ? Math.round((takenCount / medicines.length) * 100) : 0

  // Weekly adherence
  const getWeeklyAdherence = () => {
    const log = data.medicine?.log || {}
    let totalDoses = 0
    let takenDoses = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const dayLog = log[key] || {}
      totalDoses += medicines.length
      takenDoses += medicines.filter(m => dayLog[m.id]).length
    }
    return totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0
  }

  const handleAdd = () => {
    if (!newMed.name.trim()) return
    addMedicine(newMed)
    setNewMed({ name: '', dosage: '', frequency: 'once_daily', notes: '' })
    setShowAdd(false)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">💊 Medicine Tracker</h1>
      </div>

      {/* Stats */}
      <div className="grid-4">
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">💊</span>
          <span className="lifestyle-stat-card__value">{medicines.length}</span>
          <span className="lifestyle-stat-card__label">Medicines</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">✅</span>
          <span className="lifestyle-stat-card__value">{takenCount}/{medicines.length}</span>
          <span className="lifestyle-stat-card__label">Taken Today</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">📊</span>
          <span className="lifestyle-stat-card__value">{adherencePercent}%</span>
          <span className="lifestyle-stat-card__label">Today Adherence</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">📈</span>
          <span className="lifestyle-stat-card__value">{getWeeklyAdherence()}%</span>
          <span className="lifestyle-stat-card__label">Weekly Adherence</span>
        </div>
      </div>

      {/* Today's Medicines */}
      <Card
        title="📋 Today's Medicines"
        action={
          <button onClick={() => setShowAdd(!showAdd)} className="btn btn--primary btn--sm">
            <Plus className="w-4 h-4" /> Add
          </button>
        }
      >
        {showAdd && (
          <div className="space-y-3" style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '12px', background: 'var(--glass-bg)' }}>
            <div className="input-group">
              <label className="input-label">Medicine Name</label>
              <input
                type="text"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                placeholder="e.g., Vitamin D"
                className="input"
              />
            </div>
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">Dosage</label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  placeholder="e.g., 500mg"
                  className="input"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Frequency</label>
                <select
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  className="input"
                >
                  {MEDICINE_FREQUENCIES.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Notes</label>
              <input
                type="text"
                value={newMed.notes}
                onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
                placeholder="e.g., Take after meals"
                className="input"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleAdd} className="btn btn--primary btn--sm">Save</button>
              <button onClick={() => setShowAdd(false)} className="btn btn--ghost btn--sm">Cancel</button>
            </div>
          </div>
        )}

        {medicines.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">💊</div>
            <h3 className="empty-state__title">No medicines added</h3>
            <p className="empty-state__description">Add your medicines to start tracking daily intake.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {medicines.map(med => {
              const taken = !!todayLog[med.id]
              const freq = MEDICINE_FREQUENCIES.find(f => f.id === med.frequency)
              return (
                <div
                  key={med.id}
                  className={`task-item ${taken ? 'task-item--completed' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`task-item__checkbox ${taken ? 'task-item__checkbox--checked' : ''}`}
                    onClick={() => toggleMedicineLog(todayKey, med.id)}
                  >
                    {taken && <span>✓</span>}
                  </div>
                  <div className="task-item__content" onClick={() => toggleMedicineLog(todayKey, med.id)}>
                    <div className="task-item__name">
                      <span className="task-item__icon">💊</span>
                      {med.name} {med.dosage && <span style={{ opacity: 0.7 }}>({med.dosage})</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', opacity: 0.7 }}>
                      <span>{freq?.label}</span>
                      {med.notes && <span>• {med.notes}</span>}
                      {taken && todayLog[med.id]?.time && <span>• ✅ {todayLog[med.id].time}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeMedicine(med.id)}
                    className="btn btn--ghost btn--sm"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Adherence Progress */}
      {medicines.length > 0 && (
        <Card title="📊 Today's Progress">
          <div className="water-tracker">
            <div className="water-tracker__display">
              <span className="water-tracker__count">{adherencePercent}%</span>
              <span className="water-tracker__unit">adherence</span>
            </div>
            <div className="progress-bar progress-bar--lg">
              <div
                className={`progress-bar__fill ${adherencePercent === 100 ? 'progress-bar__fill--success' : 'progress-bar__fill--primary'}`}
                style={{ width: `${adherencePercent}%` }}
              />
            </div>
            <div className="water-tracker__goal">
              {takenCount} of {medicines.length} medicines taken today
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
