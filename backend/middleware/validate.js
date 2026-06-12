/**
 * Validation middleware for task creation and update requests.
 * Validates title, description, and status fields.
 */
const validateTask = (req, res, next) => {
  const errors = [];
  const { title, description, status } = req.body;

  // Title validation (required on POST, optional on PUT)
  if (req.method === 'POST' || title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required.');
    } else if (title.trim().length < 3) {
      errors.push('Title must be at least 3 characters.');
    } else if (title.trim().length > 100) {
      errors.push('Title cannot exceed 100 characters.');
    }
  }

  // Description validation (optional)
  if (description !== undefined && typeof description === 'string') {
    if (description.trim().length > 500) {
      errors.push('Description cannot exceed 500 characters.');
    }
  }

  // Status validation (optional, but must be valid if provided)
  if (status !== undefined) {
    const validStatuses = ['Pending', 'Completed'];
    if (!validStatuses.includes(status)) {
      errors.push('Status must be either "Pending" or "Completed".');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = { validateTask };
