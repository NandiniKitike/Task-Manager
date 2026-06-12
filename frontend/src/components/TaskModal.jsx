import { useEffect, useRef, useState } from 'react'
import { validateTaskForm, isValid } from '../utils/validation'
import styles from './TaskModal.module.css'

const INITIAL = { title: '', description: '', status: 'Pending' }

export default function TaskModal({ isOpen, task, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const titleRef = useRef(null)

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      setForm(task
        ? { title: task.title, description: task.description || '', status: task.status }
        : INITIAL
      )
      setErrors({})
      setSubmitting(false)
      setTimeout(() => titleRef.current?.focus(), 80)
    }
  }, [isOpen, task])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateTaskForm(form)
    if (!isValid(errs)) { setErrors(errs); return }

    setSubmitting(true)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setErrors({ global: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  const isEdit = Boolean(task)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Global error */}
        {errors.global && (
          <div className={styles.globalError}>{errors.global}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className={styles.group}>
            <label htmlFor="task-title" className={styles.label}>
              Task Title <span className={styles.required}>*</span>
            </label>
            <input
              ref={titleRef}
              id="task-title"
              name="title"
              type="text"
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="e.g. Design the homepage"
              maxLength={100}
              value={form.title}
              onChange={handleChange}
              autoComplete="off"
            />
            <div className={styles.fieldMeta}>
              <span className={styles.errorMsg}>{errors.title || ''}</span>
              <span className={styles.counter}>{form.title.length} / 100</span>
            </div>
          </div>

          {/* Description */}
          <div className={styles.group}>
            <label htmlFor="task-description" className={styles.label}>Description</label>
            <textarea
              id="task-description"
              name="description"
              className={`${styles.input} ${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Add more context about this task…"
              maxLength={500}
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
            <div className={styles.fieldMeta}>
              <span className={styles.errorMsg}>{errors.description || ''}</span>
              <span className={styles.counter}>{form.description.length} / 500</span>
            </div>
          </div>

          {/* Status */}
          <div className={styles.group}>
            <label htmlFor="task-status" className={styles.label}>Status</label>
            <div className={styles.selectWrap}>
              <select
                id="task-status"
                name="status"
                className={`${styles.input} ${styles.select}`}
                value={form.status}
                onChange={handleChange}
              >
                <option value="Pending">🕐 Pending</option>
                <option value="Completed">✅ Completed</option>
              </select>
              <svg className={styles.selectArrow} width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting} id="submit-btn">
              {submitting
                ? <span className={styles.spinner}></span>
                : isEdit ? 'Save Changes' : 'Create Task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
