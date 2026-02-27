import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { STORAGE_KEY, DEFAULT_FOUNDER_DATA } from '../constants'
import { calculateStreak, calculateBestStreak, checkAchievements, getTodayKey, getDayData, calculateScore, getMaxDailyScore } from '../utils/helpers'
import { loadDataFromDB, saveDataToDB, setupDatabase } from '../utils/api'

const FounderContext = createContext(null)

export function FounderProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return { ...DEFAULT_FOUNDER_DATA, ...JSON.parse(saved) }
      
      const oldSaved = localStorage.getItem('founderOS-v2')
      if (oldSaved) {
        const oldData = JSON.parse(oldSaved)
        return {
          ...DEFAULT_FOUNDER_DATA,
          ...oldData,
          settings: { ...DEFAULT_FOUNDER_DATA.settings, ...(oldData.settings || {}) },
          journal: oldData.journal || {},
          focusSessions: oldData.focusSessions || [],
          dailyThoughts: oldData.dailyThoughts || {},
          customChecklist: oldData.customChecklist || null,
          bestStreak: 0,
          achievements: {
            ...DEFAULT_FOUNDER_DATA.achievements,
            ...(oldData.achievements || {})
          }
        }
      }
    } catch (e) {
      console.error('Failed to load data:', e)
    }
    return DEFAULT_FOUNDER_DATA
  })

  const [syncStatus, setSyncStatus] = useState('idle') // 'idle' | 'syncing' | 'synced' | 'error'
  const saveTimerRef = useRef(null)
  const isInitialLoad = useRef(true)

  const maxDailyScore = useMemo(() => getMaxDailyScore(data.customChecklist), [data.customChecklist])

  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState(data.settings?.theme || 'dark')

  // Load data from Neon database on startup
  useEffect(() => {
    let cancelled = false
    async function initFromDB() {
      try {
        await setupDatabase()
        const dbData = await loadDataFromDB()
        if (cancelled) return
        if (dbData && Object.keys(dbData).length > 0) {
          setData({ ...DEFAULT_FOUNDER_DATA, ...dbData })
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbData))
          setSyncStatus('synced')
        } else {
          // DB is empty, push current localStorage data to DB
          const localData = localStorage.getItem(STORAGE_KEY)
          if (localData) {
            await saveDataToDB(JSON.parse(localData))
          }
          if (!cancelled) setSyncStatus('synced')
        }
      } catch (e) {
        console.warn('DB init failed, using localStorage:', e)
        if (!cancelled) setSyncStatus('error')
      }
      isInitialLoad.current = false
    }
    initFromDB()
    return () => { cancelled = true }
  }, [])

  // Persist data to localStorage + debounced save to Neon DB
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

    if (isInitialLoad.current) return

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      setSyncStatus('syncing')
      const success = await saveDataToDB(data)
      setSyncStatus(success ? 'synced' : 'error')
    }, 2000)

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [data])

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // ============ DATA UPDATERS ============
  const updateData = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return next
    })
  }, [])

  const toggleTask = useCallback((taskId) => {
    const key = getTodayKey()
    setData(prev => {
      const dayData = { ...getDayData(prev.days, key) }
      dayData.checklist = { ...dayData.checklist }
      dayData.completedAt = { ...dayData.completedAt }

      dayData.checklist[taskId] = !dayData.checklist[taskId]
      if (dayData.checklist[taskId]) {
        dayData.completedAt[taskId] = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      } else {
        delete dayData.completedAt[taskId]
      }
      dayData.score = calculateScore(dayData.checklist)

      const ms = getMaxDailyScore(prev.customChecklist)
      const newData = {
        ...prev,
        days: { ...prev.days, [key]: dayData }
      }

      newData.streak = calculateStreak(newData.days, ms)
      newData.bestStreak = Math.max(prev.bestStreak || 0, newData.streak)
      newData.achievements = checkAchievements(newData, ms)

      return newData
    })
  }, [])

  const updateDayField = useCallback((field, value) => {
    const key = getTodayKey()
    setData(prev => {
      const dayData = { ...getDayData(prev.days, key), [field]: value }
      return { ...prev, days: { ...prev.days, [key]: dayData } }
    })
  }, [])

  const updateProject = useCallback((projectId, updates) => {
    setData(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        [projectId]: { ...prev.projects[projectId], ...updates }
      }
    }))
  }, [])

  const addProjectItem = useCallback((projectId, type, text) => {
    setData(prev => {
      const project = prev.projects[projectId]
      const key = type === 'task' ? 'tasks' : type === 'feature' ? 'features' : 'bugs'
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...project,
            [key]: [...(project[key] || []), {
              id: Date.now(),
              text,
              completed: false,
              createdAt: new Date().toISOString(),
              priority: 'medium'
            }]
          }
        }
      }
    })
  }, [])

  const toggleProjectItem = useCallback((projectId, type, itemId) => {
    setData(prev => {
      const project = prev.projects[projectId]
      const key = type === 'task' ? 'tasks' : type === 'feature' ? 'features' : 'bugs'
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...project,
            [key]: (project[key] || []).map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        }
      }
    })
  }, [])

  const deleteProjectItem = useCallback((projectId, type, itemId) => {
    setData(prev => {
      const project = prev.projects[projectId]
      const key = type === 'task' ? 'tasks' : type === 'feature' ? 'features' : 'bugs'
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectId]: {
            ...project,
            [key]: (project[key] || []).filter(item => item.id !== itemId)
          }
        }
      }
    })
  }, [])

  const updateGoals = useCallback((timeframe, period, updates) => {
    setData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [timeframe]: period
          ? { ...prev.goals[timeframe], [period]: { ...(prev.goals[timeframe]?.[period] || {}), ...updates } }
          : { ...(prev.goals[timeframe] || {}), ...updates }
      }
    }))
  }, [])

  const updateLifestyle = useCallback((category, dateKey, updates) => {
    setData(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [category]: {
          ...prev.lifestyle[category],
          [dateKey]: typeof updates === 'object'
            ? { ...(prev.lifestyle[category]?.[dateKey] || {}), ...updates }
            : updates
        }
      }
    }))
  }, [])

  const saveJournal = useCallback((dateKey, entry) => {
    setData(prev => ({
      ...prev,
      journal: { ...prev.journal, [dateKey]: entry }
    }))
  }, [])

  const addFocusSession = useCallback((session) => {
    setData(prev => ({
      ...prev,
      focusSessions: [...(prev.focusSessions || []), session]
    }))
  }, [])

  const updateSettings = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }))
    if (updates.theme) setTheme(updates.theme)
  }, [])

  const updateProfile = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }))
  }, [])

  const resetAllData = useCallback(() => {
    setData(DEFAULT_FOUNDER_DATA)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('founderOS-v2')
    saveDataToDB(DEFAULT_FOUNDER_DATA).catch(() => {})
  }, [])

  const importAllData = useCallback((newData) => {
    setData({
      ...DEFAULT_FOUNDER_DATA,
      ...newData,
      settings: { ...DEFAULT_FOUNDER_DATA.settings, ...(newData.settings || {}) }
    })
  }, [])

  const updateChecklist = useCallback((newChecklist) => {
    setData(prev => ({
      ...prev,
      customChecklist: newChecklist
    }))
  }, [])

  const saveDailyThought = useCallback((dateKey, thought) => {
    setData(prev => ({
      ...prev,
      dailyThoughts: { ...prev.dailyThoughts, [dateKey]: thought }
    }))
  }, [])

  // ============ MEDICINE TRACKER ============
  const addMedicine = useCallback((medicine) => {
    setData(prev => ({
      ...prev,
      medicine: {
        ...prev.medicine,
        list: [...(prev.medicine?.list || []), { id: Date.now(), ...medicine }]
      }
    }))
  }, [])

  const removeMedicine = useCallback((medicineId) => {
    setData(prev => ({
      ...prev,
      medicine: {
        ...prev.medicine,
        list: (prev.medicine?.list || []).filter(m => m.id !== medicineId)
      }
    }))
  }, [])

  const toggleMedicineLog = useCallback((dateKey, medicineId) => {
    setData(prev => {
      const log = { ...(prev.medicine?.log || {}) }
      const dayLog = { ...(log[dateKey] || {}) }
      if (dayLog[medicineId]) {
        delete dayLog[medicineId]
      } else {
        dayLog[medicineId] = { taken: true, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
      }
      log[dateKey] = dayLog
      return { ...prev, medicine: { ...prev.medicine, log } }
    })
  }, [])

  // ============ MARTIAL ARTS TRACKER ============
  const updateMartialArts = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      martialArts: { ...prev.martialArts, ...updates }
    }))
  }, [])

  const saveMartialArtsSession = useCallback((dateKey, session) => {
    setData(prev => ({
      ...prev,
      martialArts: {
        ...prev.martialArts,
        sessions: { ...(prev.martialArts?.sessions || {}), [dateKey]: session }
      }
    }))
  }, [])

  const addMartialArtsGoal = useCallback((text) => {
    setData(prev => ({
      ...prev,
      martialArts: {
        ...prev.martialArts,
        goals: [...(prev.martialArts?.goals || []), { id: Date.now(), text, completed: false }]
      }
    }))
  }, [])

  const toggleMartialArtsGoal = useCallback((goalId) => {
    setData(prev => ({
      ...prev,
      martialArts: {
        ...prev.martialArts,
        goals: (prev.martialArts?.goals || []).map(g =>
          g.id === goalId ? { ...g, completed: !g.completed } : g
        )
      }
    }))
  }, [])

  const removeMartialArtsGoal = useCallback((goalId) => {
    setData(prev => ({
      ...prev,
      martialArts: {
        ...prev.martialArts,
        goals: (prev.martialArts?.goals || []).filter(g => g.id !== goalId)
      }
    }))
  }, [])

  const value = {
    data,
    maxDailyScore,
    syncStatus,
    activeView,
    setActiveView,
    sidebarOpen,
    setSidebarOpen,
    theme,
    setTheme,
    updateData,
    toggleTask,
    updateDayField,
    updateProject,
    addProjectItem,
    toggleProjectItem,
    deleteProjectItem,
    updateGoals,
    updateLifestyle,
    saveJournal,
    addFocusSession,
    updateSettings,
    updateProfile,
    resetAllData,
    importAllData,
    updateChecklist,
    saveDailyThought,
    addMedicine,
    removeMedicine,
    toggleMedicineLog,
    updateMartialArts,
    saveMartialArtsSession,
    addMartialArtsGoal,
    toggleMartialArtsGoal,
    removeMartialArtsGoal
  }

  return (
    <FounderContext.Provider value={value}>
      {children}
    </FounderContext.Provider>
  )
}

export function useFounder() {
  const context = useContext(FounderContext)
  if (!context) {
    throw new Error('useFounder must be used within a FounderProvider')
  }
  return context
}

export default FounderContext
