import { config } from '../config/config';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = config.nodeEnv === 'development';
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const argsStr = args.length > 0 ? ' ' + JSON.stringify(args) : '';
    return `[${timestamp}] [${level}] ${message}${argsStr}`;
  }

  info(message: string, ...args: any[]): void {
    console.log(this.formatMessage(LogLevel.INFO, message, ...args));
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, ...args));
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, ...args));
  }

  debug(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, ...args));
    }
  }
}

export const logger = new Logger();
