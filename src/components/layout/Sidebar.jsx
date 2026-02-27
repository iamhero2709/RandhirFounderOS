import { Menu, X, Moon, Sun, ChevronLeft } from 'lucide-react'
import { NAV_ITEMS, TOTAL_DAYS } from '../../constants'
import { useFounder } from '../../context/FounderContext'
import { getDayNumber, getDaysLeft } from '../../utils/helpers'

// Bottom nav items shown on mobile (most important pages)
const BOTTOM_NAV_IDS = ['dashboard', 'tracker', 'focus', 'journal', 'settings']
const BOTTOM_NAV_ITEMS = NAV_ITEMS.filter(i => BOTTOM_NAV_IDS.includes(i.id))

export default function Sidebar() {
  const { data, activeView, setActiveView, sidebarOpen, setSidebarOpen, theme, setTheme, updateSettings } = useFounder()
  const dayNum = getDayNumber(data.startDate)
  const daysLeft = getDaysLeft(data.startDate)
  const progress = Math.round((dayNum / TOTAL_DAYS) * 100)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    updateSettings({ theme: newTheme })
  }

  return (
    <>
      {/* ---- Desktop / Tablet Sidebar ---- */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--collapsed'}`}>
        {/* Header */}
        <div className="sidebar__header">
          {sidebarOpen && (
            <div className="sidebar__brand">
              <span className="sidebar__logo">🎯</span>
              <span className="sidebar__title">Founder OS</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar__toggle"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Profile */}
        {sidebarOpen && (
          <div className="sidebar__profile">
            <div className="sidebar__avatar">{data.profile.avatar || '🚀'}</div>
            <div className="sidebar__profile-info">
              <div className="sidebar__profile-name">{data.profile.name}</div>
              <div className="sidebar__profile-subtitle">Day {dayNum} of {TOTAL_DAYS}</div>
            </div>
          </div>
        )}

        {/* Progress Mini */}
        {sidebarOpen && (
          <div className="sidebar__progress">
            <div className="sidebar__progress-bar">
              <div
                className="sidebar__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="sidebar__progress-text">
              <span>{daysLeft} days left</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`sidebar__nav-item ${activeView === item.id ? 'sidebar__nav-item--active' : ''}`}
              title={item.name}
            >
              <span className="sidebar__nav-emoji">{item.emoji}</span>
              {sidebarOpen && <span className="sidebar__nav-label">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <button onClick={toggleTheme} className="sidebar__theme-toggle" title="Toggle theme">
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {sidebarOpen && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>
          {sidebarOpen && (
            <div className="sidebar__streak">
              🔥 {data.streak} day streak
            </div>
          )}
        </div>
      </aside>

      {/* ---- Mobile Bottom Navigation Bar ---- */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {BOTTOM_NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`bottom-nav__item ${activeView === item.id ? 'bottom-nav__item--active' : ''}`}
            aria-label={item.name}
          >
            <span className="bottom-nav__emoji">{item.emoji}</span>
            <span className="bottom-nav__label">{item.name}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
