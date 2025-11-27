# Portfolio Application

A full-stack portfolio management system with a beautiful glassmorphism UI, featuring a flexible many-to-many relationship between projects and partitions (categories). Includes a comprehensive admin dashboard for content management and a public-facing portfolio display.

## Overview

This application allows you to organize and showcase your projects across multiple categories (partitions). Projects can belong to multiple partitions simultaneously, with features like featured project flags, custom sort orders, screenshot galleries, and NSFW content warnings. The admin dashboard provides full CRUD capabilities for managing your portfolio content.

## Project Structure

```
portfolio/
├── api/                    # Backend API (Node.js + Express + SQLite)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API route definitions
│   │   ├── utils/          # Utility functions
│   │   ├── db.ts           # Database initialization & seeding
│   │   └── server.ts       # Express server setup
│   └── portfolio.db        # SQLite database (auto-created)
├── frontend/               # Frontend (Vue 3 + Vite + Pinia)
│   ├── src/
│   │   ├── components/     # Reusable Vue components
│   │   ├── views/         # Page components
│   │   │   ├── admin/     # Admin dashboard views
│   │   │   └── ...        # Public portfolio views
│   │   ├── stores/        # Pinia state management
│   │   ├── router/        # Vue Router configuration
│   │   └── App.vue        # Root component
│   └── public/
│       └── screenshots/   # Uploaded project screenshots
└── seeding/                # Seed data and seeding utilities
    ├── seed.json          # Primary seed data
    └── seed_p_1.json      # Alternative seed data source
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. **Install root dependencies** (for concurrently):
   ```bash
   npm install
   ```

2. **Install backend dependencies**:
   ```bash
   cd api
   npm install
   cd ..
   ```

3. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Environment Configuration

Create a `.env` file in the project root:

```env
# Backend Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# Frontend Configuration
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:3000/api
```

> **📖 Detailed Setup Guide**: For comprehensive environment configuration instructions, troubleshooting, and best practices, see [`documentation/myproject-globals/ENV_SETUP_GUIDE-v1.md`](documentation/myproject-globals/ENV_SETUP_GUIDE-v1.md)

### Run Development Servers

**Option 1: Run both servers together (recommended)**
```bash
npm run dev
```

This starts both the API server (`http://localhost:3000`) and the frontend dev server (`http://localhost:5173`) simultaneously using `concurrently`.

**Option 2: Run servers separately**

Start the API server:
```bash
npm run dev:api
```

Start the frontend (in a separate terminal):
```bash
npm run dev:frontend
```

### Database Initialization

The SQLite database (`api/portfolio.db`) is automatically created and seeded on first run. The system looks for seed data in this order:
1. `seed.json` (project root)
2. `seed_p_1.json` (project root)

If no seed file is found, the database will be initialized empty and ready for manual data entry via the admin dashboard.

## Features

### Data Model

- **Partitions**: Categories that organize projects (e.g., "Showcase", "Experiments", "Writing")
  - Custom sort order
  - Name and description
  - Unique slug for URLs

- **Projects**: Individual portfolio items
  - Rich metadata: name, tagline, short/long descriptions
  - Status tracking (e.g., "Active", "Archived")
  - Repository and live site URLs
  - Custom logo upload
  - Screenshot galleries with labels
  - NSFW content flagging
  - Portfolio visibility toggle

- **Project-Partition Relationships**: Many-to-many associations
  - Featured project flags
  - Custom sort order per partition
  - Projects can appear in multiple partitions

### Public Portfolio Views

- **Home Page** (`/`): Grid view of all partitions
- **Partition Detail** (`/partitions/:slug`): Shows all projects in a partition with featured projects highlighted
- **Project Detail** (`/projects/:slug`): Full project information with associated partitions
- **App Store View** (`/apps/:slug`): App Store-style presentation with screenshot galleries

### Admin Dashboard

Full CRUD interface accessible at `/admin`:

- **Partition Management**
  - Create, edit, and delete partitions
  - Manage sort orders
  - Edit descriptions

- **Project Management**
  - Create, edit, and delete projects
  - Rich form with all project fields
  - Screenshot upload and management
    - Drag-and-drop reordering
    - Label editing
    - Fullscreen preview modal
  - Logo upload
  - NSFW content flagging
  - Project-partition relationship management
  - Featured project toggling

