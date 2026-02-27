import {
  Home, CheckSquare, Rocket, Target, TrendingUp, Heart, Calendar,
  Settings, Timer, BookOpen
} from 'lucide-react'

// ============ THEME COLORS ============
export const COLORS = {
  primary: '#6366f1',    // Indigo
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  secondary: '#8b5cf6',  // Violet
  accent: '#06b6d4',     // Cyan
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  chart: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']
}

// ============ DAILY CHECKLIST (DEFAULT) ============
export const DEFAULT_CHECKLIST_ITEMS = [
  { id: 'wake6am', name: 'Wake up at 6 AM', icon: '⏰', category: 'routine', points: 1 },
  { id: 'morningWorkout', name: 'Morning workout (15 min)', icon: '🏃', category: 'health', points: 1 },
  { id: 'deepWork', name: '3 hours deep work', icon: '💻', category: 'work', points: 1 },
  { id: 'contentPost', name: 'Post 1 Reel/Short', icon: '📱', category: 'marketing', points: 1 },
  { id: 'healthyMeals', name: 'Healthy meals (no junk)', icon: '🥗', category: 'health', points: 1 },
  { id: 'eveningWorkout', name: 'Evening workout (45 min)', icon: '🏋️', category: 'health', points: 1 },
  { id: 'reflection', name: 'Reflection / Journal', icon: '📝', category: 'growth', points: 1 },
  { id: 'sleep11pm', name: 'In bed by 11 PM', icon: '😴', category: 'routine', points: 1 }
]

export const CHECKLIST_CATEGORIES = {
  routine: { label: 'Routine', color: 'blue', icon: '🔁' },
  health: { label: 'Health', color: 'green', icon: '💪' },
  work: { label: 'Work', color: 'purple', icon: '💻' },
  marketing: { label: 'Marketing', color: 'pink', icon: '📱' },
  growth: { label: 'Growth', color: 'amber', icon: '🌱' }
}

// ============ NAVIGATION ============
export const NAV_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, emoji: '🏠' },
  { id: 'tracker', name: 'Daily Tracker', icon: CheckSquare, emoji: '✅' },
  { id: 'projects', name: 'Projects', icon: Rocket, emoji: '🚀' },
  { id: 'goals', name: 'Goals & Targets', icon: Target, emoji: '🎯' },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp, emoji: '📊' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, emoji: '💪' },
  { id: 'timeline', name: '365-Day Map', icon: Calendar, emoji: '📅' },
  { id: 'focus', name: 'Focus Timer', icon: Timer, emoji: '⏱️' },
  { id: 'journal', name: 'Journal', icon: BookOpen, emoji: '📓' },
  { id: 'settings', name: 'Settings', icon: Settings, emoji: '⚙️' }
]

// ============ ACHIEVEMENTS ============
export const ACHIEVEMENTS = {
  sevenDayStreak: { label: '7-Day Streak', icon: '🔥', description: 'Complete 7 perfect days in a row' },
  perfectWeek: { label: 'Perfect Week', icon: '⭐', description: 'Score 56/56 in a week' },
  first1K: { label: 'First ₹1K', icon: '💰', description: 'Earn your first ₹1,000 revenue' },
  first10K: { label: 'First ₹10K', icon: '💵', description: 'Cross ₹10,000 total revenue' },
  hundredUsers: { label: '100 Users', icon: '👥', description: 'Get 100 users on VerboficaAI' },
  thirtyWorkouts: { label: '30 Workouts', icon: '💪', description: 'Complete 30 workout sessions' },
  fiftyContentPosts: { label: '50 Content Posts', icon: '📱', description: 'Post 50 reels/shorts' },
  twentyOneDayStreak: { label: '21-Day Streak', icon: '🏆', description: '21 perfect days - habit formed!' },
  first50K: { label: 'First ₹50K', icon: '🤑', description: 'Cross ₹50,000 total revenue' },
  hundredDays: { label: '100 Days Done', icon: '💎', description: 'Complete 100 days of the challenge' },
  twoHundredDays: { label: '200 Days Done', icon: '👑', description: 'Complete 200 days — relentless!' },
  yearComplete: { label: '365 Days', icon: '🎯', description: 'Complete the full year. Legendary.' }
}

