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
    
    server.listen(port, () => {
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
  const inUse = await isPortInUse(port);
  
  if (!inUse) {
    return { inUse: false };
  }

  // Try to get PID using lsof (works on macOS and Linux)
  try {
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pid = parseInt(stdout.trim(), 10);
    if (!isNaN(pid)) {
      return { inUse: true, pid };
    }
  } catch (error) {
    // If lsof fails or no process found, just return inUse status
    // This is expected if the port is in use but we can't get PID
  }

  return { inUse: true };
}




