import styles from './ConfirmModal.module.css'

export default function ConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrap}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </div>
        <h2 className={styles.title}>Delete Task?</h2>
        <p className={styles.message}>
          This action cannot be undone. The task will be permanently removed.
        </p>
        <div className={styles.actions}>
          <button id="confirm-cancel" className={styles.cancelBtn} onClick={onCancel}>
            Keep it
          </button>
          <button id="confirm-delete" className={styles.deleteBtn} onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}
