import { getDb } from '../db';

export type TrafficEventType = 'click' | 'data_transfer';

export interface TrafficLog {
  id: string;
  portId: string | null;
  eventType: TrafficEventType;
  amount: number; // For clicks: count (usually 1), For data_transfer: MB
  metadata: string | null; // JSON string with additional info (URL, referrer, user agent, etc.)
  createdAt: string;
}

export interface CreateTrafficLogInput {
  id: string;
  portId?: string | null;
  eventType: TrafficEventType;
  amount: number;
  metadata?: Record<string, any>;
}

export interface TrafficStats {
  portId: string | null;
  portName: string | null;
  totalClicks: number;
  totalDataTransferMB: number;
  clickCount: number;
  dataTransferCount: number;
  lastActivity: string | null;
}

export class TrafficLogModel {
  static findAll(limit?: number): TrafficLog[] {
    const db = getDb();
    const sql = limit 
      ? 'SELECT * FROM traffic_logs ORDER BY created_at DESC LIMIT ?'
      : 'SELECT * FROM traffic_logs ORDER BY created_at DESC';
    const rows = limit
      ? db.prepare(sql).all(limit) as any[]
      : db.prepare(sql).all() as any[];
    return rows.map(row => this.mapRowToTrafficLog(row));
  }

  static findById(id: string): TrafficLog | undefined {
    const db = getDb();
    const row = db.prepare('SELECT * FROM traffic_logs WHERE id = ?').get(id) as any;
    if (!row) return undefined;
    return this.mapRowToTrafficLog(row);
  }

  static findByPortId(portId: string, limit?: number): TrafficLog[] {
    const db = getDb();
    const sql = limit
      ? 'SELECT * FROM traffic_logs WHERE port_id = ? ORDER BY created_at DESC LIMIT ?'
      : 'SELECT * FROM traffic_logs WHERE port_id = ? ORDER BY created_at DESC';
    const rows = limit
      ? db.prepare(sql).all(portId, limit) as any[]
      : db.prepare(sql).all(portId) as any[];
    return rows.map(row => this.mapRowToTrafficLog(row));
  }

  static getStatsByPortId(portId: string | null): TrafficStats {
    const db = getDb();
    let stats: any;

    if (portId === null) {
      // Get stats for all traffic (no specific port)
      stats = db.prepare(`
        SELECT 
          NULL as port_id,
          NULL as port_name,
          COALESCE(SUM(CASE WHEN event_type = 'click' THEN amount ELSE 0 END), 0) as total_clicks,
          COALESCE(SUM(CASE WHEN event_type = 'data_transfer' THEN amount ELSE 0 END), 0) as total_data_transfer_mb,
          COUNT(CASE WHEN event_type = 'click' THEN 1 END) as click_count,
          COUNT(CASE WHEN event_type = 'data_transfer' THEN 1 END) as data_transfer_count,
          MAX(created_at) as last_activity
        FROM traffic_logs
        WHERE port_id IS NULL
      `).get() as any;
    } else {
      // Get stats for specific port
      const portRow = db.prepare('SELECT id, name FROM ports WHERE id = ?').get(portId) as any;
      stats = db.prepare(`
        SELECT 
          ? as port_id,
          ? as port_name,
          COALESCE(SUM(CASE WHEN event_type = 'click' THEN amount ELSE 0 END), 0) as total_clicks,
          COALESCE(SUM(CASE WHEN event_type = 'data_transfer' THEN amount ELSE 0 END), 0) as total_data_transfer_mb,
          COUNT(CASE WHEN event_type = 'click' THEN 1 END) as click_count,
          COUNT(CASE WHEN event_type = 'data_transfer' THEN 1 END) as data_transfer_count,
          MAX(created_at) as last_activity
        FROM traffic_logs
        WHERE port_id = ?
      `).get(portId, portRow?.name || null, portId) as any;
    }

    return {
      portId: stats.port_id,
      portName: stats.port_name,
      totalClicks: stats.total_clicks || 0,
      totalDataTransferMB: stats.total_data_transfer_mb || 0,
      clickCount: stats.click_count || 0,
      dataTransferCount: stats.data_transfer_count || 0,
      lastActivity: stats.last_activity || null,
    };
  }

  static getAllStats(): TrafficStats[] {
    const db = getDb();
    // Get stats grouped by port_id
    const rows = db.prepare(`
      SELECT 
        port_id,
        COALESCE(SUM(CASE WHEN event_type = 'click' THEN amount ELSE 0 END), 0) as total_clicks,
        COALESCE(SUM(CASE WHEN event_type = 'data_transfer' THEN amount ELSE 0 END), 0) as total_data_transfer_mb,
        COUNT(CASE WHEN event_type = 'click' THEN 1 END) as click_count,
        COUNT(CASE WHEN event_type = 'data_transfer' THEN 1 END) as data_transfer_count,
        MAX(created_at) as last_activity
      FROM traffic_logs
      GROUP BY port_id
      ORDER BY last_activity DESC
    `).all() as any[];

    return rows.map(row => {
      const portId = row.port_id;
      let portName = null;
      if (portId) {
        const portRow = db.prepare('SELECT name FROM ports WHERE id = ?').get(portId) as any;
        portName = portRow?.name || null;
      }

      return {
        portId,
        portName,
        totalClicks: row.total_clicks || 0,
        totalDataTransferMB: row.total_data_transfer_mb || 0,
        clickCount: row.click_count || 0,
        dataTransferCount: row.data_transfer_count || 0,
        lastActivity: row.last_activity || null,
      };
    });
  }

  private static mapRowToTrafficLog(row: any): TrafficLog {
    return {
      id: row.id,
      portId: row.port_id,
      eventType: row.event_type,
      amount: row.amount,
      metadata: row.metadata,
      createdAt: row.created_at,
    };
  }

  static create(data: CreateTrafficLogInput): TrafficLog {
    const db = getDb();
    const now = new Date().toISOString();
    const metadataJson = data.metadata ? JSON.stringify(data.metadata) : null;
    
    const stmt = db.prepare(`
      INSERT INTO traffic_logs (id, port_id, event_type, amount, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      data.id,
      data.portId || null,
      data.eventType,
      data.amount,
      metadataJson,
      now
    );
    return this.findById(data.id)!;
  }

  static delete(id: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM traffic_logs WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static deleteByPortId(portId: string): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM traffic_logs WHERE port_id = ?').run(portId);
    return result.changes > 0;
  }
}



