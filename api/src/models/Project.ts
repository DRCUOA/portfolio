import { getDb } from '../db';

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  status: string;
  primaryRepoUrl: string | null;
  liveUrl: string | null;
  githubRepoFullName: string | null;
  createdAt: string;
  updatedAt: string;
  inPortfolio: number;
  nsfw: number;
}

export interface CreateProjectInput {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  shortDescription?: string;
  longDescription?: string;
  status: string;
  primaryRepoUrl?: string;
  liveUrl?: string;
  githubRepoFullName?: string;
  inPortfolio?: boolean;
  nsfw?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  tagline?: string;
  shortDescription?: string;
  longDescription?: string;
  status?: string;
  primaryRepoUrl?: string;
  liveUrl?: string;
  githubRepoFullName?: string;
  inPortfolio?: boolean;
  nsfw?: boolean;
}

export class ProjectModel {
  static findAll(): Project[] {
    const db = getDb();
    return db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all() as Project[];
  }

  static findById(id: string): Project | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
  }

  static findBySlug(slug: string): Project | undefined {
    const db = getDb();
    return db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as Project | undefined;
  }

  static create(data: CreateProjectInput): Project {
    const db = getDb();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO projects (
        id, slug, name, tagline, shortDescription, longDescription,
        status, primaryRepoUrl, liveUrl, githubRepoFullName,
        createdAt, updatedAt, inPortfolio, nsfw
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      data.id,
      data.slug,
      data.name,
      data.tagline || null,
      data.shortDescription || null,
      data.longDescription || null,
      data.status,
      data.primaryRepoUrl || null,
      data.liveUrl || null,
      data.githubRepoFullName || null,
      now,
      now,
      data.inPortfolio === false ? 0 : 1,
      data.nsfw === true ? 1 : 0
    );
    return this.findById(data.id)!;
  }

  static update(id: string, data: UpdateProjectInput): Project | null {
    const db = getDb();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.tagline !== undefined) {
      updates.push('tagline = ?');
      values.push(data.tagline || null);
    }
    if (data.shortDescription !== undefined) {
      updates.push('shortDescription = ?');
      values.push(data.shortDescription || null);
    }
    if (data.longDescription !== undefined) {
      updates.push('longDescription = ?');
      values.push(data.longDescription || null);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }
    if (data.primaryRepoUrl !== undefined) {
      updates.push('primaryRepoUrl = ?');
      values.push(data.primaryRepoUrl || null);
    }
    if (data.liveUrl !== undefined) {
      updates.push('liveUrl = ?');
      values.push(data.liveUrl || null);
    }
    if (data.githubRepoFullName !== undefined) {
      updates.push('githubRepoFullName = ?');
      values.push(data.githubRepoFullName || null);
    }
    if (data.inPortfolio !== undefined) {
      updates.push('inPortfolio = ?');
      values.push(data.inPortfolio ? 1 : 0);
    }
    if (data.nsfw !== undefined) {
      updates.push('nsfw = ?');
      values.push(data.nsfw ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findById(id) || null;
    }

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);
    const sql = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);
    return this.findById(id) || null;
  }

  static delete(id: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return result.changes > 0;
  }
}


