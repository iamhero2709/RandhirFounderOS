import { useState, useMemo } from 'react'
import { format, addDays, addMonths, startOfMonth, endOfMonth, differenceInCalendarMonths } from 'date-fns'
import { Card, Badge } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { TOTAL_DAYS } from '../constants'
import { getDayNumber, generateTimelineDays } from '../utils/helpers'

export default function Timeline() {
  const { data, maxDailyScore } = useFounder()
  const dayNum = getDayNumber(data.startDate)
  const days = useMemo(() => generateTimelineDays(data.startDate, data.days, maxDailyScore), [data.startDate, data.days, maxDailyScore])

  // Calculate months from start date
  const startDate = new Date(data.startDate)
  const endDate = addDays(startDate, TOTAL_DAYS - 1)
  const totalMonths = differenceInCalendarMonths(endDate, startDate) + 1

  const monthNames = Array.from({ length: totalMonths }, (_, i) => {
    const d = addMonths(startDate, i)
    return { key: format(d, 'yyyy-MM'), label: format(d, 'MMMM yyyy') }
  })

  const [activeMonth, setActiveMonth] = useState(0)

  const getColor = (day) => {
    if (day.isFuture) return 'timeline-day--future'
    if (day.isToday) return 'timeline-day--today'
    if (day.isPerfect) return 'timeline-day--perfect'
    if (day.score >= Math.ceil(maxDailyScore * 0.75)) return 'timeline-day--good'
    if (day.score >= Math.ceil(maxDailyScore * 0.5)) return 'timeline-day--okay'
    if (day.score > 0) return 'timeline-day--weak'
    return 'timeline-day--missed'
  }

  // Filter days for active month
  const activeMonthDays = days.filter(d => format(d.date, 'yyyy-MM') === monthNames[activeMonth]?.key)

  // Monthly breakdown data
  const monthlyData = monthNames.map(m => {
    const monthDays = days.filter(d => format(d.date, 'yyyy-MM') === m.key)
    const completedDays = monthDays.filter(d => d.isPast || d.isToday)
    const perfectDays = completedDays.filter(d => d.isPerfect).length
    const avgScore = completedDays.length > 0
      ? (completedDays.reduce((sum, d) => sum + d.score, 0) / completedDays.length).toFixed(1)
      : '0.0'
    return { ...m, days: completedDays.length, total: monthDays.length, perfectDays, avgScore }
  })

  const overallProgress = Math.round(((dayNum - 1) / TOTAL_DAYS) * 100)
  const perfectTotal = Object.values(data.days).filter(d => d.score === maxDailyScore).length
  const goodTotal = Object.values(data.days).filter(d => d.score >= Math.ceil(maxDailyScore * 0.75) && d.score < maxDailyScore).length
  const weakTotal = Object.values(data.days).filter(d => d.score > 0 && d.score < Math.ceil(maxDailyScore * 0.75)).length

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📅 365-Day Map</h1>
        <div className="timeline-legend">
          <span className="legend-item"><span className="legend-dot legend-dot--perfect" /> Perfect</span>
          <span className="legend-item"><span className="legend-dot legend-dot--good" /> Good</span>
          <span className="legend-item"><span className="legend-dot legend-dot--okay" /> Okay</span>
          <span className="legend-item"><span className="legend-dot legend-dot--weak" /> Weak</span>
          <span className="legend-item"><span className="legend-dot legend-dot--missed" /> Missed</span>
        </div>
      </div>

      {/* Month Tabs */}
      <div className="timeline-tabs">
        {monthNames.map((m, idx) => (
          <button
            key={m.key}
            className={`timeline-tab ${activeMonth === idx ? 'timeline-tab--active' : ''}`}
            onClick={() => setActiveMonth(idx)}
          >
            {format(addMonths(startDate, idx), 'MMM yy')}
          </button>
        ))}
      </div>

      {/* Calendar Grid for active month */}
      <Card title={monthNames[activeMonth]?.label}>
        <div className="timeline-grid">
          {activeMonthDays.map(day => (
            <div
              key={day.key}
              className={`timeline-day ${getColor(day)}`}
              title={`Day ${day.dayNumber} (${format(day.date, 'MMM d')}): ${day.score}/${maxDailyScore}`}
            >
              <span className="timeline-day__number">{day.dayNumber}</span>
              {!day.isFuture && <span className="timeline-day__score">{day.score}</span>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid-3">
        {/* Overall Progress */}
        <Card title="📊 Overall Progress">
          <div className="timeline-progress">
            <div className="timeline-progress__ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#6366f1" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${overallProgress * 2.64} 264`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="timeline-progress__text">{overallProgress}%</span>
            </div>
            <div className="timeline-progress__info">
              <span>{dayNum - 1} of {TOTAL_DAYS} days</span>
            </div>
          </div>
        </Card>

        {/* Performance */}
        <Card title="🎯 Performance">
          <div className="goals-list">
            <div className="goal-item">
              <span className="goal-item__label">⭐ Perfect Days</span>
              <span className="goal-item__value" style={{ color: 'var(--color-success)' }}>{perfectTotal}</span>
            </div>
            <div className="goal-item">
              <span className="goal-item__label">👍 Good Days</span>
              <span className="goal-item__value" style={{ color: 'var(--color-warning)' }}>{goodTotal}</span>
            </div>
            <div className="goal-item">
              <span className="goal-item__label">👎 Weak Days</span>
              <span className="goal-item__value" style={{ color: 'var(--color-danger)' }}>{weakTotal}</span>
            </div>
          </div>
        </Card>

        {/* Best Streak */}
        <Card title="🔥 Streak">
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔥</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-warning)' }}>{data.streak}</div>
            <div className="text-muted" style={{ marginTop: 4 }}>Current Streak</div>
            <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Best: {data.bestStreak || data.streak} days</div>
          </div>
        </Card>
      </div>

      {/* Monthly Breakdown — show first 6 months */}
      <Card title="📈 Monthly Breakdown">
        <div className="grid-4">
          {monthlyData.slice(0, 6).map(m => (
            <div key={m.key} className="monthly-breakdown-card">
              <h3 className="monthly-breakdown-card__title">{m.label}</h3>
              <div className="goals-list">
                <div className="goal-item">
                  <span className="goal-item__label">Days</span>
                  <span className="goal-item__value">{m.days}/{m.total}</span>
                </div>
                <div className="goal-item">
                  <span className="goal-item__label">Perfect</span>
                  <span className="goal-item__value" style={{ color: 'var(--color-success)' }}>{m.perfectDays}</span>
                </div>
                <div className="goal-item">
                  <span className="goal-item__label">Avg Score</span>
                  <span className="goal-item__value">{m.avgScore}/{maxDailyScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
