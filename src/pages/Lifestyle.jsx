import { Check } from 'lucide-react'
import { Card } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { MEAL_OPTIONS } from '../constants'
import { getTodayKey, getWeeklyLifestyleStats } from '../utils/helpers'

export default function Lifestyle() {
  const { data, updateLifestyle } = useFounder()
  const todayKey = getTodayKey()

  const sleep = data.lifestyle.sleep[todayKey] || {}
  const workouts = data.lifestyle.workouts[todayKey] || {}
  const meals = data.lifestyle.meals[todayKey] || {}
  const water = data.lifestyle.water[todayKey] || 0

  const weekStats = getWeeklyLifestyleStats(data.lifestyle)

  const updateSleep = (field, value) => updateLifestyle('sleep', todayKey, { [field]: value })
  const updateWorkout = (field, value) => updateLifestyle('workouts', todayKey, { [field]: value })

  const toggleMeal = (mealId) => {
    const current = meals.meals || []
    const newMeals = current.includes(mealId)
      ? current.filter(m => m !== mealId)
      : [...current, mealId]
    updateLifestyle('meals', todayKey, { meals: newMeals })
  }

  const setWater = (val) => updateLifestyle('water', todayKey, Math.max(0, val))

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">💪 Lifestyle</h1>
      </div>

      {/* Weekly Summary */}
      <div className="grid-4">
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">😴</span>
          <span className="lifestyle-stat-card__value">{weekStats.avgSleep || 0}h</span>
          <span className="lifestyle-stat-card__label">Avg Sleep</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">🏋️</span>
          <span className="lifestyle-stat-card__value">{weekStats.totalWorkouts}</span>
          <span className="lifestyle-stat-card__label">Workouts</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">💧</span>
          <span className="lifestyle-stat-card__value">{weekStats.totalWater}</span>
          <span className="lifestyle-stat-card__label">Glasses Water</span>
        </div>
        <div className="lifestyle-stat-card">
          <span className="lifestyle-stat-card__icon">🥗</span>
          <span className="lifestyle-stat-card__value">{weekStats.healthyMeals}</span>
          <span className="lifestyle-stat-card__label">Healthy Meals</span>
        </div>
      </div>

      <div className="grid-2">
        {/* Sleep */}
        <Card title="😴 Sleep Tracking">
          <div className="space-y-4">
            <div className="input-group">
              <label className="input-label">Bed Time</label>
              <input type="time" value={sleep.bedTime || ''} onChange={(e) => updateSleep('bedTime', e.target.value)} className="input" />
            </div>
            <div className="input-group">
              <label className="input-label">Wake Time</label>
              <input type="time" value={sleep.wakeTime || ''} onChange={(e) => updateSleep('wakeTime', e.target.value)} className="input" />
            </div>
            <div className="input-group">
              <label className="input-label">Sleep Quality</label>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => updateSleep('quality', level)}
                    className={`rating-btn ${sleep.quality === level ? 'rating-btn--active' : ''}`}
                  >
                    {level} {level <= 2 ? '😴' : level <= 4 ? '😊' : '🤩'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Workouts */}
        <Card title="🏋️ Workouts">
          <div className="space-y-4">
            <div className="workout-toggles">
              <button
                onClick={() => updateWorkout('morning', !workouts.morning)}
                className={`workout-toggle ${workouts.morning ? 'workout-toggle--active' : ''}`}
              >
                <span className="text-2xl">🏃</span>
                <span className="workout-toggle__label">Morning (15 min)</span>
                {workouts.morning && <Check className="w-5 h-5 text-green-500" />}
              </button>
              <button
                onClick={() => updateWorkout('evening', !workouts.evening)}
                className={`workout-toggle ${workouts.evening ? 'workout-toggle--active' : ''}`}
              >
                <span className="text-2xl">🏋️</span>
                <span className="workout-toggle__label">Evening (45 min)</span>
                {workouts.evening && <Check className="w-5 h-5 text-green-500" />}
              </button>
            </div>
            <div className="input-group">
              <label className="input-label">Workout Type</label>
              <input
                type="text"
                value={workouts.type || ''}
                onChange={(e) => updateWorkout('type', e.target.value)}
                placeholder="e.g., Gym, Cardio, Yoga"
                className="input"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid-2">
        {/* Meals */}
        <Card title="🥗 Meals">
          <div className="space-y-3">
            {MEAL_OPTIONS.map(meal => (
              <button
                key={meal.id}
                onClick={() => toggleMeal(meal.id)}
                className={`meal-toggle ${(meals.meals || []).includes(meal.id) ? 'meal-toggle--active' : ''}`}
              >
                <span className="meal-toggle__icon">{meal.icon}</span>
                <div className="meal-toggle__info">
                  <span className="meal-toggle__name">{meal.label}</span>
                  <span className="meal-toggle__time">{meal.time}</span>
                </div>
                {(meals.meals || []).includes(meal.id) && <Check className="w-5 h-5 text-green-500" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Water */}
        <Card title="💧 Water Intake">
          <div className="water-tracker">
            <div className="water-tracker__display">
              <span className="water-tracker__count">{water}</span>
              <span className="water-tracker__unit">glasses</span>
            </div>
            <div className="water-tracker__buttons">
              <button onClick={() => setWater(water - 1)} className="water-btn water-btn--minus">−</button>
              <button onClick={() => setWater(water + 1)} className="water-btn water-btn--plus">+</button>
            </div>
            <div className="progress-bar progress-bar--lg">
              <div
                className="progress-bar__fill progress-bar__fill--info"
                style={{ width: `${Math.min(100, (water / 8) * 100)}%` }}
              />
            </div>
            <div className="water-tracker__goal">Goal: 8 glasses/day</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
