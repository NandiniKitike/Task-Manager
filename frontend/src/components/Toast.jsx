import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

/**
 * Single toast item
 */
function ToastItem({ id, type, message, onRemove }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 3500)
    const remove = setTimeout(() => onRemove(id), 3800)
    return () => { clearTimeout(timer); clearTimeout(remove) }
  }, [id, onRemove])

  const icon = type === 'success'
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>

  return (
    <div className={`${styles.toast} ${styles[type]} ${exiting ? styles.exit : ''}`}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.message}>{message}</span>
    </div>
  )
}

/**
 * Toast container — receives toasts array & onRemove callback
 */
export default function Toast({ toasts, onRemove }) {
  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  )
}
