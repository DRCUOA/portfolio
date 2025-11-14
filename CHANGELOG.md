# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- NSFW content flag for projects with comprehensive warning modal system
- NSFW toggle in admin ProjectForm with enhanced visual styling and dynamic feedback
- NSFW warning modal displayed before viewing NSFW projects (AppStoreView and ProjectDetail)
- NSFW badges and indicators throughout admin panel and project views
- Image upload functionality for screenshots via API endpoint (`POST /api/upload/screenshot`)
- Screenshot deletion functionality (`DELETE /api/upload/screenshot`)
- Screenshot preview grid with remove functionality in ProjectForm
- File upload progress indicators and error handling
- Environment variable support for backend API server port configuration
- Environment variable support for frontend development server port configuration
- Environment variable support for API base URL in frontend
- Backend CORS configuration via environment variables (supports multiple origins)
- Local screenshot support with `/screenshots/` directory in public folder
- Screenshot usage documentation and examples

### Changed
- Database schema: Added `nsfw INTEGER DEFAULT 0` column to projects table
- All existing projects automatically set to `nsfw = false` via migration
- Backend server now reads PORT from `.env` file (defaults to 3000)
- Backend CORS origins now configurable via `FRONTEND_URL` environment variable
- Frontend Vite config now reads port from `VITE_PORT` environment variable
- Frontend API base URL now reads from `VITE_API_BASE_URL` environment variable
- ProjectForm screenshot input now supports both file uploads and manual URL entry
- Screenshot URL handling: Fixed display issues in AppStoreView and ProjectDetail
- Description sections now properly extract text from JSON, avoiding raw JSON display
- Screenshot paths normalized to ensure relative paths are stored (not full URLs)

### Technical Details
- Added `nsfw INTEGER DEFAULT 0` column to projects table with automatic migration
- Added `multer` package for file upload handling
- Created upload controller (`UploadController.ts`) and routes (`uploadRoutes.ts`)
- Static file serving configured for uploaded screenshots
- Screenshot path normalization function to extract relative paths from full URLs
- Added `dotenv` package to backend dependencies
- Created `/api/.env` with `PORT` and `FRONTEND_URL` configuration
- Created `/frontend/.env` with `VITE_PORT` and `VITE_API_BASE_URL` configuration
- Updated `.gitignore` files to exclude `.env` files from version control
- Created `/frontend/public/screenshots/` directory structure for local images

### UI/UX Improvements
- NSFW warning modal with "Go Back" and "Continue" options
- NSFW badges in admin ProjectList table with "NSFW" or "Safe" labels
- NSFW badges on project cards in PartitionDetail view
- NSFW badges in ProjectDetail and AppStoreView hero sections
- Enhanced NSFW toggle in ProjectForm with visual feedback (red theme when active)
- Screenshot preview grid with thumbnail images and remove buttons
- File upload progress indicators during batch uploads
- Improved error handling and user feedback for uploads

## [1.0.1] - 2025-01-15

### Fixed
- Fixed environment variable port configuration mismatch between frontend and backend
- Updated frontend `.env` to use port 3100 for `VITE_API_BASE_URL` to match backend `PORT` configuration
- Updated frontend `.env` comment references to reflect correct backend port (3100)

### Changed
- Frontend API base URL now correctly points to backend port 3100 instead of default 3000

## [1.0.0] - 2025-01-30 - Initial Release

### Added

#### Core Application
- Full-stack portfolio application with Node.js/Express backend and Vue 3 frontend
- SQLite database with automatic initialization and seeding
- RESTful API with TypeScript for type safety
- Modern Vue 3 frontend with Vite build tooling
- Responsive design with mobile-first approach

#### Backend Features
- Express.js API server with TypeScript
- SQLite database using better-sqlite3 with automatic schema creation
- Database seeding system with fallback seed files (seed.json, seed_p_1.json)
- RESTful API endpoints for partitions, projects, and project-partitions
- Full CRUD operations for all entities
- Many-to-many relationship between projects and partitions
- Graceful shutdown handling with database cleanup
- CORS configuration for frontend integration
- Environment variable support via dotenv
- Port configuration via environment variables
- Configurable CORS origins via environment variables

#### Database Schema
- `partitions` table: Categories/sections for organizing projects
  - Fields: id, slug, name, description, sortOrder
- `projects` table: Individual portfolio projects
  - Fields: id, slug, name, tagline, shortDescription, longDescription, status, primaryRepoUrl, liveUrl, githubRepoFullName, createdAt, updatedAt, inPortfolio, nsfw
- `project_partitions` table: Many-to-many relationship with featured flag and sort order
  - Fields: projectId, partitionId, isFeatured, sortOrder
  - Foreign key constraints enabled

#### API Endpoints
- **Partitions:**
  - `GET /api/partitions` - Get all partitions
  - `GET /api/partitions/:slug` - Get partition by slug with projects
  - `POST /api/partitions` - Create new partition
  - `PUT /api/partitions/:id` - Update partition
  - `DELETE /api/partitions/:id` - Delete partition

- **Projects:**
  - `GET /api/projects` - Get all projects
  - `GET /api/projects/:slug` - Get project by slug with partitions
  - `POST /api/projects` - Create new project
  - `PUT /api/projects/:id` - Update project
  - `DELETE /api/projects/:id` - Delete project