// ============ FOUNDER QUOTES (AGGRESSIVE) ============
export const FOUNDER_QUOTES = [
  { text: "While they sleep, you grind. While they party, you build. While they doubt, you ship.", author: "Founder Mindset" },
  { text: "Nobody's coming to save you. Get up, get out, and make it happen.", author: "David Goggins" },
  { text: "Your only competition is who you were yesterday. Destroy that person.", author: "Founder OS" },
  { text: "Obsessed is a word the lazy use to describe the dedicated.", author: "Grant Cardone" },
  { text: "Be so good they can't ignore you. Then ship again.", author: "Steve Martin" },
  { text: "The graveyard of startups is full of founders who 'tried their best.' Don't try — execute.", author: "Founder Mindset" },
  { text: "1% better every day = 37x better in a year. The math doesn't lie.", author: "James Clear" },
  { text: "You didn't come this far to only come this far.", author: "Tom Brady" },
  { text: "Revenue fixes everything. Ship the product, close the deal, repeat.", author: "Founder OS" },
  { text: "Pain is temporary. Regret is forever. Choose the grind.", author: "Eric Thomas" },
  { text: "Outwork everyone. Outlearn everyone. Outlast everyone. That's the playbook.", author: "Founder Mindset" },
  { text: "Every rejection is redirection. Every failure is data. Keep building.", author: "Founder OS" },
  { text: "The market doesn't care about your feelings. Ship fast, iterate faster.", author: "Paul Graham" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "You're either building your dream or building someone else's. Wake up.", author: "Founder Mindset" },
  { text: "Most people overestimate what they can do in a day and underestimate what they can do in 365 days.", author: "Bill Gates" },
  { text: "Comfort is the enemy of growth. Stay uncomfortable, stay dangerous.", author: "Founder OS" },
  { text: "Don't wait for opportunity. Create it. Build it. Ship it. Now.", author: "Founder Mindset" },
  { text: "Code, content, and cold outreach — the founder's holy trinity.", author: "Founder OS" },
  { text: "You have exactly one life. Are you going to spend it scrolling or shipping?", author: "Founder Mindset" }
]

// ============ DEFAULT DATA ============
export const DEFAULT_FOUNDER_DATA = {
  startDate: '2026-03-01',
  profile: {
    name: 'Randhir',
    timezone: 'Asia/Calcutta',
    targetDate: '2027-02-28',
    avatar: '🚀'
  },
  days: {},
  customChecklist: null, // null = use DEFAULT_CHECKLIST_ITEMS
  projects: {
    verboficaAI: {
      name: 'VerboficaAI',
      icon: '📱',
      description: 'AI-powered language learning app',
      users: 0,
      revenue: 0,
      mrr: 0,
      features: [],
      bugs: [],
      tasks: [],
      history: []
    },
    golubot: {
      name: 'Golubot',
      icon: '🤖',
      description: 'Smart home robot assistant',
      units: 0,
      revenue: 0,
      features: [],
      bugs: [],
      tasks: [],
      prototypeStatus: 'Design phase',
      history: []
    }
  },
  goals: {
    daily: { deepWork: 3, contentPosts: 1, workouts: 2 },
    weekly: { featuresShipped: 2, reelsPosted: 14, perfectDays: 5 },
    monthly: {
      march_2026: { revenue: 5000, users: 200, golubotUnits: 3 },
      april_2026: { revenue: 65000, users: 500, golubotUnits: 10 },
      may_2026: { revenue: 162000, users: 1000, golubotUnits: 25 },
      june_2026: { revenue: 320000, users: 1500, golubotUnits: 50 },
      july_2026: { revenue: 400000, users: 2000, golubotUnits: 70 },
      august_2026: { revenue: 500000, users: 2500, golubotUnits: 90 },
      september_2026: { revenue: 600000, users: 3000, golubotUnits: 110 },
      october_2026: { revenue: 750000, users: 3500, golubotUnits: 130 },
      november_2026: { revenue: 900000, users: 4000, golubotUnits: 150 },
      december_2026: { revenue: 1000000, users: 4500, golubotUnits: 170 },
      january_2027: { revenue: 1200000, users: 5000, golubotUnits: 190 },
      february_2027: { revenue: 1400000, users: 5500, golubotUnits: 210 },
      march_2027: { revenue: 1500000, users: 6000, golubotUnits: 230 }
    },
    quarterly: { q1: { revenue: 232000, users: 1700, golubotUnits: 88 } },
    yearly: { 2026: { revenue: 500000, users: 3000, golubotUnits: 200 } }
  },
  lifestyle: {
    sleep: {},
    workouts: {},
    meals: {},
    water: {}
  },
  streak: 0,
  bestStreak: 0,
  achievements: {
    sevenDayStreak: false,
    perfectWeek: false,
    first1K: false,
    first10K: false,
    hundredUsers: false,
    thirtyWorkouts: false,
    fiftyContentPosts: false,
    twentyOneDayStreak: false,
    first50K: false,
    hundredDays: false,
    twoHundredDays: false,
    yearComplete: false
  },
  journal: {},
  focusSessions: [],
  dailyThoughts: {},
  settings: {
    theme: 'dark',
    notifications: true,
    weekStartsOn: 'monday'
  }
}

// ============ MOODS ============
export const MOODS = [
  { id: 'great', emoji: '🤩', label: 'Great' },
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'stressed', emoji: '😤', label: 'Stressed' }
]

// ============ MEALS ============
export const MEAL_OPTIONS = [
  { id: 'breakfast', label: 'Breakfast', icon: '🍳', time: 'Morning' },
  { id: 'lunch', label: 'Lunch', icon: '🍱', time: 'Afternoon' },
  { id: 'dinner', label: 'Dinner', icon: '🍽️', time: 'Evening' },
  { id: 'snacks', label: 'Healthy Snacks', icon: '🥙', time: 'Anytime' }
]

// ============ FOCUS TIMER PRESETS ============
export const FOCUS_PRESETS = [
  { label: 'Quick Focus', work: 25, break: 5 },
  { label: 'Deep Work', work: 50, break: 10 },
  { label: 'Marathon', work: 90, break: 20 }
]

export const STORAGE_KEY = 'founderOS-v3'
export const TOTAL_DAYS = 365
