import { Request, Response } from 'express';
import { ProjectPartitionModel, CreateProjectPartitionInput, UpdateProjectPartitionInput } from '../models/ProjectPartition';
import { ProjectModel } from '../models/Project';
import { PartitionModel } from '../models/Partition';

export class ProjectPartitionController {
  // GET /api/project-partitions
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projectPartitions = ProjectPartitionModel.findAll();
      res.json(projectPartitions.map(pp => ({
        projectId: pp.projectId,
        partitionId: pp.partitionId,
        isFeatured: pp.isFeatured === 1,
        sortOrder: pp.sortOrder,
      })));
    } catch (error) {
      console.error('Error fetching project partitions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/project-partitions/project/:projectId
  static async getByProjectId(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const projectPartitions = ProjectPartitionModel.findByProjectId(projectId);
      res.json(projectPartitions.map(pp => ({
        projectId: pp.projectId,
        partitionId: pp.partitionId,
        isFeatured: pp.isFeatured === 1,
        sortOrder: pp.sortOrder,
      })));
    } catch (error) {
      console.error('Error fetching project partitions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/project-partitions/partition/:partitionId
  static async getByPartitionId(req: Request, res: Response): Promise<void> {
    try {
      const { partitionId } = req.params;
      const projectPartitions = ProjectPartitionModel.findByPartitionId(partitionId);
      res.json(projectPartitions.map(pp => ({
        projectId: pp.projectId,
        partitionId: pp.partitionId,
        isFeatured: pp.isFeatured === 1,
        sortOrder: pp.sortOrder,
      })));
    } catch (error) {
      console.error('Error fetching project partitions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/project-partitions
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateProjectPartitionInput = req.body;

      // Validation
      if (!data.projectId || !data.partitionId) {
        res.status(400).json({ error: 'Missing required fields: projectId, partitionId' });
        return;
      }

      // Check if project and partition exist
      if (!ProjectModel.findById(data.projectId)) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (!PartitionModel.findById(data.partitionId)) {
        res.status(404).json({ error: 'Partition not found' });
        return;
      }

      // Check if relationship already exists
      if (ProjectPartitionModel.findByKeys(data.projectId, data.partitionId)) {
        res.status(409).json({ error: 'Project-partition relationship already exists' });
        return;
      }

      const projectPartition = ProjectPartitionModel.create(data);
      res.status(201).json({
        projectId: projectPartition.projectId,
        partitionId: projectPartition.partitionId,
        isFeatured: projectPartition.isFeatured === 1,
        sortOrder: projectPartition.sortOrder,
      });
    } catch (error) {
      console.error('Error creating project partition:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /api/project-partitions/:projectId/:partitionId
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, partitionId } = req.params;
      const data: UpdateProjectPartitionInput = req.body;

      const projectPartition = ProjectPartitionModel.findByKeys(projectId, partitionId);
      if (!projectPartition) {
        res.status(404).json({ error: 'Project-partition relationship not found' });
        return;
      }

      const updated = ProjectPartitionModel.update(projectId, partitionId, data);
      if (!updated) {
        res.status(500).json({ error: 'Failed to update project partition' });
        return;
      }

      res.json({
        projectId: updated.projectId,
        partitionId: updated.partitionId,
        isFeatured: updated.isFeatured === 1,
        sortOrder: updated.sortOrder,
      });
    } catch (error) {
      console.error('Error updating project partition:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /api/project-partitions/:projectId/:partitionId
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, partitionId } = req.params;

      const projectPartition = ProjectPartitionModel.findByKeys(projectId, partitionId);
      if (!projectPartition) {
        res.status(404).json({ error: 'Project-partition relationship not found' });
        return;
      }

      const deleted = ProjectPartitionModel.delete(projectId, partitionId);
      if (!deleted) {
        res.status(500).json({ error: 'Failed to delete project partition' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting project partition:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}




