import { useState } from 'react'
import { Edit } from 'lucide-react'
import { Card, Modal, Button, Input, GoalProgress } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { getTotalRevenue, getGoalProgress, formatCurrency } from '../utils/helpers'

export default function Goals() {
  const { data, updateGoals } = useFounder()
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editDailyModal, setEditDailyModal] = useState(false)
  const [dailyForm, setDailyForm] = useState({})
  const [editWeeklyModal, setEditWeeklyModal] = useState(false)
  const [weeklyForm, setWeeklyForm] = useState({})

  const totalRev = getTotalRevenue(data.projects)

  // March 2026 to March 2027
  const months = [
    { key: 'march_2026', label: 'March 2026' },
    { key: 'april_2026', label: 'April 2026' },
    { key: 'may_2026', label: 'May 2026' },
    { key: 'june_2026', label: 'June 2026' },
    { key: 'july_2026', label: 'July 2026' },
    { key: 'august_2026', label: 'August 2026' },
    { key: 'september_2026', label: 'September 2026' },
    { key: 'october_2026', label: 'October 2026' },
    { key: 'november_2026', label: 'November 2026' },
    { key: 'december_2026', label: 'December 2026' },
    { key: 'january_2027', label: 'January 2027' },
    { key: 'february_2027', label: 'February 2027' },
    { key: 'march_2027', label: 'March 2027' }
  ]

  const openEditModal = (monthKey) => {
    const current = data.goals.monthly[monthKey] || {}
    setEditForm({ ...current })
    setEditModal(monthKey)
  }

  const saveGoal = () => {
    updateGoals('monthly', editModal, {
      revenue: parseInt(editForm.revenue) || 0,
      users: parseInt(editForm.users) || 0,
      golubotUnits: parseInt(editForm.golubotUnits) || 0
    })
    setEditModal(null)
  }

  const openDailyEdit = () => {
    setDailyForm({ ...data.goals.daily })
    setEditDailyModal(true)
  }

  const saveDailyGoals = () => {
    updateGoals('daily', null, {
      deepWork: parseInt(dailyForm.deepWork) || 0,
      contentPosts: parseInt(dailyForm.contentPosts) || 0,
      workouts: parseInt(dailyForm.workouts) || 0
    })
    setEditDailyModal(false)
  }

  const openWeeklyEdit = () => {
    setWeeklyForm({ ...data.goals.weekly })
    setEditWeeklyModal(true)
  }

  const saveWeeklyGoals = () => {
    updateGoals('weekly', null, {
      featuresShipped: parseInt(weeklyForm.featuresShipped) || 0,
      reelsPosted: parseInt(weeklyForm.reelsPosted) || 0,
      perfectDays: parseInt(weeklyForm.perfectDays) || 0
    })
    setEditWeeklyModal(false)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🎯 Goals & Targets</h1>
      </div>

      {/* Goal Categories */}
      <div className="grid-3">
        <Card
          title="📅 Daily Goals"
          action={
            <button onClick={openDailyEdit} className="card-action">
              <Edit className="w-4 h-4" /> Edit
            </button>
          }
        >
          <div className="goals-list">
            <div className="goal-item">
              <span className="goal-item__label">💻 Deep Work</span>
              <span className="goal-item__value">{data.goals.daily.deepWork}h</span>
            </div>
            <div className="goal-item">
              <span className="goal-item__label">📱 Content Posts</span>
              <span className="goal-item__value">{data.goals.daily.contentPosts}</span>
            </div>
            <div className="goal-item">
              <span className="goal-item__label">🏋️ Workouts</span>
              <span className="goal-item__value">{data.goals.daily.workouts}</span>
            </div>
          </div>
        </Card>

        <Card
          title="📆 Weekly Goals"
          action={
            <button onClick={openWeeklyEdit} className="card-action">
              <Edit className="w-4 h-4" /> Edit
            </button>
          }
        >
          <div className="goals-list">
            <div className="goal-item">
              <span className="goal-item__label">🚀 Features Shipped</span>
              <span className="goal-item__value">{data.goals.weekly.featuresShipped}</span>
            </div>
            <div className="goal-item">
              <span className="goal-item__label">📱 Reels Posted</span>
              <span className="goal-item__value">{data.goals.weekly.reelsPosted}</span>
            </div>
            <div className="goal-item">
              <span className="goal-item__label">⭐ Perfect Days</span>
              <span className="goal-item__value">{data.goals.weekly.perfectDays}</span>
            </div>
          </div>
        </Card>

        <Card title="📈 Yearly Goals (2026)">
          <div className="goals-list">
            <div className="goal-item">
              <span className="goal-item__label">💰 Revenue</span>
              <span className="goal-item__value">{formatCurrency(data.goals.yearly[2026]?.revenue)}</span>
            </div>
            <div className="goal-item">
              <span className="goal-item__label">👥 Users</span>
              <span className="goal-item__value">{data.goals.yearly[2026]?.users?.toLocaleString('en-IN')}</span>
            </div>
            <div className="goal-item">
              <span className="goal-item__label">🤖 Golubot Units</span>
              <span className="goal-item__value">{data.goals.yearly[2026]?.golubotUnits}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Goals */}
      <Card title="🗓️ Monthly Goals (March 2026 - March 2027)">
        <div className="space-y-6">
          {months.map(({ key, label }) => {
            const goal = data.goals.monthly[key]
            if (!goal) return null
            return (
              <div key={key} className="monthly-goal-card">
                <div className="monthly-goal-card__header">
                  <h3 className="monthly-goal-card__title">{label}</h3>
                  <button onClick={() => openEditModal(key)} className="card-action">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                </div>
                <div className="space-y-3">
                  <GoalProgress label="💰 Revenue" current={totalRev} target={goal.revenue} formatFn={formatCurrency} color="success" />
                  <GoalProgress label="👥 Users" current={data.projects.verboficaAI.users} target={goal.users} color="info" />
                  <GoalProgress label="🤖 Golubot Units" current={data.projects.golubot.units} target={goal.golubotUnits} color="primary" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title={`Edit ${editModal ? months.find(m => m.key === editModal)?.label || editModal : ''} Goals`}>
        <div className="space-y-4">
          <Input label="Revenue Target (₹)" type="number" value={editForm.revenue || ''} onChange={(e) => setEditForm(p => ({ ...p, revenue: e.target.value }))} />
          <Input label="User Target" type="number" value={editForm.users || ''} onChange={(e) => setEditForm(p => ({ ...p, users: e.target.value }))} />
          <Input label="Golubot Units Target" type="number" value={editForm.golubotUnits || ''} onChange={(e) => setEditForm(p => ({ ...p, golubotUnits: e.target.value }))} />
          <div className="modal__actions">
            <Button variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveGoal}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Daily Goals Edit Modal */}
      <Modal isOpen={editDailyModal} onClose={() => setEditDailyModal(false)} title="Edit Daily Goals">
        <div className="space-y-4">
          <Input label="💻 Deep Work (hours)" type="number" value={dailyForm.deepWork || ''} onChange={(e) => setDailyForm(p => ({ ...p, deepWork: e.target.value }))} />
          <Input label="📱 Content Posts" type="number" value={dailyForm.contentPosts || ''} onChange={(e) => setDailyForm(p => ({ ...p, contentPosts: e.target.value }))} />
          <Input label="🏋️ Workouts" type="number" value={dailyForm.workouts || ''} onChange={(e) => setDailyForm(p => ({ ...p, workouts: e.target.value }))} />
          <div className="modal__actions">
            <Button variant="ghost" onClick={() => setEditDailyModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveDailyGoals}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Weekly Goals Edit Modal */}
      <Modal isOpen={editWeeklyModal} onClose={() => setEditWeeklyModal(false)} title="Edit Weekly Goals">
        <div className="space-y-4">
          <Input label="🚀 Features Shipped" type="number" value={weeklyForm.featuresShipped || ''} onChange={(e) => setWeeklyForm(p => ({ ...p, featuresShipped: e.target.value }))} />
          <Input label="📱 Reels Posted" type="number" value={weeklyForm.reelsPosted || ''} onChange={(e) => setWeeklyForm(p => ({ ...p, reelsPosted: e.target.value }))} />
          <Input label="⭐ Perfect Days" type="number" value={weeklyForm.perfectDays || ''} onChange={(e) => setWeeklyForm(p => ({ ...p, perfectDays: e.target.value }))} />
          <div className="modal__actions">
            <Button variant="ghost" onClick={() => setEditWeeklyModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveWeeklyGoals}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
