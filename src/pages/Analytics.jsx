import { TrendingUp, Activity, Flame, Award } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Card, StatCard } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { ACHIEVEMENTS, COLORS } from '../constants'
import {
  getWeekScore, getTotalRevenue, getCurrentMonthGoals, getPerfectDays,
  getAverageDailyScore, getLast7Days, getLast30Days, formatCurrency,
  getCategoryCompletion, getChecklistItems
} from '../utils/helpers'

export default function Analytics() {
  const { data, maxDailyScore } = useFounder()
  const weekScore = getWeekScore(data.days)
  const perfectDays = getPerfectDays(data.days, maxDailyScore)
  const avgScore = getAverageDailyScore(data.days)
  const last7Days = getLast7Days(data.days)
  const last30Days = getLast30Days(data.days)
  const totalRev = getTotalRevenue(data.projects)
  const monthGoals = getCurrentMonthGoals(data.goals)
  const categoryCompletion = getCategoryCompletion(data.days)
  const checklistItems = getChecklistItems(data.customChecklist)

  // Completion rate by task
  const taskCompletionData = checklistItems.map(item => {
    const stats = categoryCompletion[item.id] || { done: 0, total: 0 }
    return {
      name: item.name.split('(')[0].trim(),
      rate: stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0
    }
  })

  // Revenue breakdown
  const revenueData = [
    { name: 'VerboficaAI', value: data.projects.verboficaAI.revenue || 0 },
    { name: 'Golubot', value: data.projects.golubot.revenue || 0 }
  ].filter(d => d.value > 0)

  const daysWithData = Object.values(data.days).filter(d => d.score > 0).length

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📊 Analytics</h1>
      </div>

      <div className="grid-4">
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Avg Daily Score" value={`${avgScore}/${maxDailyScore}`} color="primary" />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Days Tracked" value={daysWithData} color="info" />
        <StatCard icon={<Flame className="w-5 h-5" />} label="Best Streak" value={`${data.bestStreak || data.streak} days`} color="warning" />
        <StatCard icon={<Award className="w-5 h-5" />} label="Perfect Days" value={perfectDays} color="success" />
      </div>

      <div className="grid-2">
        {/* 30-Day Score Trend */}
        <Card title="📈 30-Day Score Trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={last30Days}>
              <defs>
                <linearGradient id="grad30" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={11} interval={4} />
              <YAxis domain={[0, maxDailyScore]} stroke="var(--color-text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" fill="url(#grad30)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Breakdown */}
        <Card title="💰 Revenue Breakdown">
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={revenueData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}>
                  {revenueData.map((_, i) => (
                    <Cell key={i} fill={COLORS.chart[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <p>No revenue data yet. Start updating your project stats!</p>
            </div>
          )}
        </Card>
      </div>

      {/* Task Completion Rate */}
      <Card title="📋 Task Completion Rate">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskCompletionData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" domain={[0, 100]} stroke="var(--color-text-muted)" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="var(--color-text-muted)" fontSize={11} width={130} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
            <Bar dataKey="rate" fill="#6366f1" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 7-Day Detail */}
      <Card title="📊 Last 7 Days Detail">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={last7Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
            <YAxis stroke="var(--color-text-muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
            <Legend />
            <Bar dataKey="score" fill="#6366f1" name="Score" radius={[4, 4, 0, 0]} />
            <Bar dataKey="energy" fill="#06b6d4" name="Energy" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid-2">
        {/* Insights */}
        <Card title="💡 Insights">
          <div className="space-y-3">
            <div className="insight-card insight-card--success">
              <Award className="w-5 h-5" />
              <div>
                <div className="insight-card__title">Weekly Performance</div>
                <p>You scored {weekScore}/{maxDailyScore * 7} this week ({Math.round((weekScore / (maxDailyScore * 7)) * 100)}%)</p>
              </div>
            </div>
            <div className="insight-card insight-card--info">
              <TrendingUp className="w-5 h-5" />
              <div>
                <div className="insight-card__title">Revenue Progress</div>
                <p>{formatCurrency(totalRev)} of {formatCurrency(monthGoals.revenue)} monthly target</p>
              </div>
            </div>
            <div className="insight-card insight-card--warning">
              <Flame className="w-5 h-5" />
              <div>
                <div className="insight-card__title">Streak</div>
                <p>{data.streak} day{data.streak !== 1 ? 's' : ''} of perfect scores. Best: {data.bestStreak || data.streak}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card title="🏆 Achievements">
          <div className="achievements-grid">
            {Object.entries(ACHIEVEMENTS).map(([key, ach]) => (
              <div key={key} className={`achievement-item ${data.achievements[key] ? 'achievement-item--unlocked' : ''}`}>
                <span className="achievement-item__icon">{ach.icon}</span>
                <div>
                  <div className="achievement-item__label">{ach.label}</div>
                  <div className="achievement-item__status">
                    {data.achievements[key] ? '✅ Unlocked' : '🔒 Locked'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
