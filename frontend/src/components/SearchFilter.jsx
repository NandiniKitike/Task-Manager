import { useEffect, useRef, useState } from 'react'
import styles from './SearchFilter.module.css'

const DEBOUNCE_MS = 400

export default function SearchFilter({ onFilter, onCreateClick }) {
  const [search, setSearch] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const debounceRef = useRef(null)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onFilter({ search, status: activeStatus })
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
  }, [search, activeStatus]) // eslint-disable-line

  const handleStatus = (status) => {
    setActiveStatus(status)
  }

  const clearSearch = () => setSearch('')

  return (
    <div className={styles.bar}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="search-input"
          type="text"
          className={styles.searchInput}
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
        {search && (
          <button className={styles.clearBtn} onClick={clearSearch} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {['all', 'Pending', 'Completed'].map((s) => (
          <button
            key={s}
            id={`filter-${s.toLowerCase()}`}
            className={`${styles.filterBtn} ${activeStatus === s ? styles.active : ''}`}
            onClick={() => handleStatus(s)}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* New Task */}
      <button id="create-task-btn" className={styles.newBtn} onClick={onCreateClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Task
      </button>
    </div>
  )
}
