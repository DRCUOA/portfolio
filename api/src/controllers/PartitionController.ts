import { Request, Response } from 'express';
import { PartitionModel, CreatePartitionInput, UpdatePartitionInput } from '../models/Partition';
import { ProjectPartitionModel } from '../models/ProjectPartition';
import { ProjectModel } from '../models/Project';

export class PartitionController {
  // GET /api/partitions
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const partitions = PartitionModel.findAll();
      res.json(partitions.map(p => ({
        ...p,
        description: p.description || '',
      })));
    } catch (error) {
      console.error('Error fetching partitions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/partitions/:slug
  static async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const partition = PartitionModel.findBySlug(slug);

      if (!partition) {
        res.status(404).json({ error: 'Partition not found' });
        return;
      }

      const projectPartitions = ProjectPartitionModel.findByPartitionId(partition.id);
      const projects = projectPartitions.map(pp => {
        const project = ProjectModel.findById(pp.projectId);
        return project ? {
          ...project,
          tagline: project.tagline || '',
          shortDescription: project.shortDescription || '',
          longDescription: project.longDescription || '',
          primaryRepoUrl: project.primaryRepoUrl || '',
          liveUrl: project.liveUrl || '',
          githubRepoFullName: project.githubRepoFullName || '',
          inPortfolio: project.inPortfolio === 1,
        } : null;
      }).filter(p => p !== null);

      res.json({
        ...partition,
        description: partition.description || '',
        projects,
        projectPartitions: projectPartitions.map(pp => ({
          projectId: pp.projectId,
          partitionId: pp.partitionId,
          isFeatured: pp.isFeatured === 1,
          sortOrder: pp.sortOrder,
        })),
      });
    } catch (error) {
      console.error('Error fetching partition:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/partitions
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreatePartitionInput = req.body;

      // Validation
      if (!data.id || !data.slug || !data.name) {
        res.status(400).json({ error: 'Missing required fields: id, slug, name' });
        return;
      }

      // Check if id or slug already exists
      if (PartitionModel.findById(data.id)) {
        res.status(409).json({ error: 'Partition with this id already exists' });
        return;
      }

      if (PartitionModel.findBySlug(data.slug)) {
        res.status(409).json({ error: 'Partition with this slug already exists' });
        return;
      }

      const partition = PartitionModel.create(data);
      res.status(201).json({
        ...partition,
        description: partition.description || '',
      });
    } catch (error) {
      console.error('Error creating partition:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /api/partitions/:id
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdatePartitionInput = req.body;

      const partition = PartitionModel.findById(id);
      if (!partition) {
        res.status(404).json({ error: 'Partition not found' });
        return;
      }

      const updated = PartitionModel.update(id, data);
      if (!updated) {
        res.status(500).json({ error: 'Failed to update partition' });
        return;
      }

      res.json({
        ...updated,
        description: updated.description || '',
      });
    } catch (error) {
      console.error('Error updating partition:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /api/partitions/:id
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const partition = PartitionModel.findById(id);
      if (!partition) {
        res.status(404).json({ error: 'Partition not found' });
        return;
      }

      // Delete associated project_partitions first
      ProjectPartitionModel.deleteByPartitionId(id);

      const deleted = PartitionModel.delete(id);
      if (!deleted) {
        res.status(500).json({ error: 'Failed to delete partition' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting partition:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}




