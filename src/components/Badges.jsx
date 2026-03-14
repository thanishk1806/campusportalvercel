export function StatusBadge({ status }) {
  const map = {
    PENDING: 'badge-pending',
    IN_PROGRESS: 'badge-in_progress',
    RESOLVED: 'badge-resolved',
  }
  return (
    <span className={map[status] || 'badge-pending'}>
      {status?.replace('_', ' ')}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const map = {
    HIGH: 'badge-high',
    MEDIUM: 'badge-medium',
    LOW: 'badge-low',
  }
  return (
    <span className={map[priority] || 'badge-medium'}>
      {priority}
    </span>
  )
}
