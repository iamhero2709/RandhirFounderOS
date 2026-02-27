import { X } from 'lucide-react'

// ============ CARD ============
export function Card({ title, children, action, className = '', noPadding = false }) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'card-body'}>
        {children}
      </div>
    </div>
  )
}

// ============ STAT CARD ============
export function StatCard({ icon, label, value, subtitle, progress, color = 'primary', onClick }) {
  return (
    <div className={`stat-card stat-card--${color}`} onClick={onClick} role={onClick ? 'button' : undefined}>
      <div className={`stat-card__icon stat-card__icon--${color}`}>
        {icon}
      </div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {subtitle && <div className="stat-card__subtitle">{subtitle}</div>}
      {progress !== undefined && (
        <div className="progress-bar mt-3">
          <div
            className={`progress-bar__fill progress-bar__fill--${color}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
    </div>
  )
}

// ============ MODAL ============
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button onClick={onClose} className="modal__close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============ PROGRESS BAR ============
export function ProgressBar({ value, max, color = 'primary', showLabel = false, size = 'md' }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="progress-container">
      {showLabel && (
        <div className="progress-label">
          <span>{value}</span>
          <span className="text-muted">/ {max}</span>
          <span className="progress-percent">{percent}%</span>
        </div>
      )}
      <div className={`progress-bar progress-bar--${size}`}>
        <div
          className={`progress-bar__fill progress-bar__fill--${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

// ============ BADGE ============
export function Badge({ children, variant = 'default', size = 'sm' }) {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {children}
    </span>
  )
}

// ============ EMPTY STATE ============
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action}
    </div>
  )
}

// ============ TASK ITEM ============
export function TaskItem({ item, completed, onClick, time, category }) {
  return (
    <div
      onClick={onClick}
      className={`task-item ${completed ? 'task-item--completed' : ''}`}
    >
      <div className={`task-item__checkbox ${completed ? 'task-item__checkbox--checked' : ''}`}>
        {completed && <span>✓</span>}
      </div>
      <div className="task-item__content">
        <div className="task-item__name">
          <span className="task-item__icon">{item.icon}</span>
          {item.name}
        </div>
        {time && <div className="task-item__time">✅ {time}</div>}
      </div>
      {category && (
        <Badge variant={category.color}>{category.label}</Badge>
      )}
    </div>
  )
}

// ============ GOAL PROGRESS ============
export function GoalProgress({ label, current, target, formatFn, color = 'primary' }) {
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
  const displayCurrent = formatFn ? formatFn(current) : current
  const displayTarget = formatFn ? formatFn(target) : target

  return (
    <div className="goal-progress">
      <div className="goal-progress__header">
        <span className="goal-progress__label">{label}</span>
        <span className="goal-progress__values">
          {displayCurrent} <span className="text-muted">/ {displayTarget}</span>
        </span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar__fill progress-bar__fill--${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

// ============ PROJECT SUMMARY ============
export function ProjectSummary({ name, icon, stats, onClick }) {
  return (
    <div className="project-summary" onClick={onClick} role="button">
      <div className="project-summary__left">
        <span className="project-summary__icon">{icon}</span>
        <div>
          <div className="project-summary__name">{name}</div>
          <div className="project-summary__stats">{stats}</div>
        </div>
      </div>
    </div>
  )
}

// ============ BUTTON ============
export function Button({ children, variant = 'primary', size = 'md', onClick, className = '', disabled = false, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant} btn--${size} ${className}`}
    >
      {children}
    </button>
  )
}

// ============ INPUT ============
export function Input({ label, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className="input" {...props} />
    </div>
  )
}

// ============ TEXTAREA ============
export function Textarea({ label, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea className="input textarea" {...props} />
    </div>
  )
}

// ============ TOOLTIP ============
export function Tooltip({ children, text }) {
  return (
    <div className="tooltip-wrapper">
      {children}
      <div className="tooltip-text">{text}</div>
    </div>
  )
}