- **Uploads:**
  - `POST /api/upload/screenshot` - Upload screenshot image file
  - `DELETE /api/upload/screenshot` - Delete uploaded screenshot file

- **Project Partitions:**
  - `POST /api/project-partitions` - Create project-partition relationship
  - `PUT /api/project-partitions/:projectId/:partitionId` - Update relationship
  - `DELETE /api/project-partitions/:projectId/:partitionId` - Delete relationship

#### Frontend Features
- Vue 3 with Composition API and TypeScript
- Pinia state management for portfolio data
- Vue Router for client-side navigation
- Tailwind CSS via CDN for styling
- Dark/light theme toggle with persistent storage
- Responsive glassmorphism UI design
- Component-based architecture

#### Frontend Routes
- `/` - Home page displaying all partitions
- `/partitions/:slug` - Partition detail view with associated projects
- `/projects/:slug` - Project detail view with associated partitions
- `/apps/:slug` - App Store-style view for projects with screenshots
- `/admin` - Admin dashboard
- `/admin/partitions` - Manage partitions list
- `/admin/partitions/new` - Create new partition
- `/admin/partitions/:id/edit` - Edit partition
- `/admin/projects` - Manage projects list
- `/admin/projects/new` - Create new project
- `/admin/projects/:id/edit` - Edit project

#### Admin Dashboard
- Full CRUD interface for partitions and projects
- Project form with rich text fields and screenshot management
- Partition form with description and sort order
- Project-partition relationship management
- Featured project flagging
- Sort order management for both partitions and project-partition relationships
- Form validation and error handling
- Loading states and user feedback

#### Public Views
- **PartitionList**: Grid view of all partitions with descriptions
- **PartitionDetail**: Detailed partition view with associated projects
  - Featured projects highlighted
  - Sort order support
  - Project cards with links to detail pages
- **ProjectDetail**: Individual project view
  - Full project information display
  - Related partitions listing
  - Links to repositories and live sites
- **AppStoreView**: App Store-style presentation
  - Hero section with app icon and metadata
  - Screenshot gallery with horizontal scrolling
  - Long description with markdown support
  - Action buttons for repositories and live sites
  - Related partitions display
  - Responsive image handling

#### Screenshot Support
- Local file support via `/screenshots/` public directory
- Remote URL support for external images
- JSON-based screenshot storage in project longDescription
- Screenshot gallery with horizontal scrolling
- Image error handling
- Support for multiple image formats (PNG, JPG, JPEG, GIF, WebP, SVG)
- Documentation and usage examples

#### Theme System
- Dark/light mode toggle
- Persistent theme preference in localStorage
- Smooth theme transitions
- System preference detection

#### Development Tools
- Concurrent development server script for running both API and frontend
- TypeScript configuration for both frontend and backend
- Hot module replacement for frontend development
- Environment variable configuration files (.env)
- Git ignore rules for sensitive files and build artifacts

#### Documentation
- README.md with setup and usage instructions
- CHANGELOG.md for tracking project changes
- Screenshot usage documentation
- Code comments and type definitions

### Technical Stack

#### Backend
- Node.js runtime
- Express.js web framework
- SQLite (better-sqlite3) database
- TypeScript for type safety
- dotenv for environment configuration
- CORS middleware for cross-origin requests

#### Frontend
- Vue 3 with Composition API
- Vite build tool and dev server
- Pinia state management
- Vue Router for navigation
- TypeScript for type safety
- Tailwind CSS for styling (via CDN)

#### Development
- Concurrently for running multiple processes
- TypeScript compiler for both projects
- Hot module replacement
- Environment variable support

### Configuration

#### Environment Variables
- **Backend (`api/.env`):**
  - `PORT` - API server port (default: 3000)
  - `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

- **Frontend (`frontend/.env`):**
  - `VITE_PORT` - Frontend dev server port (default: 5173)
  - `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:3000/api)

### Project Structure
```
portfolio/
├── api/                    # Backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # TypeScript interfaces
│   │   ├── routes/         # Express routes
│   │   ├── utils/          # Utility functions
│   │   ├── db.ts           # Database initialization
│   │   └── server.ts       # Express server setup
│   ├── dist/               # Compiled JavaScript
│   ├── portfolio.db        # SQLite database (auto-generated)
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── router/         # Vue Router config
│   │   ├── stores/         # Pinia stores
│   │   ├── views/          # Page components
│   │   ├── App.vue         # Root component
│   │   └── main.ts         # Entry point
│   ├── public/
│   │   └── screenshots/    # Local screenshot storage
│   ├── .env                # Environment variables
│   └── package.json
├── seed.json               # Primary seed data
├── seed_p_1.json          # Fallback seed data
├── CHANGELOG.md            # This file
└── README.md               # Project documentation
```

### Database Seeding
- Automatic database initialization on first run
- Seed data loaded from `seed.json` (with `seed_p_1.json` as fallback)
- Includes sample partitions, projects, and relationships
- Supports multiple project categories (Showcase, Peer Support, Experiments, Writing)

### Known Limitations
- Tailwind CSS loaded via CDN (not recommended for production)
- No authentication/authorization for admin routes
- No markdown rendering in descriptions (plain text only)

### Future Enhancements
- Install Tailwind CSS as PostCSS plugin for production
- Add authentication system for admin routes
- Add markdown rendering support
- Add search functionality
- Add filtering and sorting options
- Add analytics tracking
- Add SEO optimization
- Add image optimization/compression for uploaded screenshots
