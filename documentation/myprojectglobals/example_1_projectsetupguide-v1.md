# Project Setup Guide v1

## Overview
This guide provides standardized instructions for setting up environment configuration and implementing a status monitor footer across all full-stack projects. This ensures consistent configuration management and visual status monitoring.

---

## 1. Environment Configuration

### 1.1 Root .env File Setup

Create or update `.env` file at project root with the following required variables:

```env
# Server Configuration
PORT=3001
FRONTEND_PORT=5174
FRONTEND_URL=http://localhost:5174

# Environment
NODE_ENV=development

# Frontend API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Concurrent Development Flag (for footer status)
DEV_FULL=false
```

**Important Notes:**
- Preserve any existing variables in `.env` (API keys, database URLs, etc.) - do not modify them
- `VITE_API_BASE_URL` must be explicitly set (not derived)
- When changing ports, update both `PORT` and `VITE_API_BASE_URL` together
- Ensure `.env` is in `.gitignore`

### 1.2 Backend Environment Loading (Node.js/Express/TypeScript)

Load `.env` from root directory in your backend entry point (e.g., `server.ts` or `src/server.ts`):

```typescript
import dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Adjust path based on your project structure:
// - If backend is in root: path.resolve(__dirname, '../.env')
// - If backend is in backend/ folder: path.resolve(__dirname, '../.env')
// - If backend is in src/backend/: path.resolve(__dirname, '../../../.env')
```

This loads all variables including existing ones (API keys, etc.).

### 1.3 Frontend Environment Loading (Vite)

Configure `vite.config.ts` to load `.env` from root directory:

```typescript
import { defineConfig, loadEnv } from 'vite';
import * as path from 'path';

export default defineConfig(({ mode }) => {
  // Load .env vars from root directory
  // This will load all variables including existing ones (API keys, etc.)
  const rootDir = path.resolve(process.cwd(), '..'); // Adjust based on structure
  const env = loadEnv(mode, rootDir, '');

  // Read explicitly set values from .env
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const frontendPort = parseInt(env.FRONTEND_PORT || '5173', 10);

  return {
    envDir: rootDir, // Tell Vite to load .env from root
    server: {
      port: frontendPort,
    },
    // ... rest of config
  };
});
```

**Path Adjustment:**
- If frontend is in root: `path.resolve(process.cwd(), '.')`
- If frontend is in `frontend/` folder: `path.resolve(process.cwd(), '..')`
- Adjust based on your project structure

---

## 2. Footer Implementation

### 2.1 Create Footer Utility

Create `utils/footer.ts` in your backend source directory (e.g., `src/utils/footer.ts` or `api/src/utils/footer.ts`):

