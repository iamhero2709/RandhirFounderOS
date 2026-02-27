import { useState } from 'react'
import { Edit, Plus, Trash2, X } from 'lucide-react'
import { Card, TaskItem, Badge, Modal, Button, Input } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { CHECKLIST_CATEGORIES, MOODS } from '../constants'
import { getTodayKey, getDayData, getChecklistItems } from '../utils/helpers'

export default function DailyTracker() {
  const { data, toggleTask, updateDayField, maxDailyScore, updateChecklist } = useFounder()
  const todayKey = getTodayKey()
  const todayData = getDayData(data.days, todayKey)
  const checklistItems = getChecklistItems(data.customChecklist)
  const scorePercent = maxDailyScore > 0 ? (todayData.score / maxDailyScore) * 100 : 0

  // Routine edit state
  const [showRoutineModal, setShowRoutineModal] = useState(false)
  const [editItems, setEditItems] = useState([])
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskIcon, setNewTaskIcon] = useState('✅')
  const [newTaskCategory, setNewTaskCategory] = useState('work')

  const openRoutineModal = () => {
    setEditItems(checklistItems.map(i => ({ ...i })))
    setShowRoutineModal(true)
  }

  const addTask = () => {
    if (!newTaskName.trim()) return
    const id = newTaskName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_' + Date.now()
    setEditItems([...editItems, { id, name: newTaskName.trim(), icon: newTaskIcon, category: newTaskCategory, points: 1 }])
    setNewTaskName('')
    setNewTaskIcon('✅')
  }

  const removeTask = (id) => {
    setEditItems(editItems.filter(i => i.id !== id))
  }

  const moveTask = (idx, dir) => {
    const newItems = [...editItems]
    const target = idx + dir
    if (target < 0 || target >= newItems.length) return
    ;[newItems[idx], newItems[target]] = [newItems[target], newItems[idx]]
    setEditItems(newItems)
  }

  const saveRoutine = () => {
    updateChecklist(editItems.length > 0 ? editItems : null)
    setShowRoutineModal(false)
  }

  // Group items by category
  const grouped = {}
  checklistItems.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">✅ Daily Tracker</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={openRoutineModal} className="btn btn--ghost btn--sm">
            <Edit className="w-4 h-4" /> Edit Routine
          </button>
          <Badge variant={scorePercent === 100 ? 'success' : scorePercent >= 50 ? 'warning' : 'default'} size="lg">
            {todayData.score}/{maxDailyScore} Complete
          </Badge>
        </div>
      </div>

      {/* Score Ring */}
      <Card>
        <div className="tracker-score">
          <div className="tracker-score__ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={scorePercent === 100 ? '#10b981' : '#6366f1'}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${scorePercent * 3.27} 327`}
                transform="rotate(-90 60 60)"
                className="tracker-score__ring-fill"
              />
            </svg>
            <div className="tracker-score__text">
              <span className="tracker-score__number">{todayData.score}</span>
              <span className="tracker-score__max">/{maxDailyScore}</span>
            </div>
          </div>
          <div className="tracker-score__info">
            {scorePercent === 100 ? (
              <div className="tracker-score__perfect">
                <span className="text-3xl">🏆</span>
                <span>Perfect Day! Keep the streak going!</span>
              </div>
            ) : (
              <div className="tracker-score__remaining">
                <span>{maxDailyScore - todayData.score} tasks remaining</span>
                <span className="text-muted">Complete all to maintain your streak</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Checklist by Category */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([catKey, items]) => {
          const cat = CHECKLIST_CATEGORIES[catKey] || { icon: '📋', label: catKey }
          const completed = items.filter(i => todayData.checklist[i.id]).length
          return (
            <Card
              key={catKey}
              title={`${cat.icon} ${cat.label}`}
              action={
                <Badge variant={completed === items.length ? 'success' : 'default'}>
                  {completed}/{items.length}
                </Badge>
              }
            >
              <div className="space-y-2">
                {items.map(item => (
                  <TaskItem
                    key={item.id}
                    item={item}
                    completed={todayData.checklist[item.id]}
                    onClick={() => toggleTask(item.id)}
                    time={todayData.completedAt[item.id]}
                  />
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid-2">
        {/* Mood */}
        <Card title="😊 How are you feeling?">
          <div className="mood-grid">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                className={`mood-btn ${todayData.mood === mood.id ? 'mood-btn--active' : ''}`}
                onClick={() => updateDayField('mood', mood.id)}
              >
                <span className="mood-btn__emoji">{mood.emoji}</span>
                <span className="mood-btn__label">{mood.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Energy */}
        <Card title="⚡ Energy Level">
          <div className="energy-grid">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                className={`energy-btn ${level <= todayData.energy ? 'energy-btn--active' : ''}`}
                onClick={() => updateDayField('energy', level)}
              >
                <span className="energy-btn__icon">⚡</span>
                <span className="energy-btn__level">{level}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Notes */}
      <Card title="📝 Daily Notes">
        <textarea
          className="input textarea"
          placeholder="What happened today? Wins, challenges, learnings..."
          value={todayData.notes || ''}
          onChange={(e) => updateDayField('notes', e.target.value)}
          rows={4}
        />
      </Card>

      {/* Routine Edit Modal */}
      <Modal isOpen={showRoutineModal} onClose={() => setShowRoutineModal(false)} title="✏️ Edit Daily Routine" size="lg">
        <div className="space-y-4">
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Customize your daily checklist. Add, remove or reorder tasks.
          </p>

          {/* Existing tasks */}
          <div className="space-y-2">
            {editItems.map((item, idx) => (
              <div key={item.id} className="routine-item">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button onClick={() => moveTask(idx, -1)} className="routine-item__drag" disabled={idx === 0}>▲</button>
                  <button onClick={() => moveTask(idx, 1)} className="routine-item__drag" disabled={idx === editItems.length - 1}>▼</button>
                </div>
                <span>{item.icon}</span>
                <span className="routine-item__name">{item.name}</span>
                <span className="badge badge--sm badge--default">{item.category}</span>
                <button onClick={() => removeTask(item.id)} className="routine-item__delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new task */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Add New Task</p>
            <div className="routine-add">
              <input
                className="input"
                placeholder="Task name..."
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                style={{ flex: 1 }}
              />
              <select
                className="input"
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                style={{ width: 120 }}
              >
                {Object.entries(CHECKLIST_CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
              <button onClick={addTask} className="btn btn--primary btn--sm">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          <div className="modal__actions">
            <Button variant="ghost" onClick={() => setShowRoutineModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveRoutine}>Save Routine</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
