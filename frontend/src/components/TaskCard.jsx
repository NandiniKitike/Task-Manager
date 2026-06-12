import styles from './TaskCard.module.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const isCompleted = task.status === 'Completed'

  return (
    <article className={`${styles.card} ${isCompleted ? styles.done : ''}`}>
      {/* Status Badge */}
      <div className={styles.top}>
        <span className={`${styles.badge} ${isCompleted ? styles.badgeDone : styles.badgePending}`}>
          {isCompleted ? '✅ Completed' : '🕐 Pending'}
        </span>
        <span className={styles.date}>{formatDate(task.createdAt)}</span>
      </div>

      {/* Content */}
      <div className={styles.body}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.description && (
          <p className={styles.desc}>{task.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.toggleBtn}`}
          onClick={() => onToggle(task._id)}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {isCompleted ? 'Undo' : 'Complete'}
        </button>

        <div className={styles.rightActions}>
          <button
            className={`${styles.actionBtn} ${styles.editBtn}`}
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>

          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(task._id)}
            title="Delete task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
