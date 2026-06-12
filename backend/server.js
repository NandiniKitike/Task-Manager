require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/tasks');

// ── Connect to MongoDB ──────────────────────────────────────────────────────
connectDB();

// ── Express App ─────────────────────────────────────────────────────────────
const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/tasks', taskRoutes);

// ── Serve Frontend Static Files ──────────────────────────────────────────────
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Catch-all: serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  });
});

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
