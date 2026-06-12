import styles from './Pagination.module.css'

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total } = pagination
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={styles.wrap}>
      <span className={styles.info}>{total} task{total !== 1 ? 's' : ''}</span>
      <div className={styles.controls}>
        <button
          className={styles.btn}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={`${styles.btn} ${p === page ? styles.active : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          className={styles.btn}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