```typescript
import dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ANSI color codes
const GREEN = '\x1b[32m';
const BRIGHT_GREEN = '\x1b[92m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

interface FooterOptions {
  backendStatus?: string;
  frontendStatus?: string;
}

export function printFooter(options: FooterOptions = {}): void {
  const PROJECT_NAME = 'your-project-name'; // UPDATE THIS
  const backendPort = process.env.PORT || '3001';
  const frontendPort = process.env.FRONTEND_PORT || '5174';
  const activeEnv = process.env.NODE_ENV || 'development';
  
  const backendStatus = options.backendStatus || 'INACTIVE';
  const frontendStatus = options.frontendStatus || 'INACTIVE';
  
  const backendOnline = backendStatus === 'active' || backendStatus === 'running';
  const frontendOnline = frontendStatus === 'active' || frontendStatus === 'running';
  
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  
  const backendCode = backendOnline ? 'ONLINE' : 'OFFLINE';
  const frontendCode = frontendOnline ? 'ONLINE' : 'OFFLINE';
  const backendColor = backendOnline ? BRIGHT_GREEN : RED;
  const frontendColor = frontendOnline ? BRIGHT_GREEN : RED;
  
  const visibleLength = (str: string): number => str.replace(/\x1b\[[0-9;]*m/g, '').length;
  const padVisible = (str: string, width: number): string => {
    const visible = visibleLength(str);
    const padding = Math.max(0, width - visible);
    return str + ' '.repeat(padding);
  };
  
  const innerWidth = 65;
  const title = 'STATUS MONITOR';
  const titlePadding = Math.floor((innerWidth - visibleLength(title) - 2) / 2);
  const projectNameUpper = PROJECT_NAME.toUpperCase();
  const projectPadding = Math.floor((innerWidth - visibleLength(projectNameUpper) - 2) / 2);
  
  const col1Width = 24, col2Width = 8, col3Width = 6, col4Width = 9;
  
  console.log('');
  console.log(` ${BOLD}${CYAN}╔${'═'.repeat(innerWidth - 2)}╗${RESET}`);
  console.log(` ${CYAN}║${RESET}${' '.repeat(titlePadding)}${BOLD}${BRIGHT_GREEN}${title}${RESET}${' '.repeat(innerWidth - 2 - titlePadding - visibleLength(title))} ${CYAN}║${RESET}`);
  console.log(` ${CYAN}║${RESET}${' '.repeat(projectPadding)}${DIM}${projectNameUpper}${RESET}${' '.repeat(innerWidth - 2 - projectPadding - visibleLength(projectNameUpper))} ${CYAN}║${RESET}`);
  console.log(` ${CYAN}╚${'═'.repeat(innerWidth - 2)}╝${RESET}`);
  console.log('');
  console.log(` ${GREEN}SYSTEM TIME:${RESET} ${CYAN}${timestamp}${RESET}`);
  console.log(` ${GREEN}ENVIRONMENT:${RESET} ${YELLOW}${activeEnv.toUpperCase()}${RESET} ${GREEN}MODE${RESET}`);
  console.log('');
  console.log(` ${BOLD}${CYAN}┌${'─'.repeat(col1Width)}┬${'─'.repeat(col2Width)}┬${'─'.repeat(col3Width)}┬${'─'.repeat(col4Width)}┐${RESET}`);
  console.log(` ${CYAN}│${RESET} ${BOLD}${GREEN}${padVisible('SYSTEM COMPONENT', col1Width - 2)}${RESET} ${CYAN}│${RESET} ${GREEN}${padVisible('STATUS', col2Width - 2)}${RESET} ${CYAN}│${RESET} ${GREEN}${padVisible('PORT', col3Width - 2)}${RESET} ${CYAN}│${RESET} ${GREEN}${padVisible('PROTOCOL', col4Width - 2)}${RESET} ${CYAN}│${RESET}`);
  console.log(` ${CYAN}├${'─'.repeat(col1Width)}┼${'─'.repeat(col2Width)}┼${'─'.repeat(col3Width)}┼${'─'.repeat(col4Width)}┤${RESET}`);
  console.log(` ${CYAN}│${RESET} ${GREEN}${padVisible('BACKEND API SERVER', col1Width - 2)}${RESET} ${CYAN}│${RESET} ${backendColor}${padVisible(backendCode, col2Width - 2)}${RESET} ${CYAN}│${RESET} ${CYAN}${padVisible(backendPort, col3Width - 2)}${RESET} ${CYAN}│${RESET} ${CYAN}${padVisible('HTTP', col4Width - 2)}${RESET} ${CYAN}│${RESET}`);
  console.log(` ${CYAN}│${RESET} ${GREEN}${padVisible('FRONTEND DEV SERVER', col1Width - 2)}${RESET} ${CYAN}│${RESET} ${frontendColor}${padVisible(frontendCode, col2Width - 2)}${RESET} ${CYAN}│${RESET} ${CYAN}${padVisible(frontendPort, col3Width - 2)}${RESET} ${CYAN}│${RESET} ${CYAN}${padVisible('HTTP', col4Width - 2)}${RESET} ${CYAN}│${RESET}`);
  console.log(` ${CYAN}└${'─'.repeat(col1Width)}┴${'─'.repeat(col2Width)}┴${'─'.repeat(col3Width)}┴${'─'.repeat(col4Width)}┘${RESET}`);
  console.log('');
  const operatorText = `${DIM}${GREEN}OPERATOR:${RESET} ${CYAN}DRCUOA - Richard Clark${RESET}`;
  const orgText = `${GREEN}ORGANIZATION:${RESET} ${CYAN}NZ WebApps Ltd${RESET}`;
  console.log(` ${operatorText} ${DIM}│${RESET} ${orgText}`);
  console.log(` ${DIM}${GREEN}COPYRIGHT:${RESET} ${CYAN}(C) NZ WebApps Ltd 2025${RESET}`);
  console.log('');
}
```

**Update:** Replace `'your-project-name'` with your actual project name.

---

## 3. Backend Integration

### 3.1 Server Startup with Footer

In your backend entry point (e.g., `server.ts` or `src/server.ts`):

