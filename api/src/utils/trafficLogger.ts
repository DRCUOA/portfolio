import { TrafficLogModel, CreateTrafficLogInput } from '../models/TrafficLog';

/**
 * Generate a unique ID for traffic logs
 */
function generateId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `traffic-${timestamp}-${random}`;
}

/**
 * Log a click event
 */
export function logClick(portId: string | null, metadata?: Record<string, any>): void {
  try {
    const logData: CreateTrafficLogInput = {
      id: generateId(),
      portId,
      eventType: 'click',
      amount: 1,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    };
    TrafficLogModel.create(logData);
  } catch (error) {
    // Don't throw - logging failures shouldn't break the app
    console.error('Error logging click:', error);
  }
}

/**
 * Log data transfer in MB
 */
export function logDataTransfer(portId: string | null, sizeInBytes: number, metadata?: Record<string, any>): void {
  try {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const logData: CreateTrafficLogInput = {
      id: generateId(),
      portId,
      eventType: 'data_transfer',
      amount: Math.round(sizeInMB * 100) / 100, // Round to 2 decimal places
      metadata: {
        ...metadata,
        sizeInBytes,
        timestamp: new Date().toISOString(),
      },
    };
    TrafficLogModel.create(logData);
  } catch (error) {
    // Don't throw - logging failures shouldn't break the app
    console.error('Error logging data transfer:', error);
  }
}

/**
 * Express middleware to track response sizes (data transfer)
 */
import { Request, Response, NextFunction } from 'express';

export function trafficTrackingMiddleware(req: Request, res: Response, next: NextFunction): void {
   // Skip OPTIONS requests (CORS preflight) - they don't need tracking and shouldn't interfere with CORS handling
   if (req.method === 'OPTIONS') {
    return next();
  }

  const startTime = Date.now();
  let responseSize = 0;

  // Override write to track data being written
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function(chunk: any, encoding?: any): boolean {
    if (chunk) {
      const chunkSize = Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding);
      responseSize += chunkSize;
    }
    return originalWrite.call(this, chunk, encoding);
  };

  res.end = function(chunk?: any, encoding?: any): Response {
    if (chunk) {
      const chunkSize = Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk, encoding);
      responseSize += chunkSize;
    }

    // Restore original functions
    res.write = originalWrite;
    res.end = originalEnd;

    // Log data transfer if response is successful and size > 0
    // Only log for API routes, not static files
    if (
      res.statusCode >= 200 && 
      res.statusCode < 300 && 
      responseSize > 0 &&
      req.path.startsWith('/api/') &&
      !req.path.startsWith('/api/traffic') // Don't log traffic logging requests
    ) {
      // Try to determine port_id from request path or headers
      let portId: string | null = null;
      
      // Check headers for port ID
      if (req.headers['x-port-id']) {
        portId = req.headers['x-port-id'] as string;
      }

      // Log asynchronously to avoid blocking response
      setImmediate(() => {
        logDataTransfer(portId, responseSize, {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          contentType: res.getHeader('content-type'),
          duration: Date.now() - startTime,
        });
      });
    }

    // Call original end
    return originalEnd.call(this, chunk, encoding);
  };

  next();
}

