import { getDb } from '../db';

export interface Partition {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface CreatePartitionInput {
  id: string;
  slug: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface UpdatePartitionInput {
  name?: string;
  description?: string;
  sortOrder?: number;
}

export class PartitionModel {
  static findAll(): Partition[] {
    const db = getDb();
    return db.prepare('SELECT * FROM partitions ORDER BY sortOrder').all() as Partition[];
  }

  static findById(id: string): Partition | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM partitions WHERE id = ?').get(id) as Partition | undefined;
  }

  static findBySlug(slug: string): Partition | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM partitions WHERE slug = ?').get(slug) as Partition | undefined;
  }

  static create(data: CreatePartitionInput): Partition {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO partitions (id, slug, name, description, sortOrder)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(data.id, data.slug, data.name, data.description || null, data.sortOrder);
    return this.findById(data.id)!;
  }

  static update(id: string, data: UpdatePartitionInput): Partition | null {
    const db = getDb();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description || null);
    }
    if (data.sortOrder !== undefined) {
      updates.push('sortOrder = ?');
      values.push(data.sortOrder);
    }

    if (updates.length === 0) {
      return this.findById(id) || null;
    }

    values.push(id);
    const sql = `UPDATE partitions SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);
    return this.findById(id) || null;
  }

  static delete(id: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM partitions WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

