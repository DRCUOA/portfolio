import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(__dirname, '..', 'portfolio.db');
const SEED_PATH = path.join(__dirname, '..', '..', 'seed.json');
const SEED_P_1_PATH = path.join(__dirname, '..', '..', 'seed_p_1.json');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('foreign_keys = ON');
    initializeDb();
  }
  return db;
}

function initializeDb(): void {
  // Create tables
  db!.exec(`
    CREATE TABLE IF NOT EXISTS partitions (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      sortOrder INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT,
      shortDescription TEXT,
      longDescription TEXT,
      status TEXT NOT NULL,
      primaryRepoUrl TEXT,
      liveUrl TEXT,
      githubRepoFullName TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      inPortfolio INTEGER DEFAULT 1,
      nsfw INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS project_partitions (
      projectId TEXT NOT NULL,
      partitionId TEXT NOT NULL,
      isFeatured INTEGER DEFAULT 0,
      sortOrder INTEGER NOT NULL,
      PRIMARY KEY (projectId, partitionId),
      FOREIGN KEY (projectId) REFERENCES projects(id),
      FOREIGN KEY (partitionId) REFERENCES partitions(id)
    );

    CREATE TABLE IF NOT EXISTS ports (
      id TEXT PRIMARY KEY,
      port_number INTEGER UNIQUE NOT NULL,
      server_type TEXT NOT NULL CHECK(server_type IN ('frontend', 'backend', 'api')),
      name TEXT,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS traffic_logs (
      id TEXT PRIMARY KEY,
      port_id TEXT,
      event_type TEXT NOT NULL CHECK(event_type IN ('click', 'data_transfer')),
      amount REAL NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (port_id) REFERENCES ports(id)
    );
  `);

  // Migration: Fix ports table schema if it was created with camelCase columns
  try {
    const tableInfo = db!.prepare("PRAGMA table_info(ports)").all() as any[];
    if (tableInfo.length > 0) {
      // Check if old camelCase columns exist
      const hasOldColumns = tableInfo.some(col => col.name === 'portNumber' || col.name === 'serverType' || col.name === 'createdAt');
      if (hasOldColumns) {
        // Drop and recreate table with correct schema
        db!.exec('DROP TABLE IF EXISTS ports');
        db!.exec(`
          CREATE TABLE ports (
            id TEXT PRIMARY KEY,
            port_number INTEGER UNIQUE NOT NULL,
            server_type TEXT NOT NULL CHECK(server_type IN ('frontend', 'backend', 'api')),
            name TEXT,
            description TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          )
        `);
      }
    }
  } catch (error: any) {
    // Table doesn't exist yet, which is fine
    if (!error.message.includes('no such table')) {
      console.warn('Migration warning:', error.message);
    }
  }

  // Migration: Add nsfw column if it doesn't exist
  try {
    db!.exec('ALTER TABLE projects ADD COLUMN nsfw INTEGER DEFAULT 0');
    // Set all existing projects to nsfw = 0 (false)
    db!.exec('UPDATE projects SET nsfw = 0 WHERE nsfw IS NULL');
  } catch (error: any) {
    // Column already exists, ignore error
    if (!error.message.includes('duplicate column name')) {
      console.warn('Migration warning:', error.message);
    }
  }

  // Migration: Add logoUrl column if it doesn't exist
  try {
    db!.exec('ALTER TABLE projects ADD COLUMN logoUrl TEXT');
  } catch (error: any) {
    // Column already exists, ignore error
    if (!error.message.includes('duplicate column name')) {
      console.warn('Migration warning:', error.message);
    }
  }

  // Seed initial port allocations
  seedPorts();

  // Check if database is empty
  const partitionCount = db!.prepare('SELECT COUNT(*) as count FROM partitions').get() as { count: number };
  
  if (partitionCount.count === 0) {
    loadSeedData();
  }
}

