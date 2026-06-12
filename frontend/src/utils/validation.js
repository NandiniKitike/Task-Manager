/**
 * Validates a task form object.
 * Returns an object with field-level error messages.
 * Empty string means no error for that field.
 */
export function validateTaskForm({ title = '', description = '', status = '' }) {
  const errors = {}

  // Title
  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    errors.title = 'Title is required.'
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters.'
  } else if (trimmedTitle.length > 100) {
    errors.title = 'Title cannot exceed 100 characters.'
  }

  // Description (optional)
  if (description && description.trim().length > 500) {
    errors.description = 'Description cannot exceed 500 characters.'
  }

  // Status
  const validStatuses = ['Pending', 'Completed']
  if (status && !validStatuses.includes(status)) {
    errors.status = 'Status must be Pending or Completed.'
  }

  return errors
}

/** Returns true if the errors object has no keys */
export function isValid(errors) {
  return Object.keys(errors).length === 0
}
