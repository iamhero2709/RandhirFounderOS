import { useState, useRef } from 'react'
import { Download, Upload, Trash2, User, Moon, Sun } from 'lucide-react'
import { Card, Button, Input, Modal } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { exportData, importData } from '../utils/helpers'

export default function Settings() {
  const { data, updateProfile, updateSettings, resetAllData, importAllData, theme, setTheme } = useFounder()
  const [showResetModal, setShowResetModal] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: data.profile.name,
    avatar: data.profile.avatar || '🚀',
    targetDate: data.profile.targetDate
  })
  const fileInputRef = useRef(null)

  const handleExport = () => exportData(data)

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importData(file)
      importAllData(imported)
      alert('Data imported successfully!')
    } catch (err) {
      alert('Failed to import: ' + err.message)
    }
  }

  const handleReset = () => {
    resetAllData()
    setShowResetModal(false)
    window.location.reload()
  }

  const saveProfile = () => {
    updateProfile(profileForm)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    updateSettings({ theme: newTheme })
  }

  const avatarOptions = ['🚀', '💻', '🎯', '⚡', '🔥', '👨‍💻', '🦊', '🐱', '🦁', '🐺', '🎮', '🏆']

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
      </div>

      <div className="grid-2">
        {/* Profile */}
        <Card title="👤 Profile">
          <div className="space-y-4">
            <Input
              label="Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
            />
            <div className="input-group">
              <label className="input-label">Avatar</label>
              <div className="avatar-grid">
                {avatarOptions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setProfileForm(p => ({ ...p, avatar: emoji }))}
                    className={`avatar-option ${profileForm.avatar === emoji ? 'avatar-option--active' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Target Date"
              type="date"
              value={profileForm.targetDate}
              onChange={(e) => setProfileForm(p => ({ ...p, targetDate: e.target.value }))}
            />
            <Button onClick={saveProfile} variant="primary">Save Profile</Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card title="🎨 Appearance">
          <div className="space-y-4">
            <div className="setting-row">
              <div>
                <div className="setting-row__label">Theme</div>
                <div className="setting-row__desc">Toggle between light and dark mode</div>
              </div>
              <button onClick={toggleTheme} className="theme-toggle-btn">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <Card title="💾 Data Management">
        <div className="settings-data">
          <div className="settings-data__item">
            <div>
              <div className="settings-data__label">Export Data</div>
              <div className="settings-data__desc">Download a JSON backup of all your data</div>
            </div>
            <Button onClick={handleExport} variant="primary">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>

          <div className="settings-data__item">
            <div>
              <div className="settings-data__label">Import Data</div>
              <div className="settings-data__desc">Restore from a previously exported backup</div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
              <Upload className="w-4 h-4" /> Import
            </Button>
          </div>

          <div className="settings-data__item settings-data__item--danger">
            <div>
              <div className="settings-data__label text-red-500">Reset All Data</div>
              <div className="settings-data__desc">This will permanently delete all your data</div>
            </div>
            <Button onClick={() => setShowResetModal(true)} variant="danger">
              <Trash2 className="w-4 h-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card title="ℹ️ About">
        <div className="about-section">
          <h3 className="text-lg font-bold">🎯 Founder OS v4.0</h3>
          <p className="text-muted mt-1">A personal operating system for founders on a 365-day hustle journey.</p>
          <p className="text-muted mt-2 text-sm">Built with React + Vite + Tailwind CSS</p>
          <p className="text-muted text-sm">Made with ❤️ by {data.profile.name}</p>
        </div>
      </Card>

      {/* Reset Modal */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="⚠️ Reset All Data?">
        <div className="space-y-4">
          <p className="text-muted">This will permanently delete all your tracking data, journal entries, focus sessions, and project progress. This cannot be undone.</p>
          <p className="font-medium text-red-500">Are you sure you want to reset everything?</p>
          <div className="modal__actions">
            <Button variant="ghost" onClick={() => setShowResetModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleReset}>Yes, Reset Everything</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