function seedPorts(): void {
  try {
    const portCount = db!.prepare('SELECT COUNT(*) as count FROM ports').get() as { count: number };
    
    // Only seed if ports table is empty
    if (portCount.count > 0) {
      console.log(`Ports table already has ${portCount.count} entries, skipping seed`);
      return;
    }

    console.log('Seeding initial port allocations...');

    const projects = [
      'portfolio',      // This app
      'glass-spa',
      'glass-spa-2',
      'interaction-log',
      'notes-phoneline',
      'nsfw-project',
      'rambulations',
      'routine-builder',
      'simples',
      'sound-mixer',
      'tutorone',
    ];

    const insertPort = db!.prepare(`
      INSERT INTO ports (id, port_number, server_type, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    let backendPort = 3000;
    let frontendPort = 5145;

    const transaction = db!.transaction(() => {
      for (const project of projects) {
        // Backend port
        insertPort.run(
          `${project}-backend`,
          backendPort,
          'backend',
          `${project} Backend`,
          `Backend server port for ${project}`,
          now,
          now
        );

        // Frontend port
        insertPort.run(
          `${project}-frontend`,
          frontendPort,
          'frontend',
          `${project} Frontend`,
          `Frontend server port for ${project}`,
          now,
          now
        );

        backendPort++;
        frontendPort++;
      }
    });

    transaction();
    console.log(`Successfully seeded ${projects.length * 2} port allocations`);
  } catch (error: any) {
    console.error('Error seeding ports:', error);
    // Don't throw - allow server to start even if seeding fails
  }
}

function loadSeedData(): void {
  let seedData: any;
  
  // Try to load seed.json first, fallback to seed_p_1.json
  if (fs.existsSync(SEED_PATH)) {
    const seedContent = fs.readFileSync(SEED_PATH, 'utf-8');
    seedData = JSON.parse(seedContent);
  } else if (fs.existsSync(SEED_P_1_PATH)) {
    const seedContent = fs.readFileSync(SEED_P_1_PATH, 'utf-8');
    seedData = JSON.parse(seedContent);
  } else {
    throw new Error('No seed file found. Expected seed.json or seed_p_1.json in project root.');
  }

  const insertPartition = db!.prepare(`
    INSERT INTO partitions (id, slug, name, description, sortOrder)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertProject = db!.prepare(`
    INSERT INTO projects (
      id, slug, name, tagline, shortDescription, longDescription,
      status, primaryRepoUrl, liveUrl, githubRepoFullName, logoUrl,
      createdAt, updatedAt, inPortfolio, nsfw
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertProjectPartition = db!.prepare(`
    INSERT INTO project_partitions (projectId, partitionId, isFeatured, sortOrder)
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db!.transaction(() => {
    // Insert partitions
    for (const partition of seedData.partitions || []) {
      insertPartition.run(
        partition.id,
        partition.slug,
        partition.name,
        partition.description || null,
        partition.sortOrder
      );
    }

    // Insert projects
    for (const project of seedData.projects || []) {
      insertProject.run(
        project.id,
        project.slug,
        project.name,
        project.tagline || null,
        project.shortDescription || null,
        project.longDescription || null,
        project.status,
        project.primaryRepoUrl || null,
        project.liveUrl || null,
        project.githubRepoFullName || null,
        project.logoUrl || null,
        project.createdAt,
        project.updatedAt,
        project.inPortfolio === true ? 1 : 0,
        project.nsfw === true ? 1 : 0
      );
    }

    // Insert project_partitions
    for (const pp of seedData.projectPartitions || []) {
      insertProjectPartition.run(
        pp.projectId,
        pp.partitionId,
        pp.isFeatured === true ? 1 : 0,
        pp.sortOrder
      );
    }
  });

  transaction();
}

// Query helpers
export function query<T>(sql: string, params: any[] = []): T[] {
  const stmt = getDb().prepare(sql);
  return stmt.all(...params) as T[];
}

export function queryOne<T>(sql: string, params: any[] = []): T | undefined {
  const stmt = getDb().prepare(sql);
  return stmt.get(...params) as T | undefined;
}

// Graceful shutdown: close database connection
export function closeDb(): void {
  if (db) {
    try {
      db.close();
      db = null;
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database:', error);
    }
  }
}

