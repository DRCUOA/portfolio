import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { getDb, closeDb } from './db';
import partitionRoutes from './routes/partitionRoutes';
import projectRoutes from './routes/projectRoutes';
import projectPartitionRoutes from './routes/projectPartitionRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse CORS origins from environment variable
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOrigins = frontendUrl.split(',').map(url => url.trim());

// Enable CORS for all routes
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend public directory (for uploaded screenshots)
const publicDir = path.join(__dirname, '..', '..', 'frontend', 'public');
app.use('/screenshots', express.static(path.join(publicDir, 'screenshots')));

// API Routes
app.use('/api/partitions', partitionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-partitions', projectPartitionRoutes);
app.use('/api/upload', uploadRoutes);

// Initialize database connection
getDb();

// Start server and store the server instance
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown handler
function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  server.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    
    console.log('HTTP server closed');
    
    // Close database connection
    closeDb();
    
    console.log('Shutdown complete');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    closeDb();
    process.exit(1);
  }, 10000);
}

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

