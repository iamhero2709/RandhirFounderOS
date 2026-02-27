import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react'
import { Card, Button, Badge } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { FOCUS_PRESETS } from '../constants'
import { format } from 'date-fns'

export default function FocusTimer() {
  const { data, addFocusSession } = useFounder()
  const [preset, setPreset] = useState(FOCUS_PRESETS[0])
  const [timeLeft, setTimeLeft] = useState(preset.work * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [taskName, setTaskName] = useState('')
  const intervalRef = useRef(null)

  const totalSeconds = isBreak ? preset.break * 60 : preset.work * 60
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const startTimer = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(preset.work * 60)
  }, [preset])

  const selectPreset = useCallback((p) => {
    setPreset(p)
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(p.work * 60)
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer complete
            if (!isBreak) {
              // Work session complete
              const newSessions = sessions + 1
              setSessions(newSessions)
              addFocusSession({
                id: Date.now(),
                date: format(new Date(), 'yyyy-MM-dd'),
                duration: preset.work,
                task: taskName || 'Deep Work',
                completedAt: new Date().toISOString()
              })
              // Switch to break
              setIsBreak(true)
              return preset.break * 60
            } else {
              // Break complete
              setIsBreak(false)
              setIsRunning(false)
              return preset.work * 60
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, isBreak, preset, sessions, taskName, addFocusSession])

  // Today's sessions
  const todaySessions = (data.focusSessions || []).filter(
    s => s.date === format(new Date(), 'yyyy-MM-dd')
  )
  const totalMinutesToday = todaySessions.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⏱️ Focus Timer</h1>
        <Badge variant="primary" size="lg">
          {todaySessions.length} sessions today ({totalMinutesToday} min)
        </Badge>
      </div>

      {/* Presets */}
      <div className="grid-3">
        {FOCUS_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => selectPreset(p)}
            className={`focus-preset ${preset.label === p.label ? 'focus-preset--active' : ''}`}
          >
            <div className="focus-preset__label">{p.label}</div>
            <div className="focus-preset__time">{p.work} min work / {p.break} min break</div>
          </button>
        ))}
      </div>

      {/* Timer */}
      <Card>
        <div className="focus-timer">
          <div className="focus-timer__task-input">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What are you working on?"
              className="input"
              disabled={isRunning}
            />
          </div>

          <div className="focus-timer__display">
            <svg viewBox="0 0 200 200" className="focus-timer__ring">
              <circle cx="100" cy="100" r="85" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle
                cx="100" cy="100" r="85" fill="none"
                stroke={isBreak ? '#10b981' : '#6366f1'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${progress * 5.34} 534`}
                transform="rotate(-90 100 100)"
                className="focus-timer__ring-progress"
              />
            </svg>
            <div className="focus-timer__time">
              <div className="focus-timer__time-value">{formatTime(timeLeft)}</div>
              <div className="focus-timer__time-label">
                {isBreak ? '☕ Break Time' : '💻 Focus Time'}
              </div>
            </div>
          </div>

          <div className="focus-timer__controls">
            {!isRunning ? (
              <Button onClick={startTimer} variant="primary" size="lg">
                <Play className="w-5 h-5" /> {timeLeft === totalSeconds ? 'Start' : 'Resume'}
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="warning" size="lg">
                <Pause className="w-5 h-5" /> Pause
              </Button>
            )}
            <Button onClick={resetTimer} variant="ghost" size="lg">
              <RotateCcw className="w-5 h-5" /> Reset
            </Button>
          </div>

          <div className="focus-timer__sessions">
            Sessions completed: <strong>{sessions}</strong>
          </div>
        </div>
      </Card>

      {/* Today's Sessions */}
      {todaySessions.length > 0 && (
        <Card title="📋 Today's Focus Sessions">
          <div className="space-y-2">
            {todaySessions.map((session, i) => (
              <div key={session.id || i} className="focus-session-item">
                <span className="focus-session-item__icon">💻</span>
                <span className="focus-session-item__task">{session.task}</span>
                <span className="focus-session-item__duration">{session.duration} min</span>
                <span className="focus-session-item__time">
                  {new Date(session.completedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
