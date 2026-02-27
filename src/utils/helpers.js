import { format, differenceInDays, subDays, addDays } from 'date-fns'
import { TOTAL_DAYS, DEFAULT_CHECKLIST_ITEMS } from '../constants'

// ============ CHECKLIST HELPERS ============
export const getChecklistItems = (customChecklist) => {
  return customChecklist && customChecklist.length > 0 ? customChecklist : DEFAULT_CHECKLIST_ITEMS
}

export const getMaxDailyScore = (customChecklist) => {
  return getChecklistItems(customChecklist).length
}

// ============ DATE HELPERS ============
export const getTodayKey = () => format(new Date(), 'yyyy-MM-dd')

export const getDayNumber = (startDate) => {
  const start = new Date(startDate)
  const today = new Date()
  return Math.max(0, Math.min(TOTAL_DAYS, Math.ceil(differenceInDays(today, start)) + 1))
}

export const getDaysLeft = (startDate) => TOTAL_DAYS - getDayNumber(startDate)

export const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN')}`

export const formatDate = (date, fmt = 'yyyy-MM-dd') => format(date, fmt)

// ============ SCORE HELPERS ============
export const getDayData = (days, dateKey) => {
  return days[dateKey] || {
    checklist: {},
    completedAt: {},
    score: 0,
    mood: null,
    energy: 0,
    notes: ''
  }
}

export const calculateScore = (checklist) => {
  return Object.values(checklist).filter(Boolean).length
}

export const getGoalProgress = (current, target) => {
  if (!target || target === 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

// ============ WEEK HELPERS ============
export const getWeekScore = (days) => {
  let score = 0
  for (let i = 0; i < 7; i++) {
    const date = subDays(new Date(), i)
    const key = format(date, 'yyyy-MM-dd')
    score += days[key]?.score || 0
  }
  return score
}

export const getLast7Days = (days) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const key = format(date, 'yyyy-MM-dd')
    const dayData = days[key] || {}
    return {
      date: format(date, 'EEE'),
      fullDate: format(date, 'MMM d'),
      score: dayData.score || 0,
      mood: dayData.mood || null,
      energy: dayData.energy || 0
    }
  })
}

export const getLast30Days = (days) => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const key = format(date, 'yyyy-MM-dd')
    const dayData = days[key] || {}
    return {
      date: format(date, 'MMM d'),
      score: dayData.score || 0,
      energy: dayData.energy || 0
    }
  })
}

// ============ STREAK HELPERS ============
export const calculateStreak = (days, maxScore) => {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = subDays(today, i)
    const key = format(date, 'yyyy-MM-dd')
    const dayData = days[key]
    if (dayData && dayData.score === maxScore) {
      streak++
    } else if (i === 0) {
      continue
    } else {
      break
    }
  }
  return streak
}

