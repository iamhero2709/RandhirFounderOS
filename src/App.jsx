import { useEffect, useState } from 'react'
import { useFounder } from './context/FounderContext'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import DailyTracker from './pages/DailyTracker'
import Projects from './pages/Projects'
import Goals from './pages/Goals'
import Analytics from './pages/Analytics'
import Lifestyle from './pages/Lifestyle'
import Timeline from './pages/Timeline'
import FocusTimer from './pages/FocusTimer'
import Journal from './pages/Journal'
import MedicineTracker from './pages/MedicineTracker'
import MartialArts from './pages/MartialArts'
import Settings from './pages/Settings'
import './App.css'

const PAGES = {
  dashboard: Dashboard,
  tracker: DailyTracker,
  projects: Projects,
  goals: Goals,
  analytics: Analytics,
  lifestyle: Lifestyle,
  timeline: Timeline,
  focus: FocusTimer,
  journal: Journal,
  medicine: MedicineTracker,
  martialArts: MartialArts,
  settings: Settings,
}

function InstallBanner({ onDismiss, onInstall }) {
  return (
    <div className="pwa-banner" role="alert">
      <span className="pwa-banner__icon">📲</span>
      <div className="pwa-banner__text">
        <strong>Install Founder OS</strong>
        <span> — tap </span>
        <button className="pwa-banner__install" onClick={onInstall}>Install</button>
        <span> or use your browser menu → "Add to Home Screen".</span>
      </div>
      <button className="pwa-banner__close" onClick={onDismiss} aria-label="Dismiss">✕</button>
    </div>
  )
}

function SyncIndicator() {
  const { syncStatus } = useFounder()
  if (syncStatus === 'idle') return null

  const statusMap = {
    syncing: { icon: '🔄', label: 'Syncing...' },
    synced: { icon: '☁️', label: 'Saved to cloud' },
    error: { icon: '⚠️', label: 'Offline mode' }
  }
  const { icon, label } = statusMap[syncStatus] || {}
  if (!icon) return null

  return (
    <div
      className="sync-indicator"
      title={label}
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        padding: '0.4rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        background: 'var(--card-bg, #1e1e2e)',
        border: '1px solid var(--border-color, #333)',
        color: 'var(--text-secondary, #aaa)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        opacity: syncStatus === 'synced' ? 0.6 : 1,
        transition: 'opacity 0.3s'
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function App() {
  const { activeView, setActiveView } = useFounder()
  const PageComponent = PAGES[activeView] || Dashboard

  // Handle ?view= query param from PWA shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    if (view && PAGES[view]) {
      setActiveView(view)
      // Clean the URL without reloading
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [setActiveView])

  // PWA install prompt
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-banner-dismissed')
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches

    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      if (!dismissed && !isStandalone) setShowBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.prompt()
      installPrompt.userChoice.then(() => {
        setInstallPrompt(null)
        setShowBanner(false)
      })
    } else {
      setShowBanner(false)
    }
    sessionStorage.setItem('pwa-banner-dismissed', '1')
  }

  const handleDismiss = () => {
    setShowBanner(false)
    sessionStorage.setItem('pwa-banner-dismissed', '1')
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {showBanner && <InstallBanner onDismiss={handleDismiss} onInstall={handleInstall} />}
        <PageComponent />
      </main>
      <SyncIndicator />
    </div>
  )
}

export default App