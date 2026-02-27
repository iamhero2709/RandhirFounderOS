import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { Card } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { KUNG_FU_BELTS, KUNG_FU_TECHNIQUES } from '../constants'
import { getTodayKey } from '../utils/helpers'

export default function MartialArts() {
  const { data, updateMartialArts, saveMartialArtsSession, addMartialArtsGoal, toggleMartialArtsGoal, removeMartialArtsGoal } = useFounder()
  const todayKey = getTodayKey()

  const [newGoal, setNewGoal] = useState('')

  const martialArts = data.martialArts || { style: 'Kung Fu', currentBelt: 'white', sessions: {}, goals: [] }
  const todaySession = martialArts.sessions?.[todayKey] || {}
  const goals = martialArts.goals || []
  const currentBelt = KUNG_FU_BELTS.find(b => b.id === martialArts.currentBelt) || KUNG_FU_BELTS[0]
  const beltIndex = KUNG_FU_BELTS.findIndex(b => b.id === martialArts.currentBelt)

  // Weekly stats
  const getWeeklyStats = () => {
    const sessions = martialArts.sessions || {}
    let totalMinutes = 0
    let sessionCount = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      if (sessions[key]?.duration) {
        totalMinutes += sessions[key].duration
        sessionCount++
      }
    }
    return { totalMinutes, sessionCount }
  }

  const weekStats = getWeeklyStats()

  const updateSession = (field, value) => {
    saveMartialArtsSession(todayKey, { ...todaySession, [field]: value })
  }

  const toggleTechnique = (tech) => {
    const current = todaySession.techniques || []
    const newTechs = current.includes(tech)
      ? current.filter(t => t !== tech)
      : [...current, tech]
    updateSession('techniques', newTechs)
  }

  const handleAddGoal = () => {
    if (!newGoal.trim()) return
    addMartialArtsGoal(newGoal.trim())
    setNewGoal('')
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🥋 Kung Fu Tracker</h1>
      </div>

      {/* Stats */}
      <div className="grid-4">
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">{currentBelt.emoji}</span>
          <span className="lifestyle-stat-card__value">{currentBelt.label}</span>
          <span className="lifestyle-stat-card__label">Current Belt</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">🥊</span>
          <span className="lifestyle-stat-card__value">{weekStats.sessionCount}</span>
          <span className="lifestyle-stat-card__label">Sessions This Week</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">⏱️</span>
          <span className="lifestyle-stat-card__value">{weekStats.totalMinutes}m</span>
          <span className="lifestyle-stat-card__label">Training This Week</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">🎯</span>
          <span className="lifestyle-stat-card__value">{goals.filter(g => g.completed).length}/{goals.length}</span>
          <span className="lifestyle-stat-card__label">Goals Completed</span>
        </div>
      </div>

      {/* Belt Progress */}
      <Card title="🥋 Belt Progress">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {KUNG_FU_BELTS.map((belt) => (
            <button
              key={belt.id}
              onClick={() => updateMartialArts({ currentBelt: belt.id })}
              className={`rating-btn ${martialArts.currentBelt === belt.id ? 'rating-btn--active' : ''}`}
              style={{
                borderColor: belt.color,
                background: martialArts.currentBelt === belt.id ? belt.color + '30' : undefined
              }}
            >
              {belt.emoji} {belt.label}
            </button>
          ))}
        </div>
        <div className="progress-bar progress-bar--lg">
          <div
            className="progress-bar__fill progress-bar__fill--warning"
            style={{ width: `${((beltIndex + 1) / KUNG_FU_BELTS.length) * 100}%` }}
          />
        </div>
        <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.5rem', textAlign: 'center' }}>
          Level {beltIndex + 1} of {KUNG_FU_BELTS.length} — {beltIndex < KUNG_FU_BELTS.length - 1 ? `Next: ${KUNG_FU_BELTS[beltIndex + 1].label}` : 'Master Level Achieved! 🏆'}
        </div>
      </Card>

      <div className="grid-2">
        {/* Today's Training Session */}
        <Card title="🥊 Today's Training">
          <div className="space-y-4">
            <div className="input-group">
              <label className="input-label">Duration (minutes)</label>
              <input
                type="number"
                value={todaySession.duration || ''}
                onChange={(e) => updateSession('duration', parseInt(e.target.value) || 0)}
                placeholder="e.g., 60"
                className="input"
                min="0"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Intensity</label>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => updateSession('intensity', level)}
                    className={`rating-btn ${todaySession.intensity === level ? 'rating-btn--active' : ''}`}
                  >
                    {level} {level <= 2 ? '🐢' : level <= 4 ? '🔥' : '💥'}
                  </button>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Notes</label>
              <textarea
                value={todaySession.notes || ''}
                onChange={(e) => updateSession('notes', e.target.value)}
                placeholder="How was training today?"
                className="input textarea"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Techniques Practiced */}
        <Card title="👊 Techniques Practiced">
          <div className="space-y-2">
            {KUNG_FU_TECHNIQUES.map(tech => {
              const selected = (todaySession.techniques || []).includes(tech)
              return (
                <button
                  key={tech}
                  onClick={() => toggleTechnique(tech)}
                  className={`workout-toggle ${selected ? 'workout-toggle--active' : ''}`}
                >
                  <span className="workout-toggle__label">{tech}</span>
                  {selected && <Check className="w-5 h-5 text-green-500" />}
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Training Goals */}
      <Card title="🎯 Training Goals">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
            placeholder="Add a training goal..."
            className="input"
            style={{ flex: 1 }}
          />
          <button onClick={handleAddGoal} className="btn btn--primary btn--sm">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎯</div>
            <h3 className="empty-state__title">No goals yet</h3>
            <p className="empty-state__description">Set training goals to track your martial arts progress.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map(goal => (
              <div
                key={goal.id}
                className={`task-item ${goal.completed ? 'task-item--completed' : ''}`}
              >
                <div
                  className={`task-item__checkbox ${goal.completed ? 'task-item__checkbox--checked' : ''}`}
                  onClick={() => toggleMartialArtsGoal(goal.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {goal.completed && <span>✓</span>}
                </div>
                <div className="task-item__content" onClick={() => toggleMartialArtsGoal(goal.id)} style={{ cursor: 'pointer' }}>
                  <div className="task-item__name">{goal.text}</div>
                </div>
                <button
                  onClick={() => removeMartialArtsGoal(goal.id)}
                  className="btn btn--ghost btn--sm"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