export const calculateBestStreak = (days, maxScore) => {
  let bestStreak = 0
  let currentStreak = 0
  const sortedKeys = Object.keys(days).sort()

  for (let i = 0; i < sortedKeys.length; i++) {
    if (days[sortedKeys[i]]?.score === maxScore) {
      currentStreak++
      bestStreak = Math.max(bestStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  return bestStreak
}

// ============ REVENUE HELPERS ============
export const getTotalRevenue = (projects) => {
  return (projects.verboficaAI?.revenue || 0) + (projects.golubot?.revenue || 0)
}

export const getCurrentMonthGoals = (goals) => {
  const month = format(new Date(), 'MMMM').toLowerCase()
  return goals.monthly[month] || goals.monthly.march
}

// ============ ANALYTICS HELPERS ============
export const getPerfectDays = (days, maxScore) => {
  return Object.values(days).filter(d => d.score === maxScore).length
}

export const getAverageDailyScore = (days) => {
  const daysWithData = Object.values(days).filter(d => d.score > 0)
  if (daysWithData.length === 0) return 0
  const total = daysWithData.reduce((sum, d) => sum + d.score, 0)
  return (total / daysWithData.length).toFixed(1)
}

export const getCategoryCompletion = (days) => {
  const categories = {}
  Object.values(days).forEach(day => {
    if (!day.checklist) return
    Object.entries(day.checklist).forEach(([taskId, done]) => {
      if (!categories[taskId]) categories[taskId] = { done: 0, total: 0 }
      categories[taskId].total++
      if (done) categories[taskId].done++
    })
  })
  return categories
}

// ============ LIFESTYLE HELPERS ============
export const getWeeklyLifestyleStats = (lifestyle) => {
  const stats = {
    avgSleep: 0,
    totalWorkouts: 0,
    totalWater: 0,
    healthyMeals: 0
  }

  let sleepDays = 0
  for (let i = 0; i < 7; i++) {
    const date = subDays(new Date(), i)
    const key = format(date, 'yyyy-MM-dd')

    const sleep = lifestyle.sleep[key]
    if (sleep?.bedTime && sleep?.wakeTime) {
      sleepDays++
      const wake = parseInt(sleep.wakeTime?.split(':')[0] || 0)
      const bed = parseInt(sleep.bedTime?.split(':')[0] || 0)
      stats.avgSleep += wake > bed ? wake - bed : (24 - bed) + wake
    }

    const workout = lifestyle.workouts[key]
    if (workout?.morning) stats.totalWorkouts++
    if (workout?.evening) stats.totalWorkouts++

    stats.totalWater += lifestyle.water[key] || 0

    const meals = lifestyle.meals[key]?.meals
    if (meals) stats.healthyMeals += meals.length
  }

  if (sleepDays > 0) stats.avgSleep = (stats.avgSleep / sleepDays).toFixed(1)
  return stats
}

// ============ ACHIEVEMENT CHECKER ============
export const checkAchievements = (data, maxScore) => {
  const achievements = { ...data.achievements }
  const totalRev = getTotalRevenue(data.projects)
  const streak = calculateStreak(data.days, maxScore)
  const weekScore = getWeekScore(data.days)
  const dayNum = getDayNumber(data.startDate)

  if (streak >= 7) achievements.sevenDayStreak = true
  if (streak >= 21) achievements.twentyOneDayStreak = true
  if (weekScore === maxScore * 7) achievements.perfectWeek = true
  if (totalRev >= 1000) achievements.first1K = true
  if (totalRev >= 10000) achievements.first10K = true
  if (totalRev >= 50000) achievements.first50K = true
  if (data.projects.verboficaAI?.users >= 100) achievements.hundredUsers = true
  if (dayNum >= 100) achievements.hundredDays = true
  if (dayNum >= 200) achievements.twoHundredDays = true
  if (dayNum >= 365) achievements.yearComplete = true

  let workoutCount = 0
  Object.values(data.lifestyle?.workouts || {}).forEach(w => {
    if (w.morning) workoutCount++
    if (w.evening) workoutCount++
  })
  if (workoutCount >= 30) achievements.thirtyWorkouts = true

  return achievements
}

// ============ EXPORT/IMPORT ============
export const exportData = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `founder-os-backup-${getTodayKey()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch {
        reject(new Error('Invalid JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// ============ TIMELINE HELPERS ============
export const generateTimelineDays = (startDate, days, maxScore) => {
  const start = new Date(startDate)
  const dayNum = getDayNumber(startDate)

  return Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const date = addDays(start, i)
    const key = format(date, 'yyyy-MM-dd')
    const dayData = days[key] || {}
    const isPast = i < dayNum - 1
    const isToday = i === dayNum - 1
    const isFuture = i >= dayNum

    return {
      date,
      key,
      dayNumber: i + 1,
      score: dayData.score || 0,
      isPast,
      isToday,
      isFuture,
      isPerfect: dayData.score === maxScore
    }
  })
}

// ============ DAILY QUOTE ============
export const getDailyQuote = (quotes) => {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return quotes[seed % quotes.length]
}
