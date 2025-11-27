import { Request, Response } from 'express';
import { TrafficLogModel, CreateTrafficLogInput } from '../models/TrafficLog';
import { logClick } from '../utils/trafficLogger';

export class TrafficController {
  // POST /api/traffic/click - Log a click event
  static async logClick(req: Request, res: Response): Promise<void> {
    try {
      const { portId, metadata } = req.body;
      
      const logData: CreateTrafficLogInput = {
        id: `traffic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        portId: portId || null,
        eventType: 'click',
        amount: 1,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
        },
      };

      const log = TrafficLogModel.create(logData);
      res.status(201).json(log);
    } catch (error) {
      console.error('Error logging click:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/traffic/logs - Get all traffic logs (with optional limit)
  static async getAllLogs(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const logs = TrafficLogModel.findAll(limit);
      
      // Parse metadata JSON strings
      const logsWithParsedMetadata = logs.map(log => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      }));
      
      res.json(logsWithParsedMetadata);
    } catch (error) {
      console.error('Error fetching traffic logs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/traffic/logs/port/:portId - Get logs for a specific port
  static async getLogsByPort(req: Request, res: Response): Promise<void> {
    try {
      const { portId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const logs = TrafficLogModel.findByPortId(portId, limit);
      
      // Parse metadata JSON strings
      const logsWithParsedMetadata = logs.map(log => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      }));
      
      res.json(logsWithParsedMetadata);
    } catch (error) {
      console.error('Error fetching traffic logs by port:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/traffic/stats - Get traffic statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { portId } = req.query;
      
      if (portId) {
        const stats = TrafficLogModel.getStatsByPortId(portId as string);
        res.json(stats);
      } else {
        const allStats = TrafficLogModel.getAllStats();
        res.json(allStats);
      }
    } catch (error) {
      console.error('Error fetching traffic stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /api/traffic/logs/:id - Delete a specific log
  static async deleteLog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = TrafficLogModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Traffic log not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting traffic log:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}


