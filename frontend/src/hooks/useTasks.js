import { useState, useCallback, useRef } from 'react'
import { taskService } from '../services/api'

/**
 * Custom hook that owns all task state and CRUD operations.
 * Returns tasks, pagination, loading/error state, and action handlers.
 */
export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Keep filters in a ref so fetchTasks always uses the latest values
  const filtersRef = useRef({ status: 'all', search: '', page: 1 })

  const fetchTasks = useCallback(async (overrides = {}) => {
    const params = { ...filtersRef.current, ...overrides }
    filtersRef.current = params

    setLoading(true)
    setError(null)
    try {
      const res = await taskService.getAll({ ...params, limit: 9 })
      setTasks(res.data)
      setPagination(res.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (data) => {
    const res = await taskService.create(data)
    await fetchTasks()
    return res
  }, [fetchTasks])

  const updateTask = useCallback(async (id, data) => {
    const res = await taskService.update(id, data)
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)))
    return res
  }, [])

  const deleteTask = useCallback(async (id) => {
    await taskService.delete(id)
    // Refetch to keep pagination correct
    await fetchTasks()
  }, [fetchTasks])

  const toggleTask = useCallback(async (id) => {
    const res = await taskService.toggleComplete(id)
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)))
    return res
  }, [])

  const changePage = useCallback((page) => {
    fetchTasks({ page })
  }, [fetchTasks])

  const applyFilters = useCallback((filters) => {
    fetchTasks({ ...filters, page: 1 })
  }, [fetchTasks])

  // Computed stats from all tasks (server-side totals via re-fetch or client-side snapshot)
  const stats = {
    total: pagination.total,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
  }

  return {
    tasks,
    pagination,
    loading,
    error,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    changePage,
    applyFilters,
  }
}
