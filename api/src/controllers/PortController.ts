import { Request, Response } from 'express';
import { PortModel, CreatePortInput, UpdatePortInput, ServerType } from '../models/Port';
import { ProjectModel } from '../models/Project';
import { getPortStatus } from '../utils/portChecker';

export class PortController {
  // GET /api/ports
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const ports = PortModel.findAll();
      // Check port availability for each port
      const portsWithStatus = await Promise.all(
        ports.map(async (port) => {
          const status = await getPortStatus(port.portNumber);
          return {
            ...port,
            name: port.name || '',
            description: port.description || '',
            inUse: status.inUse,
            pid: status.pid,
          };
        })
      );
      res.json(portsWithStatus);
    } catch (error) {
      console.error('Error fetching ports:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/ports/:id
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const port = PortModel.findById(id);

      if (!port) {
        res.status(404).json({ error: 'Port not found' });
        return;
      }

      const status = await getPortStatus(port.portNumber);
      res.json({
        ...port,
        name: port.name || '',
        description: port.description || '',
        inUse: status.inUse,
        pid: status.pid,
      });
    } catch (error) {
      console.error('Error fetching port:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/ports/type/:serverType
  static async getByServerType(req: Request, res: Response): Promise<void> {
    try {
      const { serverType } = req.params;
      if (!['frontend', 'backend', 'api'].includes(serverType)) {
        res.status(400).json({ error: 'Invalid server type. Must be frontend, backend, or api' });
        return;
      }
      const ports = PortModel.findByServerType(serverType as ServerType);
      const portsWithStatus = await Promise.all(
        ports.map(async (port) => {
          const status = await getPortStatus(port.portNumber);
          return {
            ...port,
            name: port.name || '',
            description: port.description || '',
            inUse: status.inUse,
            pid: status.pid,
          };
        })
      );
      res.json(portsWithStatus);
    } catch (error) {
      console.error('Error fetching ports by type:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/ports
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreatePortInput = req.body;

      // Validation
      if (!data.id || data.portNumber === undefined || !data.serverType) {
        res.status(400).json({ error: 'Missing required fields: id, portNumber, serverType' });
        return;
      }

      if (!['frontend', 'backend', 'api'].includes(data.serverType)) {
        res.status(400).json({ error: 'Invalid serverType. Must be frontend, backend, or api' });
        return;
      }

      if (data.portNumber < 1 || data.portNumber > 65535) {
        res.status(400).json({ error: 'Port number must be between 1 and 65535' });
        return;
      }

      // Check if id already exists
      if (PortModel.findById(data.id)) {
        res.status(409).json({ error: 'Port with this id already exists' });
        return;
      }

      // Check if port number already exists
      if (PortModel.findByPortNumber(data.portNumber)) {
        res.status(409).json({ error: 'Port number already in use' });
        return;
      }

      // Validate that name (if provided) must be an existing project ID
      if (data.name && data.name.trim() !== '') {
        const project = ProjectModel.findById(data.name.trim());
        if (!project) {
          res.status(400).json({ error: `NAME must be an existing project ID. Project with ID "${data.name}" not found.` });
          return;
        }
      }

      const port = PortModel.create(data);
      const status = await getPortStatus(port.portNumber);
      res.status(201).json({
        ...port,
        name: port.name || '',
        description: port.description || '',
        inUse: status.inUse,
        pid: status.pid,
      });
    } catch (error) {
      console.error('Error creating port:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /api/ports/:id
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdatePortInput = req.body;

      const port = PortModel.findById(id);
      if (!port) {
        res.status(404).json({ error: 'Port not found' });
        return;
      }

      // Validate serverType if provided
      if (data.serverType && !['frontend', 'backend', 'api'].includes(data.serverType)) {
        res.status(400).json({ error: 'Invalid serverType. Must be frontend, backend, or api' });
        return;
      }

      // Validate port number if provided
      if (data.portNumber !== undefined) {
        if (data.portNumber < 1 || data.portNumber > 65535) {
          res.status(400).json({ error: 'Port number must be between 1 and 65535' });
          return;
        }
        // Check if port number is already used by another port
        const existingPort = PortModel.findByPortNumber(data.portNumber);
        if (existingPort && existingPort.id !== id) {
          res.status(409).json({ error: 'Port number already in use' });
          return;
        }
      }

      // Validate that name (if provided) must be an existing project ID
      if (data.name !== undefined) {
        if (data.name && data.name.trim() !== '') {
          const project = ProjectModel.findById(data.name.trim());
          if (!project) {
            res.status(400).json({ error: `NAME must be an existing project ID. Project with ID "${data.name}" not found.` });
            return;
          }
        }
      }

      const updated = PortModel.update(id, data);
      if (!updated) {
        res.status(500).json({ error: 'Failed to update port' });
        return;
      }

      const status = await getPortStatus(updated.portNumber);
      res.json({
        ...updated,
        name: updated.name || '',
        description: updated.description || '',
        inUse: status.inUse,
        pid: status.pid,
      });
    } catch (error) {
      console.error('Error updating port:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /api/ports/:id
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const port = PortModel.findById(id);
      if (!port) {
        res.status(404).json({ error: 'Port not found' });
        return;
      }

      const deleted = PortModel.delete(id);
      if (!deleted) {
        res.status(500).json({ error: 'Failed to delete port' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting port:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}


