import { useState } from 'react'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { format, subDays, addDays } from 'date-fns'
import { Card, Button, Badge } from '../components/ui'
import { useFounder } from '../context/FounderContext'

export default function Journal() {
  const { data, saveJournal } = useFounder()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const dateKey = format(selectedDate, 'yyyy-MM-dd')
  const isToday = dateKey === format(new Date(), 'yyyy-MM-dd')

  const entry = data.journal[dateKey] || {
    gratitude: ['', '', ''],
    wins: '',
    challenges: '',
    learnings: '',
    tomorrowPlan: '',
    freeWrite: ''
  }

  const [form, setForm] = useState(entry)

  const handleDateChange = (direction) => {
    const newDate = direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1)
    setSelectedDate(newDate)
    const key = format(newDate, 'yyyy-MM-dd')
    setForm(data.journal[key] || {
      gratitude: ['', '', ''],
      wins: '',
      challenges: '',
      learnings: '',
      tomorrowPlan: '',
      freeWrite: ''
    })
  }

  const handleSave = () => {
    saveJournal(dateKey, form)
  }

  const updateGratitude = (index, value) => {
    const newGratitude = [...(form.gratitude || ['', '', ''])]
    newGratitude[index] = value
    setForm(prev => ({ ...prev, gratitude: newGratitude }))
  }

  const hasContent = Object.values(form).some(v =>
    Array.isArray(v) ? v.some(i => i.trim()) : (v && v.trim())
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📓 Journal</h1>
        <Button onClick={handleSave} variant="primary">
          <Save className="w-4 h-4" /> Save Entry
        </Button>
      </div>

      {/* Date Selector */}
      <div className="journal-date-nav">
        <button onClick={() => handleDateChange('prev')} className="journal-date-btn">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="journal-date-display">
          <span className="journal-date-display__date">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          {isToday && <Badge variant="primary">Today</Badge>}
          {hasContent && <Badge variant="success">Written</Badge>}
        </div>
        <button onClick={() => handleDateChange('next')} className="journal-date-btn" disabled={isToday}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid-2">
        {/* Gratitude */}
        <Card title="🙏 Gratitude (3 things)">
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="gratitude-input">
                <span className="gratitude-input__number">{i + 1}.</span>
                <input
                  type="text"
                  value={(form.gratitude || [])[i] || ''}
                  onChange={(e) => updateGratitude(i, e.target.value)}
                  placeholder={`I'm grateful for...`}
                  className="input"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Wins */}
        <Card title="🏆 Today's Wins">
          <textarea
            className="input textarea"
            value={form.wins || ''}
            onChange={(e) => setForm(prev => ({ ...prev, wins: e.target.value }))}
            placeholder="What went well today? What did you accomplish?"
            rows={4}
          />
        </Card>
      </div>

      <div className="grid-2">
        {/* Challenges */}
        <Card title="⚡ Challenges">
          <textarea
            className="input textarea"
            value={form.challenges || ''}
            onChange={(e) => setForm(prev => ({ ...prev, challenges: e.target.value }))}
            placeholder="What was difficult? What blocked you?"
            rows={4}
          />
        </Card>

        {/* Learnings */}
        <Card title="💡 Learnings">
          <textarea
            className="input textarea"
            value={form.learnings || ''}
            onChange={(e) => setForm(prev => ({ ...prev, learnings: e.target.value }))}
            placeholder="What did you learn today?"
            rows={4}
          />
        </Card>
      </div>

      {/* Tomorrow Plan */}
      <Card title="📋 Tomorrow's Plan">
        <textarea
          className="input textarea"
          value={form.tomorrowPlan || ''}
          onChange={(e) => setForm(prev => ({ ...prev, tomorrowPlan: e.target.value }))}
          placeholder="What are the top 3 priorities for tomorrow?"
          rows={3}
        />
      </Card>

      {/* Free Write */}
      <Card title="✍️ Free Write">
        <textarea
          className="input textarea"
          value={form.freeWrite || ''}
          onChange={(e) => setForm(prev => ({ ...prev, freeWrite: e.target.value }))}
          placeholder="Write anything on your mind... reflections, ideas, thoughts..."
          rows={6}
        />
      </Card>
    </div>
  )
}
