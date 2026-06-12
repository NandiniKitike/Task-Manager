import styles from './Header.module.css'

export default function Header({ stats }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.brandName}>TaskFlow</h1>
            <p className={styles.tagline}>Stay organized. Stay ahead.</p>
          </div>
        </div>

        {/* Stats chips */}
        <div className={styles.stats}>
          <div className={styles.chip}>
            <span className={styles.chipNumber}>{stats.total}</span>
            <span className={styles.chipLabel}>Total</span>
          </div>
          <div className={`${styles.chip} ${styles.chipPending}`}>
            <span className={styles.chipNumber}>{stats.pending}</span>
            <span className={styles.chipLabel}>Pending</span>
          </div>
          <div className={`${styles.chip} ${styles.chipDone}`}>
            <span className={styles.chipNumber}>{stats.completed}</span>
            <span className={styles.chipLabel}>Done</span>
          </div>
        </div>
      </div>
    </header>
  )
}
