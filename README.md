# TaskFlow — Full-Stack Task Management System

A production-quality task management application built with **React.js**, **Node.js/Express**, and **MongoDB**.

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18 + Vite + CSS Modules |
| Backend  | Node.js + Express.js          |
| Database | MongoDB + Mongoose             |

## Features

- ✅ Create, Read, Update, Delete tasks
- ✅ Toggle task status (Pending ↔ Completed)
- ✅ Real-time search (debounced)
- ✅ Filter by status (All / Pending / Completed)
- ✅ Pagination (9 tasks per page)
- ✅ Form validation (client + server side)
- ✅ Toast notifications (success / error)
- ✅ Loading skeletons
- ✅ Empty state illustration
- ✅ Delete confirmation modal
- ✅ Fully responsive (mobile → desktop)
- ✅ Dark mode design

---

## Project Structure

```
wtx/
├── backend/        # Node.js + Express API
│   ├── config/     # MongoDB connection
│   ├── models/     # Mongoose schemas
│   ├── routes/     # REST endpoints
│   └── middleware/ # Validation
│
└── frontend/       # React + Vite SPA
    └── src/
        ├── components/  # UI components
        ├── hooks/       # Custom React hooks
        ├── services/    # Axios API layer
        └── utils/       # Helpers
```

---

## Setup & Installation

### Prerequisites
- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **MongoDB** v6+ — [mongodb.com](https://www.mongodb.com/try/download/community)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure `.env` (already created with defaults):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
NODE_ENV=development
```

Start backend:
```bash
npm run dev      # development (nodemon auto-restart)
# or
npm start        # production
```

Backend runs on → `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → `http://localhost:3000`

> API calls are automatically proxied to `localhost:5000` via Vite's proxy config.

---

## API Reference

| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| GET    | `/api/tasks`                 | Get all tasks            |
| POST   | `/api/tasks`                 | Create a task            |
| PUT    | `/api/tasks/:id`             | Update a task            |
| DELETE | `/api/tasks/:id`             | Delete a task            |
| PATCH  | `/api/tasks/:id/complete`    | Toggle complete          |

### Query Parameters (GET /api/tasks)
| Param    | Type   | Description                      |
|----------|--------|----------------------------------|
| `status` | string | Filter: `Pending` or `Completed` |
| `search` | string | Search in title & description    |
| `page`   | number | Page number (default: 1)         |
| `limit`  | number | Items per page (default: 9)      |

---

## Database Export

To export the database:
```bash
mongodump --db taskmanager --out ./backup
```

To import:
```bash
mongorestore --db taskmanager ./backup/taskmanager
```

---

## Environment Variables

| Variable    | Default                                    | Description           |
|-------------|--------------------------------------------|-----------------------|
| `PORT`      | `5000`                                     | Backend server port   |
| `MONGO_URI` | `mongodb://localhost:27017/taskmanager`    | MongoDB connection    |
| `NODE_ENV`  | `development`                              | Environment mode      |
