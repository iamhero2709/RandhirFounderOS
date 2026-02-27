import { useState } from 'react'
import { CheckSquare, Calendar, TrendingUp, Award, ChevronRight, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { Card, StatCard, TaskItem, GoalProgress } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { TOTAL_DAYS, FOUNDER_QUOTES, NAV_ITEMS } from '../constants'
import {
  getTodayKey, getDayNumber, getDaysLeft, getDayData, getWeekScore,
  getTotalRevenue, getCurrentMonthGoals, getGoalProgress, getLast7Days,
  formatCurrency, getPerfectDays, getAverageDailyScore, getChecklistItems, getDailyQuote
} from '../utils/helpers'

export default function Dashboard() {
  const { data, toggleTask, setActiveView, maxDailyScore, saveDailyThought } = useFounder()
  const todayKey = getTodayKey()
  const todayData = getDayData(data.days, todayKey)
  const dayNum = getDayNumber(data.startDate)
  const daysLeft = getDaysLeft(data.startDate)
  const totalRev = getTotalRevenue(data.projects)
  const monthGoals = getCurrentMonthGoals(data.goals)
  const weekScore = getWeekScore(data.days)
  const last7Days = getLast7Days(data.days)
  const perfectDays = getPerfectDays(data.days, maxDailyScore)
  const avgScore = getAverageDailyScore(data.days)
  const checklistItems = getChecklistItems(data.customChecklist)
  const quote = getDailyQuote(FOUNDER_QUOTES)

  const [thought, setThought] = useState(data.dailyThoughts?.[todayKey] || '')
  const [thoughtSaved, setThoughtSaved] = useState(false)

  const handleSaveThought = () => {
    saveDailyThought(todayKey, thought)
    setThoughtSaved(true)
    setTimeout(() => setThoughtSaved(false), 2000)
  }

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="dashboard-hero__content">
          <div className="dashboard-hero__left">
            <h1 className="dashboard-hero__title">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {data.profile.name} 👋
            </h1>
            <p className="dashboard-hero__subtitle">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
            <div className="dashboard-hero__stats">
              <div className="dashboard-hero__stat">
                <span className="dashboard-hero__stat-value">{todayData.score}/{maxDailyScore}</span>
                <span className="dashboard-hero__stat-label">Today</span>
              </div>
              <div className="dashboard-hero__stat-divider" />
              <div className="dashboard-hero__stat">
                <span className="dashboard-hero__stat-value">{data.streak} 🔥</span>
                <span className="dashboard-hero__stat-label">Streak</span>
              </div>
              <div className="dashboard-hero__stat-divider" />
              <div className="dashboard-hero__stat">
                <span className="dashboard-hero__stat-value">{daysLeft}</span>
                <span className="dashboard-hero__stat-label">Days Left</span>
              </div>
            </div>
          </div>
          <div className="dashboard-hero__right">
            <div className="dashboard-hero__ring">
              <svg viewBox="0 0 120 120" className="dashboard-hero__ring-svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="rgba(255,255,255,0.9)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(dayNum / TOTAL_DAYS) * 327} 327`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="dashboard-hero__ring-text">
                <span className="dashboard-hero__ring-number">Day {dayNum}</span>
                <span className="dashboard-hero__ring-label">of {TOTAL_DAYS}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Banner */}
      <div className="motivation-banner">
        <p className="motivation-banner__quote">"{quote.text}"</p>
        <p className="motivation-banner__author">— {quote.author}</p>
      </div>

      {/* Mobile Quick Navigate - visible only on mobile */}
      <div className="mobile-quick-nav">
        <div className="mobile-quick-nav__grid">
          {NAV_ITEMS.filter(i => i.id !== 'dashboard').map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="mobile-quick-nav__item"
            >
              <span className="mobile-quick-nav__emoji">{item.emoji}</span>
              <span className="mobile-quick-nav__label">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid-4">
        <StatCard
          icon={<CheckSquare className="w-5 h-5" />}
          label="Today's Score"
          value={`${todayData.score}/${maxDailyScore}`}
          progress={getGoalProgress(todayData.score, maxDailyScore)}
          color="primary"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="This Week"
          value={`${weekScore}/${maxDailyScore * 7}`}
          progress={getGoalProgress(weekScore, maxDailyScore * 7)}
          color="info"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Total Revenue"
          value={formatCurrency(totalRev)}
          subtitle={`Target: ${formatCurrency(monthGoals.revenue)}`}
          progress={getGoalProgress(totalRev, monthGoals.revenue)}
          color="success"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Perfect Days"
          value={perfectDays}
          subtitle={`Avg Score: ${avgScore}`}
          color="warning"
        />
      </div>

      <div className="grid-3-1">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Daily Thought */}
          <div className="daily-thought">
            <div className="daily-thought__header">
              <span className="daily-thought__title">💭 Daily Thought & Reflection</span>
              {thoughtSaved && <span className="daily-thought__saved">✓ Saved</span>}
            </div>
            <textarea
              className="input textarea"
              placeholder="What's on your mind today? Your vision, a learning, or a bold thought..."
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              rows={3}
            />
            <button onClick={handleSaveThought} className="btn btn--primary btn--sm" style={{ marginTop: 10 }}>
              Save Thought
            </button>
          </div>

          {/* Quick Tasks */}
          <Card
            title="✅ Today's Tasks"
            action={
              <button onClick={() => setActiveView('tracker')} className="card-action">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            }
          >
            <div className="space-y-2">
              {checklistItems.map(item => (
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

          {/* 7-Day Chart */}
          <Card title="📊 7-Day Progress">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis domain={[0, maxDailyScore]} stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" fill="url(#dashGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Projects */}
          <Card
            title="🚀 Projects"
            action={
              <button onClick={() => setActiveView('projects')} className="card-action">
                Manage <ChevronRight className="w-4 h-4" />
              </button>
            }
          >
            <div className="space-y-3">
              <div className="project-card" onClick={() => setActiveView('projects')}>
                <div className="project-card__icon">📱</div>
                <div className="project-card__info">
                  <div className="project-card__name">VerboficaAI</div>
                  <div className="project-card__meta">{data.projects.verboficaAI.users} users</div>
                </div>
                <div className="project-card__revenue">{formatCurrency(data.projects.verboficaAI.revenue)}</div>
              </div>
              <div className="project-card" onClick={() => setActiveView('projects')}>
                <div className="project-card__icon">🤖</div>
                <div className="project-card__info">
                  <div className="project-card__name">Golubot</div>
                  <div className="project-card__meta">{data.projects.golubot.units} units</div>
                </div>
                <div className="project-card__revenue">{formatCurrency(data.projects.golubot.revenue)}</div>
              </div>
            </div>
          </Card>

          {/* Monthly Goals */}
          <Card title="🎯 Monthly Goals">
            <div className="space-y-4">
              <GoalProgress label="Revenue" current={totalRev} target={monthGoals.revenue} formatFn={formatCurrency} color="success" />
              <GoalProgress label="Users" current={data.projects.verboficaAI.users} target={monthGoals.users} color="info" />
              <GoalProgress label="Golubot Units" current={data.projects.golubot.units} target={monthGoals.golubotUnits} color="primary" />
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="⚡ Quick Actions">
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => setActiveView('focus')}>
                <Zap className="w-4 h-4" /> Start Focus
              </button>
              <button className="quick-action-btn" onClick={() => setActiveView('journal')}>
                <span>📓</span> Write Journal
              </button>
              <button className="quick-action-btn" onClick={() => setActiveView('lifestyle')}>
                <span>💪</span> Log Workout
              </button>
              <button className="quick-action-btn" onClick={() => setActiveView('analytics')}>
                <span>📊</span> View Analytics
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
