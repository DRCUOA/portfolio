import { Request, Response } from 'express';
import { PortModel, CreatePortInput, UpdatePortInput, ServerType } from '../models/Port';
import { ProjectModel } from '../models/Project';
import { getPortStatus } from '../utils/portChecker';

export class PortController {
  // GET /api/ports/check/:portNumber - Check if port is available (not reserved and not active)
  static async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const portNumber = parseInt(req.params.portNumber, 10);
      
      if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
        res.status(400).json({ error: 'Invalid port number' });
        return;
      }

      // Check if port is reserved (allocated in database)
      const allocatedPort = PortModel.findByPortNumber(portNumber);
      const isReserved = !!allocatedPort;

      // Check if port is active (in use at runtime)
      const runtimeStatus = await getPortStatus(portNumber);
      const isActive = runtimeStatus.inUse;

      const available = !isReserved && !isActive;

      res.json({
        portNumber,
        available,
        isReserved,
        isActive,
        reservedBy: allocatedPort ? {
          id: allocatedPort.id,
          name: allocatedPort.name,
          serverType: allocatedPort.serverType
        } : null,
        activePid: runtimeStatus.pid || null
      });
    } catch (error) {
      console.error('Error checking port availability:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

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

      // CRITICAL: Check if port is already allocated (reserved) in database
      const existingAllocatedPort = PortModel.findByPortNumber(data.portNumber);
      if (existingAllocatedPort) {
        res.status(409).json({ 
          error: `Port ${data.portNumber} is already allocated to ${existingAllocatedPort.name || 'unknown project'}. Cannot allocate reserved port.` 
        });
        return;
      }

      // CRITICAL: Check if port is actively in use at runtime (even if not in DB)
      const runtimeStatus = await getPortStatus(data.portNumber);
      if (runtimeStatus.inUse) {
        res.status(409).json({ 
          error: `Port ${data.portNumber} is currently active (PID: ${runtimeStatus.pid || 'unknown'}). Cannot allocate active port.` 
        });
        return;
      }

      // Validate that name (if provided) must be an existing project ID
      if (data.name && data.name.trim() !== '') {
        const project = ProjectModel.findById(data.name.trim());
        if (!project) {
          res.status(400).json({ error: `NAME must be an existing project ID. Project with ID "${data.name}" not found.` });
          return;
        }
        
        // Check if a port is already allocated to this project for the same server type
        const existingPorts = PortModel.findAll();
        const projectId = data.name.trim();
        const conflictingPort = existingPorts.find(port => {
          if (!port.name) return false;
          
          // New format: direct match
          if (port.name === projectId && port.serverType === data.serverType) {
            return true;
          }
          
          // Legacy format: "project-slug Backend" or "project-slug Frontend"
          const parts = port.name.split(' ');
          if (parts.length >= 2) {
            const projectIdentifier = parts.slice(0, -1).join(' ');
            const serverTypeInName = parts[parts.length - 1].toLowerCase();
            const expectedServerType = data.serverType === 'api' ? 'backend' : data.serverType;
            
            if ((projectIdentifier === projectId || projectIdentifier === project.slug) && 
                serverTypeInName === expectedServerType && 
                port.serverType === data.serverType) {
              return true;
            }
          }
          
          return false;
        });
        
        if (conflictingPort) {
          res.status(409).json({ 
            error: `Port already allocated to project "${project.name}" (${projectId}) for server type "${data.serverType}". Existing port: ${conflictingPort.portNumber} (${conflictingPort.id})` 
          });
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
        
        // Only check for conflicts if the port number is actually changing
        if (data.portNumber !== port.portNumber) {
          // CRITICAL: Check if port number is already allocated (reserved) by another port
          const existingAllocatedPort = PortModel.findByPortNumber(data.portNumber);
          if (existingAllocatedPort && existingAllocatedPort.id !== id) {
            res.status(409).json({ 
              error: `Port ${data.portNumber} is already allocated to ${existingAllocatedPort.name || 'unknown project'}. Cannot allocate reserved port.` 
            });
            return;
          }
          
          // CRITICAL: Check if port is actively in use at runtime (even if not in DB)
          const runtimeStatus = await getPortStatus(data.portNumber);
          if (runtimeStatus.inUse) {
            res.status(409).json({ 
              error: `Port ${data.portNumber} is currently active (PID: ${runtimeStatus.pid || 'unknown'}). Cannot allocate active port.` 
            });
            return;
          }
        }
        // If port number is not changing, skip all conflict checks - allow the update
      }

      // Validate that name (if provided) must be an existing project ID
      if (data.name !== undefined) {
        if (data.name && data.name.trim() !== '') {
          const project = ProjectModel.findById(data.name.trim());
          if (!project) {
            res.status(400).json({ error: `NAME must be an existing project ID. Project with ID "${data.name}" not found.` });
            return;
          }
          
          // Only check for conflicts if name or serverType is actually changing
          const nameChanged = data.name.trim() !== (port.name || '');
          const serverTypeChanged = data.serverType !== undefined && data.serverType !== port.serverType;
          
          if (nameChanged || serverTypeChanged) {
            // Check if a port is already allocated to this project for the same server type
            // (excluding the current port being updated)
            const existingPorts = PortModel.findAll();
            const projectId = data.name.trim();
            const serverType = data.serverType || port.serverType;
            const conflictingPort = existingPorts.find(p => {
              if (p.id === id) return false; // Skip the current port
              if (!p.name) return false;
              
              // New format: direct match
              if (p.name === projectId && p.serverType === serverType) {
                return true;
              }
              
              // Legacy format: "project-slug Backend" or "project-slug Frontend"
              const parts = p.name.split(' ');
              if (parts.length >= 2) {
                const projectIdentifier = parts.slice(0, -1).join(' ');
                const serverTypeInName = parts[parts.length - 1].toLowerCase();
                const expectedServerType = serverType === 'api' ? 'backend' : serverType;
                
                if ((projectIdentifier === projectId || projectIdentifier === project.slug) && 
                    serverTypeInName === expectedServerType && 
                    p.serverType === serverType) {
                  return true;
                }
              }
              
              return false;
            });
            
            if (conflictingPort) {
              res.status(409).json({ 
                error: `Port already allocated to project "${project.name}" (${projectId}) for server type "${serverType}". Existing port: ${conflictingPort.portNumber} (${conflictingPort.id})` 
              });
              return;
            }
          }
          // If name and serverType are not changing, skip conflict check - allow the update
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


