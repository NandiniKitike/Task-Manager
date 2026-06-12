import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Interceptors for global error shaping ───────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

// ── Task API Service ────────────────────────────────────────────────────────
export const taskService = {
  /**
   * Get all tasks with optional filters
   * @param {{ status?: string, search?: string, page?: number, limit?: number }} params
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams()
    if (params.status && params.status !== 'all') query.set('status', params.status)
    if (params.search && params.search.trim()) query.set('search', params.search.trim())
    if (params.page) query.set('page', params.page)
    if (params.limit) query.set('limit', params.limit)
    return api.get(`/tasks?${query.toString()}`)
  },

  /** Create a new task */
  create: (data) => api.post('/tasks', data),

  /** Update an existing task by ID */
  update: (id, data) => api.put(`/tasks/${id}`, data),

  /** Delete a task by ID */
  delete: (id) => api.delete(`/tasks/${id}`),

  /** Toggle task status between Pending and Completed */
  toggleComplete: (id) => api.patch(`/tasks/${id}/complete`),
}
