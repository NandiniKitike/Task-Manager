const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { validateTask } = require('../middleware/validate');

// ─────────────────────────────────────────────
// GET /api/tasks
// Query params: ?status=Pending|Completed, ?search=keyword, ?page=1&limit=6
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};

    // Filter by status
    if (status && ['Pending', 'Completed'].includes(status)) {
      query.status = status;
    }

    // Search in title and description
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching tasks.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/tasks — Create a new task
// ─────────────────────────────────────────────
router.post('/', validateTask, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: task,
    });
  } catch (error) {
    console.error('POST /api/tasks error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    res.status(500).json({ success: false, message: 'Server error while creating task.' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/tasks/:id — Update a task
// ─────────────────────────────────────────────
router.put('/:id', validateTask, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully.',
      data: task,
    });
  } catch (error) {
    console.error('PUT /api/tasks/:id error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID.' });
    }

    res.status(500).json({ success: false, message: 'Server error while updating task.' });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/tasks/:id/complete — Toggle status
// ─────────────────────────────────────────────
router.patch('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    await task.save();

    res.json({
      success: true,
      message: `Task marked as ${task.status}.`,
      data: task,
    });
  } catch (error) {
    console.error('PATCH /api/tasks/:id/complete error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID.' });
    }

    res.status(500).json({ success: false, message: 'Server error while toggling task status.' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/tasks/:id — Delete a task
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('DELETE /api/tasks/:id error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID.' });
    }

    res.status(500).json({ success: false, message: 'Server error while deleting task.' });
  }
});

module.exports = router;
