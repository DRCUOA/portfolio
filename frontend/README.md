# Portfolio Frontend

Vue 3 + Vite frontend for the portfolio application.

## Features

- **Vue 3** with TypeScript
- **Pinia** for state management
- **Vue Router** for navigation
- **Tailwind CSS** (via CDN) for styling
- Connected to the backend API at `http://localhost:3000/api`

## Development

```bash
npm run dev
```

This will start the Vite dev server, typically on `http://localhost:5173`.

## Routes

- `/` - Home page showing all partitions
- `/partitions/:slug` - View a partition with its projects
- `/projects/:slug` - View a project with its partitions

## Project Structure

```
src/
  ├── stores/        # Pinia stores for state management
  ├── router/        # Vue Router configuration
  ├── views/         # Page components
  ├── components/    # Reusable components
  ├── App.vue        # Root component
  └── main.ts        # Application entry point
```
