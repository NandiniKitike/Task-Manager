import styles from './EmptyState.module.css'

export default function EmptyState({ isFiltered, onCreateClick }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.illustration}>
        <svg width="90" height="90" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        </svg>
      </div>
      <h2 className={styles.title}>
        {isFiltered ? 'No matching tasks' : 'No tasks yet'}
      </h2>
      <p className={styles.subtitle}>
        {isFiltered
          ? 'Try changing your search or filter.'
          : 'Create your first task and start getting things done.'}
      </p>
      {!isFiltered && (
        <button id="empty-create-btn" className={styles.btn} onClick={onCreateClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Task
        </button>
      )}
    </div>
  )
}
