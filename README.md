# Portfolio Application

A full-stack portfolio application with a Node.js + Express + SQLite backend and Vue 3 frontend.

## Project Structure

```
portfolio/
├── api/              # Backend API (Node.js + Express + SQLite)
├── frontend/         # Frontend (Vue 3 + Vite + Pinia + Vue Router)
├── seed.json         # Seed data for database initialization
└── seed_p_1.json    # Alternative seed data source
```

## Quick Start

### Install Dependencies

1. Install backend dependencies:
   ```bash
   cd api
   npm install
   cd ..
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. Install root dependencies (for concurrently):
   ```bash
   npm install
   ```

### Run Development Servers

**Option 1: Run both servers together (recommended)**
```bash
npm run dev
```

This will start both the API server (`http://localhost:3000`) and the frontend dev server (`http://localhost:5173`) simultaneously.

**Option 2: Run servers separately**

Start the API server:
```bash
npm run dev:api
```

Start the frontend (in a separate terminal):
```bash
npm run dev:frontend
```

## API Endpoints

- `GET /api/partitions` - Get all partitions
- `GET /api/partitions/:slug` - Get a partition with its projects
- `GET /api/projects/:slug` - Get a project with its partitions

## Frontend Routes

- `/` - Home page showing all partitions
- `/partitions/:slug` - View a partition with its projects
- `/projects/:slug` - View a project with its partitions

## Technologies

### Backend
- Node.js
- Express
- SQLite (better-sqlite3)
- TypeScript

### Frontend
- Vue 3
- Vite
- Pinia (state management)
- Vue Router
- Tailwind CSS (via CDN)
- TypeScript

## Database

The SQLite database (`api/portfolio.db`) is automatically created and seeded on first run using `seed.json` (or `seed_p_1.json` as fallback).

