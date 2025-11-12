import { Request, Response } from 'express';
import { ProjectModel, CreateProjectInput, UpdateProjectInput } from '../models/Project';
import { ProjectPartitionModel } from '../models/ProjectPartition';
import { PartitionModel } from '../models/Partition';

export class ProjectController {
  // GET /api/projects
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = ProjectModel.findAll();
      res.json(projects.map(p => ({
        ...p,
        tagline: p.tagline || '',
        shortDescription: p.shortDescription || '',
        longDescription: p.longDescription || '',
        primaryRepoUrl: p.primaryRepoUrl || '',
        liveUrl: p.liveUrl || '',
        githubRepoFullName: p.githubRepoFullName || '',
        inPortfolio: p.inPortfolio === 1,
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/projects/:slug
  static async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const project = ProjectModel.findBySlug(slug);

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      const projectPartitions = ProjectPartitionModel.findByProjectId(project.id);
      const partitions = projectPartitions.map(pp => {
        const partition = PartitionModel.findById(pp.partitionId);
        return partition ? {
          ...partition,
          description: partition.description || '',
        } : null;
      }).filter(p => p !== null);

      res.json({
        ...project,
        tagline: project.tagline || '',
        shortDescription: project.shortDescription || '',
        longDescription: project.longDescription || '',
        primaryRepoUrl: project.primaryRepoUrl || '',
        liveUrl: project.liveUrl || '',
        githubRepoFullName: project.githubRepoFullName || '',
        inPortfolio: project.inPortfolio === 1,
        partitions,
        projectPartitions: projectPartitions.map(pp => ({
          projectId: pp.projectId,
          partitionId: pp.partitionId,
          isFeatured: pp.isFeatured === 1,
          sortOrder: pp.sortOrder,
        })),
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /api/projects
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateProjectInput = req.body;

      // Validation
      if (!data.id || !data.slug || !data.name || !data.status) {
        res.status(400).json({ error: 'Missing required fields: id, slug, name, status' });
        return;
      }

      // Check if id or slug already exists
      if (ProjectModel.findById(data.id)) {
        res.status(409).json({ error: 'Project with this id already exists' });
        return;
      }

      if (ProjectModel.findBySlug(data.slug)) {
        res.status(409).json({ error: 'Project with this slug already exists' });
        return;
      }

      const project = ProjectModel.create(data);
      res.status(201).json({
        ...project,
        tagline: project.tagline || '',
        shortDescription: project.shortDescription || '',
        longDescription: project.longDescription || '',
        primaryRepoUrl: project.primaryRepoUrl || '',
        liveUrl: project.liveUrl || '',
        githubRepoFullName: project.githubRepoFullName || '',
        inPortfolio: project.inPortfolio === 1,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /api/projects/:id
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateProjectInput = req.body;

      const project = ProjectModel.findById(id);
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      const updated = ProjectModel.update(id, data);
      if (!updated) {
        res.status(500).json({ error: 'Failed to update project' });
        return;
      }

      res.json({
        ...updated,
        tagline: updated.tagline || '',
        shortDescription: updated.shortDescription || '',
        longDescription: updated.longDescription || '',
        primaryRepoUrl: updated.primaryRepoUrl || '',
        liveUrl: updated.liveUrl || '',
        githubRepoFullName: updated.githubRepoFullName || '',
        inPortfolio: updated.inPortfolio === 1,
      });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /api/projects/:id
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const project = ProjectModel.findById(id);
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Delete associated project_partitions first
      ProjectPartitionModel.deleteByProjectId(id);

      const deleted = ProjectModel.delete(id);
      if (!deleted) {
        res.status(500).json({ error: 'Failed to delete project' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

