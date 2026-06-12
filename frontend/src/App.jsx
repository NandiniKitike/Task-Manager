import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import SearchFilter from './components/SearchFilter'
import TaskCard from './components/TaskCard'
import TaskModal from './components/TaskModal'
import ConfirmModal from './components/ConfirmModal'
import EmptyState from './components/EmptyState'
import Pagination from './components/Pagination'
import Toast from './components/Toast'
import { useTasks } from './hooks/useTasks'

let toastId = 0

export default function App() {
  const {
    tasks, pagination, loading, error,
    stats, fetchTasks,
    createTask, updateTask, deleteTask, toggleTask,
    changePage, applyFilters,
  } = useTasks()

  // Toast state
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = 'success') => {
    setToasts((prev) => [...prev, { id: ++toastId, message, type }])
  }, [])
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Confirm delete state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Track current filters to know if filtered (for EmptyState)
  const [isFiltered, setIsFiltered] = useState(false)

  // Initial load
  useEffect(() => { fetchTasks() }, [fetchTasks])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const openCreate = () => { setEditingTask(null); setModalOpen(true) }
  const openEdit   = (task) => { setEditingTask(task); setModalOpen(true) }
  const closeModal = () => setModalOpen(false)

  const handleFilter = useCallback((filters) => {
    const filtered = (filters.search?.trim() !== '') || (filters.status !== 'all')
    setIsFiltered(filtered)
    applyFilters(filters)
  }, [applyFilters])

  const handleSubmit = async (form) => {
    if (editingTask) {
      await updateTask(editingTask._id, form)
      addToast('Task updated successfully!')
    } else {
      await createTask(form)
      addToast('Task created successfully!')
    }
  }

  const handleDelete = (id) => { setDeletingId(id); setConfirmOpen(true) }
  const confirmDelete = async () => {
    try {
      await deleteTask(deletingId)
      addToast('Task deleted.')
    } catch {
      addToast('Failed to delete task.', 'error')
    } finally {
      setConfirmOpen(false)
      setDeletingId(null)
    }
  }

  const handleToggle = async (id) => {
    try {
      const res = await toggleTask(id)
      addToast(`Marked as ${res.data.status}.`)
    } catch {
      addToast('Failed to update status.', 'error')
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />

      <Header stats={stats} />

      <main className="main-content">
        <SearchFilter onFilter={handleFilter} onCreateClick={openCreate} />

        <section className="task-section">
          {/* Loading Skeletons */}
          {loading && (
            <div className="skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="error-banner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && tasks.length === 0 && (
            <EmptyState isFiltered={isFiltered} onCreateClick={openCreate} />
          )}

          {/* Task Grid */}
          {!loading && !error && tasks.length > 0 && (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && tasks.length > 0 && (
            <Pagination pagination={pagination} onPageChange={changePage} />
          )}
        </section>
      </main>

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
