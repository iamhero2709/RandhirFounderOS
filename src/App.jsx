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

function App() {
  const { activeView } = useFounder()
  const PageComponent = PAGES[activeView] || Dashboard

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <PageComponent />
      </main>
    </div>
  )
}

export default App