### UI/UX Features

- **Glassmorphism Design**: Modern glass-effect UI with smooth animations
- **Dark/Light Theme**: Theme toggle with persistent storage
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Screenshot Galleries**: 
  - Hover zoom effects
  - Fullscreen modal view
  - Keyboard navigation (Arrow keys, Escape)
  - Drag-and-drop reordering in admin
- **NSFW Warnings**: Modal system for NSFW content with user consent

## API Endpoints

### Partitions
- `GET /api/partitions` - Get all partitions
- `GET /api/partitions/:slug` - Get partition with associated projects
- `POST /api/partitions` - Create new partition
- `PUT /api/partitions/:id` - Update partition
- `DELETE /api/partitions/:id` - Delete partition

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:slug` - Get project with associated partitions
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Project-Partitions
- `POST /api/project-partitions` - Create project-partition relationship
- `PUT /api/project-partitions/:projectId/:partitionId` - Update relationship
- `DELETE /api/project-partitions/:projectId/:partitionId` - Delete relationship

### Uploads
- `POST /api/upload/screenshot` - Upload project screenshot (multipart/form-data)
- `DELETE /api/upload/screenshot` - Delete screenshot file

## Frontend Routes

### Public Routes
- `/` - Home page (partition list)
- `/partitions/:slug` - Partition detail view
- `/projects/:slug` - Project detail view
- `/apps/:slug` - App Store-style project view

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/partitions` - Partition management list
- `/admin/partitions/new` - Create new partition
- `/admin/partitions/:id/edit` - Edit partition
- `/admin/projects` - Project management list
- `/admin/projects/new` - Create new project
- `/admin/projects/:id/edit` - Edit project

## Technologies

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite** (better-sqlite3) - Database
- **TypeScript** - Type safety
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **Vue 3** - Progressive JavaScript framework
  - Composition API
  - `<script setup>` syntax
- **Vite** - Build tool and dev server
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS** (via CDN) - Utility-first CSS framework

## Database Schema

### Tables

**partitions**
- `id` (TEXT, PRIMARY KEY)
- `slug` (TEXT, UNIQUE)
- `name` (TEXT)
- `description` (TEXT, nullable)
- `sortOrder` (INTEGER)

**projects**
- `id` (TEXT, PRIMARY KEY)
- `slug` (TEXT, UNIQUE)
- `name` (TEXT)
- `tagline` (TEXT, nullable)
- `shortDescription` (TEXT, nullable)
- `longDescription` (TEXT, nullable)
- `status` (TEXT)
- `primaryRepoUrl` (TEXT, nullable)
- `liveUrl` (TEXT, nullable)
- `githubRepoFullName` (TEXT, nullable)
- `logoUrl` (TEXT, nullable)
- `createdAt` (TEXT, ISO 8601)
- `updatedAt` (TEXT, ISO 8601)
- `inPortfolio` (INTEGER, DEFAULT 1)
- `nsfw` (INTEGER, DEFAULT 0)

**project_partitions**
- `projectId` (TEXT, FOREIGN KEY)
- `partitionId` (TEXT, FOREIGN KEY)
- `isFeatured` (INTEGER, DEFAULT 0)
- `sortOrder` (INTEGER)
- PRIMARY KEY (`projectId`, `partitionId`)

## Screenshot Management

Screenshots are stored in `frontend/public/screenshots/` organized by project slug. The system supports:
- Image uploads (JPEG, PNG, GIF, WebP, SVG)
- 10MB file size limit
- Automatic path normalization
- Label support for descriptive captions
- Drag-and-drop reordering in admin panel
- Fullscreen preview modal

## Development

### Building for Production

**Backend:**
```bash
cd api
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

The built frontend will be in `frontend/dist/`.

### Database Migrations

The database automatically handles schema migrations. New columns are added via try-catch blocks in `api/src/db.ts` during initialization.

## Notes

- **No Authentication**: Admin routes are currently unprotected. Add authentication for production use.
- **Tailwind via CDN**: Currently using Tailwind CSS via CDN. Consider installing as PostCSS plugin for production optimization.
- **Plain Text Descriptions**: Long descriptions are stored as plain text. Markdown rendering could be added for richer formatting.

## License

ISC