```typescript
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { printFooter } from './utils/footer'; // Adjust path as needed

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// ... your app configuration, middleware, routes ...

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

// CORS configuration
const corsOrigins = FRONTEND_URL.split(',').map(url => url.trim());
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

// ... rest of your app setup ...

// Start server
app.listen(PORT, () => {
  // Determine frontend status for footer
  const frontendStatus = process.env.DEV_FULL === 'true' ? 'active' : 'INACTIVE';
  
  // Print footer as last output
  printFooter({ 
    backendStatus: 'active', 
    frontendStatus 
  });
});
```

**Key Points:**
- Footer prints as the **last console output** after server starts
- Frontend status is determined by `DEV_FULL` environment variable
- Footer automatically reads PORT and FRONTEND_PORT from `.env`

---

## 4. Frontend Integration (Vite)

### 4.1 Vite Configuration

**Recommended Approach:** Let the backend handle footer printing. The frontend doesn't need to print its own footer when running concurrently.

Your `vite.config.ts` should focus on environment loading and API configuration:

```typescript
import { defineConfig, loadEnv } from 'vite';
import * as path from 'path';

export default defineConfig(({ mode }) => {
  // Load .env vars from root directory
  const rootDir = path.resolve(process.cwd(), '..'); // Adjust based on structure
  const env = loadEnv(mode, rootDir, '');

  // Read explicitly set values from .env
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const frontendPort = parseInt(env.FRONTEND_PORT || '5173', 10);

  return {
    envDir: rootDir, // Load .env from root
    server: {
      port: frontendPort,
    },
    // Use apiBaseUrl in your app configuration if needed
    define: {
      __API_BASE_URL__: JSON.stringify(apiBaseUrl),
    },
  };
});
```

### 4.2 Frontend API Client Configuration

In your frontend API client (e.g., `src/utils/apiClient.ts`):

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = {
  baseURL: API_BASE_URL,
  // ... rest of your API client config
};
```

---

## 5. Database Scripts Integration

Add footer to database initialization/seed scripts:

```typescript
import dotenv from 'dotenv';
import * as path from 'path';
import { printFooter } from '../utils/footer'; // Adjust path as needed

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// At the end of script execution
process.on('exit', () => {
  printFooter();
});

// Or in promise chains:
initDatabase()
  .then(() => {
    printFooter();
    process.exit(0);
  })
  .catch((err: Error) => {
    console.error('Error:', err);
    printFooter();
    process.exit(1);
  });
```

---

## 6. Test Scripts Integration (Jest)

### 6.1 Create Jest Teardown

Create `jest.teardown.ts`:

```typescript
import dotenv from 'dotenv';
import * as path from 'path';
import { printFooter } from './utils/footer';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

