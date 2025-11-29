import dotenv from 'dotenv';
import * as path from 'path';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// ANSI color codes
const GREEN = '\x1b[32m';
const BRIGHT_GREEN = '\x1b[92m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

interface FooterOptions {
  backendStatus?: string;
  frontendStatus?: string;
}

export function printFooter(options: FooterOptions = {}): void {
  const PROJECT_NAME = 'portfolio';
  const backendPort = process.env.PORT || '3001';
  const frontendPort = process.env.FRONTEND_PORT || '5174';
  const activeEnv = process.env.NODE_ENV || 'development';
  
  const backendStatus = options.backendStatus || 'INACTIVE';
  const frontendStatus = options.frontendStatus || 'INACTIVE';
  
  const backendOnline = backendStatus === 'active' || backendStatus === 'running';
  const frontendOnline = frontendStatus === 'active' || frontendStatus === 'running';
  
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  
  const backendCode = backendOnline ? 'ONLINE' : 'OFFLINE';
  const frontendCode = frontendOnline ? 'ONLINE' : 'OFFLINE';
  const backendColor = backendOnline ? BRIGHT_GREEN : RED;
  const frontendColor = frontendOnline ? BRIGHT_GREEN : RED;
  
  const visibleLength = (str: string): number => str.replace(/\x1b\[[0-9;]*m/g, '').length;
  const padVisible = (str: string, width: number): string => {
    const visible = visibleLength(str);
    const padding = Math.max(0, width - visible);
    return str + ' '.repeat(padding);
  };
  
  const innerWidth = 65;
  const title = 'STATUS MONITOR';
  const titlePadding = Math.floor((innerWidth - visibleLength(title) - 2) / 2);
  const projectNameUpper = PROJECT_NAME.toUpperCase();
  const projectPadding = Math.floor((innerWidth - visibleLength(projectNameUpper) - 2) / 2);
  
  const col1Width = 24, col2Width = 8, col3Width = 6, col4Width = 9;
  
  console.log('');
  console.log(` ${BOLD}${CYAN}╔${'═'.repeat(innerWidth - 2)}╗${RESET}`);
  console.log(` ${CYAN}║${RESET}${' '.repeat(titlePadding)}${BOLD}${BRIGHT_GREEN}${title}${RESET}${' '.repeat(innerWidth - 2 - titlePadding - visibleLength(title))} ${CYAN}║${RESET}`);
  console.log(` ${CYAN}║${RESET}${' '.repeat(projectPadding)}${DIM}${projectNameUpper}${RESET}${' '.repeat(innerWidth - 2 - projectPadding - visibleLength(projectNameUpper))} ${CYAN}║${RESET}`);
  console.log(` ${CYAN}╚${'═'.repeat(innerWidth - 2)}╝${RESET}`);
  console.log('');
  console.log(` ${GREEN}SYSTEM TIME:${RESET} ${CYAN}${timestamp}${RESET}`);
  console.log(` ${GREEN}ENVIRONMENT:${RESET} ${YELLOW}${activeEnv.toUpperCase()}${RESET} ${GREEN}MODE${RESET}`);
  console.log('');
  console.log(` ${BOLD}${CYAN}┌${'─'.repeat(col1Width)}┬${'─'.repeat(col2Width)}┬${'─'.repeat(col3Width)}┬${'─'.repeat(col4Width)}┐${RESET}`);
  console.log(` ${CYAN}│${RESET} ${BOLD}${GREEN}${padVisible('SYSTEM COMPONENT', col1Width - 2)}${RESET} ${CYAN}│${RESET} ${GREEN}${padVisible('STATUS', col2Width - 2)}${RESET} ${CYAN}│${RESET} ${GREEN}${padVisible('PORT', col3Width - 2)}${RESET} ${CYAN}│${RESET} ${GREEN}${padVisible('PROTOCOL', col4Width - 2)}${RESET} ${CYAN}│${RESET}`);
  console.log(` ${CYAN}├${'─'.repeat(col1Width)}┼${'─'.repeat(col2Width)}┼${'─'.repeat(col3Width)}┼${'─'.repeat(col4Width)}┤${RESET}`);
  console.log(` ${CYAN}│${RESET} ${GREEN}${padVisible('BACKEND API SERVER', col1Width - 2)}${RESET} ${CYAN}│${RESET} ${backendColor}${padVisible(backendCode, col2Width - 2)}${RESET} ${CYAN}│${RESET} ${CYAN}${padVisible(backendPort, col3Width - 2)}${RESET} ${CYAN}│${RESET} ${CYAN}${padVisible('HTTP', col4Width - 2)}${RESET} ${CYAN}│${RESET}`);
  console.log(` ${CYAN}│${RESET} ${GREEN}${padVisible('FRONTEND DEV SERVER', col1Width - 2)}${RESET} ${CYAN}│${RESET} ${frontendColor}${padVisible(frontendCode, col2Width - 2)}${RESET} ${CYAN}│${RESET} ${CYAN}${padVisible(frontendPort, col3Width - 2)}${RESET} ${CYAN}│${RESET} ${CYAN}${padVisible('HTTP', col4Width - 2)}${RESET} ${CYAN}│${RESET}`);
  console.log(` ${CYAN}└${'─'.repeat(col1Width)}┴${'─'.repeat(col2Width)}┴${'─'.repeat(col3Width)}┴${'─'.repeat(col4Width)}┘${RESET}`);
  console.log('');
  const operatorText = `${DIM}${GREEN}OPERATOR:${RESET} ${CYAN}DRCUOA - Richard Clark${RESET}`;
  const orgText = `${GREEN}ORGANIZATION:${RESET} ${CYAN}NZ WebApps Ltd${RESET}`;
  console.log(` ${operatorText} ${DIM}│${RESET} ${orgText}`);
  console.log(` ${DIM}${GREEN}COPYRIGHT:${RESET} ${CYAN}(C) NZ WebApps Ltd 2025${RESET}`);
  console.log('');
}







