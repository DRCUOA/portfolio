import * as net from 'net';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface PortStatus {
  inUse: boolean;
  pid?: number;
}

export function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    // Explicitly bind to localhost (127.0.0.1) for security
    server.listen(port, '127.0.0.1', () => {
      server.once('close', () => {
        resolve(false);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(true);
    });
  });
}

export async function getPortStatus(port: number): Promise<PortStatus> {
  // Use lsof to find the process LISTENING on the port (not client connections)
  try {
    // Get detailed info to filter for LISTEN state only
    const { stdout } = await execAsync(`lsof -i:${port} -sTCP:LISTEN -t`);
    const pidStr = stdout.trim();
    if (pidStr) {
      // lsof -t returns only PIDs, one per line
      // Take the first one (there should typically be only one listener)
      const pid = parseInt(pidStr.split('\n')[0], 10);
      if (!isNaN(pid)) {
        return { inUse: true, pid };
      }
    }
    // No process found listening on port
    return { inUse: false };
  } catch (error) {
    // If lsof fails or no listener found, fall back to net binding check
    // This handles cases where lsof might not be available
    const inUse = await isPortInUse(port);
    return { inUse };
  }
}




