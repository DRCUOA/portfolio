import { getDb } from '../db';
import { TrafficLogModel } from './TrafficLog';

export type ServerType = 'frontend' | 'backend' | 'api';

export interface Port {
  id: string;
  portNumber: number;
  serverType: ServerType;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortInput {
  id: string;
  portNumber: number;
  serverType: ServerType;
  name?: string;
  description?: string;
}

export interface UpdatePortInput {
  portNumber?: number;
  serverType?: ServerType;
  name?: string;
  description?: string;
}

export class PortModel {
  static findAll(): Port[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM ports ORDER BY server_type, port_number').all() as any[];
    return rows.map(row => this.mapRowToPort(row));
  }

  static findById(id: string): Port | undefined {
    const db = getDb();
    const row = db.prepare('SELECT * FROM ports WHERE id = ?').get(id) as any;
    if (!row) return undefined;
    return this.mapRowToPort(row);
  }

  static findByPortNumber(portNumber: number): Port | undefined {
    const db = getDb();
    const row = db.prepare('SELECT * FROM ports WHERE port_number = ?').get(portNumber) as any;
    if (!row) return undefined;
    return this.mapRowToPort(row);
  }

  static findByServerType(serverType: ServerType): Port[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM ports WHERE server_type = ? ORDER BY port_number').all(serverType) as any[];
    return rows.map(row => this.mapRowToPort(row));
  }

  private static mapRowToPort(row: any): Port {
    return {
      id: row.id,
      portNumber: row.port_number,
      serverType: row.server_type,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static create(data: CreatePortInput): Port {
    const db = getDb();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO ports (id, port_number, server_type, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      data.id,
      data.portNumber,
      data.serverType,
      data.name || null,
      data.description || null,
      now,
      now
    );
    return this.findById(data.id)!;
  }

  static update(id: string, data: UpdatePortInput): Port | null {
    const db = getDb();
    const updates: string[] = [];
    const values: any[] = [];

    if (data.portNumber !== undefined) {
      updates.push('port_number = ?');
      values.push(data.portNumber);
    }
    if (data.serverType !== undefined) {
      updates.push('server_type = ?');
      values.push(data.serverType);
    }
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name || null);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description || null);
    }

    if (updates.length === 0) {
      return this.findById(id) || null;
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    const sql = `UPDATE ports SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...values);
    return this.findById(id) || null;
  }

  static delete(id: string): boolean {
    const db = getDb();
    
    // First, delete all related traffic logs to avoid foreign key constraint errors
    TrafficLogModel.deleteByPortId(id);
    
    // Then delete the port
    const result = db.prepare('DELETE FROM ports WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

