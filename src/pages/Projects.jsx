import { useState } from 'react'
import { Plus, Check, Trash2, Edit, X } from 'lucide-react'
import { Card, Modal, Badge, EmptyState, Button, Input } from '../components/ui'
import { useFounder } from '../context/FounderContext'
import { formatCurrency } from '../utils/helpers'

export default function Projects() {
  const { data, updateProject, addProjectItem, toggleProjectItem, deleteProjectItem } = useFounder()

  const [activeProject, setActiveProject] = useState('verboficaAI')
  const [newItem, setNewItem] = useState('')
  const [itemType, setItemType] = useState('task')
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [statsForm, setStatsForm] = useState({})

  const project = data.projects[activeProject]
  const projectConfig = activeProject === 'verboficaAI'
    ? { fields: ['users', 'revenue', 'mrr'], labels: { users: 'Users', revenue: 'Revenue (₹)', mrr: 'MRR (₹)' } }
    : { fields: ['units', 'revenue'], labels: { units: 'Units Sold', revenue: 'Revenue (₹)' }, extra: 'prototypeStatus' }

  const handleAddItem = () => {
    if (!newItem.trim()) return
    addProjectItem(activeProject, itemType, newItem.trim())
    setNewItem('')
  }

  const openStatsModal = () => {
    const form = {}
    projectConfig.fields.forEach(f => { form[f] = project[f] || 0 })
    if (projectConfig.extra) form[projectConfig.extra] = project[projectConfig.extra] || ''
    setStatsForm(form)
    setShowStatsModal(true)
  }

  const saveStats = () => {
    const updates = {}
    projectConfig.fields.forEach(f => {
      updates[f] = parseInt(statsForm[f]) || 0
    })
    if (projectConfig.extra) updates[projectConfig.extra] = statsForm[projectConfig.extra]
    updateProject(activeProject, updates)
    setShowStatsModal(false)
  }

  const renderItemList = (type, items, title, icon) => (
    <Card
      title={`${icon} ${title}`}
      action={<Badge variant="default">{items.filter(i => i.completed).length}/{items.length}</Badge>}
    >
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="project-item">
            <button
              onClick={() => toggleProjectItem(activeProject, type, item.id)}
              className={`project-item__check ${item.completed ? 'project-item__check--done' : ''}`}
            >
              {item.completed && <Check className="w-3 h-3" />}
            </button>
            <span className={`project-item__text ${item.completed ? 'project-item__text--done' : ''}`}>
              {item.text}
            </span>
            <button
              onClick={() => deleteProjectItem(activeProject, type, item.id)}
              className="project-item__delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <EmptyState
            icon={icon}
            title={`No ${title.toLowerCase()} yet`}
            description={`Add your first ${type} above`}
          />
        )}
      </div>
    </Card>
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🚀 Projects</h1>
        <Button onClick={openStatsModal} variant="primary">
          <Edit className="w-4 h-4" /> Update Stats
        </Button>
      </div>

      {/* Project Selector */}
      <div className="grid-2">
        {Object.entries(data.projects).map(([id, proj]) => (
          <button
            key={id}
            onClick={() => setActiveProject(id)}
            className={`project-selector ${activeProject === id ? 'project-selector--active' : ''}`}
          >
            <span className="project-selector__icon">{proj.icon}</span>
            <div className="project-selector__info">
              <div className="project-selector__name">{proj.name}</div>
              <div className="project-selector__desc">{proj.description}</div>
            </div>
            <div className="project-selector__stats">
              <div className="project-selector__revenue">{formatCurrency(proj.revenue)}</div>
              <div className="project-selector__meta">
                {id === 'verboficaAI' ? `${proj.users} users` : `${proj.units} units`}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Add Item */}
      <Card title="➕ Add New Item">
        <div className="project-add">
          <div className="project-add__types">
            {['task', 'feature', 'bug'].map(type => (
              <button
                key={type}
                onClick={() => setItemType(type)}
                className={`project-add__type ${itemType === type ? 'project-add__type--active' : ''}`}
              >
                {type === 'task' ? '📋' : type === 'feature' ? '✨' : '🐛'} {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="project-add__input">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              placeholder={`Add new ${itemType}...`}
              className="input"
            />
            <Button onClick={handleAddItem} variant="primary">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>
      </Card>

      {/* Item Lists */}
      <div className="grid-3">
        {renderItemList('task', project.tasks || [], 'Tasks', '📋')}
        {renderItemList('feature', project.features || [], 'Features', '✨')}
        {renderItemList('bug', project.bugs || [], 'Bugs', '🐛')}
      </div>

      {/* Stats Modal */}
      <Modal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} title={`Update ${project.name} Stats`}>
        <div className="space-y-4">
          {projectConfig.fields.map(field => (
            <Input
              key={field}
              label={projectConfig.labels[field]}
              type="number"
              value={statsForm[field] || ''}
              onChange={(e) => setStatsForm(prev => ({ ...prev, [field]: e.target.value }))}
            />
          ))}
          {projectConfig.extra && (
            <Input
              label="Prototype Status"
              value={statsForm[projectConfig.extra] || ''}
              onChange={(e) => setStatsForm(prev => ({ ...prev, [projectConfig.extra]: e.target.value }))}
            />
          )}
          <div className="modal__actions">
            <Button variant="ghost" onClick={() => setShowStatsModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveStats}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
