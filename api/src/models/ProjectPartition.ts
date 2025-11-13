import { getDb } from '../db';

export interface ProjectPartition {
  projectId: string;
  partitionId: string;
  isFeatured: number;
  sortOrder: number;
}

export interface CreateProjectPartitionInput {
  projectId: string;
  partitionId: string;
  isFeatured?: boolean;
  sortOrder: number;
}

export interface UpdateProjectPartitionInput {
  isFeatured?: boolean;
  sortOrder?: number;
}

export class ProjectPartitionModel {
  static findAll(): ProjectPartition[] {
    const db = getDb();
    return db.prepare('SELECT * FROM project_partitions ORDER BY sortOrder').all() as ProjectPartition[];
  }

  static findByProjectId(projectId: string): ProjectPartition[] {
    const db = getDb();
    return db.prepare('SELECT * FROM project_partitions WHERE projectId = ? ORDER BY sortOrder')
      .all(projectId) as ProjectPartition[];
  }

  static findByPartitionId(partitionId: string): ProjectPartition[] {
    const db = getDb();
    return db.prepare('SELECT * FROM project_partitions WHERE partitionId = ? ORDER BY sortOrder')
      .all(partitionId) as ProjectPartition[];
  }

  static findByKeys(projectId: string, partitionId: string): ProjectPartition | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM project_partitions WHERE projectId = ? AND partitionId = ?')
      .get(projectId, partitionId) as ProjectPartition | undefined;
  }

  static create(data: CreateProjectPartitionInput): ProjectPartition {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO project_partitions (projectId, partitionId, isFeatured, sortOrder)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(
      data.projectId,
      data.partitionId,
      data.isFeatured === true ? 1 : 0,
      data.sortOrder
    );
    return this.findByKeys(data.projectId, data.partitionId)!;
  }

  static update(projectId: string, partitionId: string, data: UpdateProjectPartitionInput): ProjectPartition | null {
    const db = getDb();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.isFeatured !== undefined) {
      updates.push('isFeatured = ?');
      values.push(data.isFeatured ? 1 : 0);
    }
    if (data.sortOrder !== undefined) {
      updates.push('sortOrder = ?');
      values.push(data.sortOrder);
    }

    if (updates.length === 0) {
      return this.findByKeys(projectId, partitionId) || null;
    }

    values.push(projectId, partitionId);
    const sql = `UPDATE project_partitions SET ${updates.join(', ')} WHERE projectId = ? AND partitionId = ?`;
    db.prepare(sql).run(...values);
    return this.findByKeys(projectId, partitionId) || null;
  }

  static delete(projectId: string, partitionId: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM project_partitions WHERE projectId = ? AND partitionId = ?')
      .run(projectId, partitionId);
    return result.changes > 0;
  }

  static deleteByProjectId(projectId: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM project_partitions WHERE projectId = ?').run(projectId);
    return result.changes > 0;
  }

  static deleteByPartitionId(partitionId: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM project_partitions WHERE partitionId = ?').run(partitionId);
    return result.changes > 0;
  }
}