printFooter();
```

### 6.2 Update Jest Config

Update `jest.config.ts` or `jest.config.js`:

```typescript
export default {
  // ... other config
  globalTeardown: '<rootDir>/jest.teardown.ts',
  preset: 'ts-jest',
  // ... rest of config
};
```

**Note:** If using `jest.config.js`, you can still reference the TypeScript teardown file if you have `ts-jest` configured, or use a compiled JavaScript version.

---

## 7. Package.json Scripts

### 7.1 Development Scripts

Add concurrent development script that sets `DEV_FULL=true`:

```json
{
  "scripts": {
    "dev": "cd backend && npm run dev",
    "frontend": "cd frontend && npm run dev",
    "dev:full": "DEV_FULL=true concurrently \"npm run dev\" \"npm run frontend\""
  }
}
```

**Note:** The `DEV_FULL=true` flag ensures the footer correctly shows frontend status as active when both services run concurrently.

### 7.2 Individual Service Scripts

```json
{
  "scripts": {
    "backend:start": "cd backend && npm start",
    "backend:dev": "cd backend && npm run dev",
    "frontend:dev": "cd frontend && npm run dev",
    "frontend:build": "cd frontend && npm run build"
  }
}
```

---

## 8. Complete Implementation Checklist

Use this checklist when setting up a new project:

### Environment Setup
- [ ] Create `.env` file at project root
- [ ] Add `PORT`, `FRONTEND_PORT`, `FRONTEND_URL`, `VITE_API_BASE_URL`, `NODE_ENV`, `DEV_FULL` to `.env`
- [ ] Preserve existing variables in `.env` (API keys, etc.) - do not modify
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Backend loads `.env` from root with correct path resolution
- [ ] Frontend Vite config loads `.env` from root (`envDir` set)
- [ ] Frontend reads `VITE_API_BASE_URL` directly from `.env` (explicit, not derived)

### Footer Implementation
- [ ] Create `utils/footer.ts` with your project name updated
- [ ] Add footer call in backend server startup (after `app.listen()`)
- [ ] Add footer call in database scripts (if applicable)
- [ ] Add footer call in test teardown (if using Jest)
- [ ] Set `DEV_FULL=true` for concurrent dev scripts

### Testing
- [ ] Test: Change PORT and VITE_API_BASE_URL together, restart servers, verify footer shows correct values
- [ ] Test: Run `dev:full` script, verify footer shows both services ONLINE
- [ ] Test: Run backend only, verify footer shows backend ONLINE and frontend OFFLINE
- [ ] Verify ANSI colors display correctly in your terminal

---

## 9. Key Benefits

- **Unified Configuration:** Single `.env` file at root manages all environment variables
- **Visual Status Monitoring:** NORAD-style footer provides clear visibility of system status
- **Non-Destructive:** Preserves existing `.env` variables (API keys, etc.)
- **Explicit Configuration:** All values clearly defined in `.env`, no magic numbers
- **Consistent Across Projects:** Standardized setup process for all projects
- **Clear Visibility:** Footer shows system status, ports, and environment at a glance

---

## 10. Implementation Notes

### Path Resolution
Adjust path resolution based on your project structure:

**Backend (TypeScript):**
- Backend in root: `path.resolve(__dirname, '../.env')`
- Backend in `backend/` or `api/`: `path.resolve(__dirname, '../.env')`
- Backend in `src/backend/` or `api/src/`: `path.resolve(__dirname, '../../../.env')`

**Note:** In TypeScript, `__dirname` is available when using CommonJS modules (`module: "commonjs"` in `tsconfig.json`). If using ES modules, you may need to use `import.meta.url` or ensure your TypeScript configuration compiles to CommonJS.

**Frontend:**
- Frontend in root: `path.resolve(process.cwd(), '.')`
- Frontend in `frontend/`: `path.resolve(process.cwd(), '..')`
- Frontend in `src/frontend/`: `path.resolve(process.cwd(), '../..')`

### Footer Behavior
- Footer automatically detects if frontend is running via `DEV_FULL` env var
- Status shows `ONLINE` (green) or `OFFLINE` (red) based on `backendStatus`/`frontendStatus`
- Footer prints as the **last console output** in all scripts
- ANSI colors work in most modern terminals

### Environment Variables
- Always restart servers after changing `.env` values
- When changing ports, update both `PORT` and `VITE_API_BASE_URL` together
- `DEV_FULL` should only be `true` when running concurrent dev servers

---

## 11. Quick Reference Code Snippets

### Backend Server Startup (Complete Example)
```typescript
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { printFooter } from './utils/footer';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

app.use(cors({
  origin: FRONTEND_URL.split(',').map(url => url.trim()),
  credentials: true
}));

// ... your routes and middleware ...

app.listen(PORT, () => {
  const frontendStatus = process.env.DEV_FULL === 'true' ? 'active' : 'INACTIVE';
  printFooter({ backendStatus: 'active', frontendStatus });
});
```

### Vite Config (Complete Example)
```typescript
import { defineConfig, loadEnv } from 'vite';
import * as path from 'path';

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(process.cwd(), '..');
  const env = loadEnv(mode, rootDir, '');
  
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const frontendPort = parseInt(env.FRONTEND_PORT || '5173', 10);

  return {
    envDir: rootDir,
    server: {
      port: frontendPort,
    },
  };
});
```

---

## 12. Troubleshooting

### Footer Not Showing
- Verify `utils/footer.ts` exists and path is correct
- Check that footer is called after server starts listening
- Ensure `.env` file exists and has required variables
- Verify TypeScript compilation includes the footer utility

### Wrong Ports in Footer
- Verify `PORT` and `FRONTEND_PORT` are set in `.env`
- Restart servers after changing `.env` values
- Check path resolution is correct for your project structure

### Frontend Status Always OFFLINE
- Ensure `DEV_FULL=true` is set when running concurrent dev
- Check that `DEV_FULL` is in `.env` or set in script command
- Verify footer is reading environment variables correctly

### Colors Not Displaying
- ANSI colors work in most modern terminals
- Some IDEs may not support ANSI colors in integrated terminals
- Try running in native terminal (Terminal.app, PowerShell, etc.)

---

**Last Updated:** 2025-01-XX  
**Version:** 1.0


