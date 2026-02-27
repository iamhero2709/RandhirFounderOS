import { useState } from 'react'
import { Menu, X, Moon, Sun, ChevronLeft } from 'lucide-react'
import { NAV_ITEMS, TOTAL_DAYS } from '../../constants'
import { useFounder } from '../../context/FounderContext'
import { getDayNumber, getDaysLeft } from '../../utils/helpers'

// Bottom nav: 4 primary items + "More" button for the rest
const PRIMARY_NAV_IDS = ['dashboard', 'tracker', 'focus', 'journal']
const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter(i => PRIMARY_NAV_IDS.includes(i.id))
const MORE_NAV_ITEMS = NAV_ITEMS.filter(i => !PRIMARY_NAV_IDS.includes(i.id))

export default function Sidebar() {
  const { data, activeView, setActiveView, sidebarOpen, setSidebarOpen, theme, setTheme, updateSettings } = useFounder()
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
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
        {PRIMARY_NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveView(item.id); setMoreMenuOpen(false) }}
            className={`bottom-nav__item ${activeView === item.id ? 'bottom-nav__item--active' : ''}`}
            aria-label={item.name}
          >
            <span className="bottom-nav__emoji">{item.emoji}</span>
            <span className="bottom-nav__label">{item.name}</span>
          </button>
        ))}
        <button
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
          className={`bottom-nav__item ${moreMenuOpen || MORE_NAV_ITEMS.some(i => i.id === activeView) ? 'bottom-nav__item--active' : ''}`}
          aria-label="More options"
        >
          <span className="bottom-nav__emoji">☰</span>
          <span className="bottom-nav__label">More</span>
        </button>
      </nav>

      {/* ---- Mobile "More" Drawer ---- */}
      {moreMenuOpen && (
        <>
          <div className="more-drawer-overlay" onClick={() => setMoreMenuOpen(false)} />
          <div className="more-drawer" role="menu" aria-label="More navigation options">
            <div className="more-drawer__header">
              <span className="more-drawer__title">All Pages</span>
              <button className="more-drawer__close" onClick={() => setMoreMenuOpen(false)} aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="more-drawer__grid">
              {MORE_NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); setMoreMenuOpen(false) }}
                  className={`more-drawer__item ${activeView === item.id ? 'more-drawer__item--active' : ''}`}
                  role="menuitem"
                >
                  <span className="more-drawer__emoji">{item.emoji}</span>
                  <span className="more-drawer__label">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
