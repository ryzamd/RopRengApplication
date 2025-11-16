/**
 * Logger
 * Centralized logging service
 *
 * Features:
 * - Log levels (debug, info, warn, error)
 * - Conditional logging (dev/prod)
 * - Structured logging
 * - Performance tracking
 */

import { ENV } from '../../config/env';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: number;
  source?: string;
}

export class Logger {
  private static instance: Logger;
  private enabled: boolean = ENV.ENABLE_LOGGING;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Debug log
   */
  public debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source);
  }

  /**
   * Info log
   */
  public info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source);
  }

  /**
   * Warning log
   */
  public warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source);
  }

  /**
   * Error log
   */
  public error(message: string, error?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, error, source);
  }

  /**
   * Generic log
   */
  private log(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string
  ): void {
    if (!this.enabled && level !== LogLevel.ERROR) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
      source,
    };

    // Store log
    this.logs.push(entry);

    // Trim logs if exceeded max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    this.output(entry);
  }

  /**
   * Output log to console
   */
  private output(entry: LogEntry): void {
    const prefix = entry.source ? `[${entry.source}]` : '';
    const timestamp = new Date(entry.timestamp).toISOString();

    const formattedMessage = `${timestamp} ${prefix} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.log(formattedMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, entry.data);
        break;
    }
  }

  /**
   * Get all logs
   */
  public getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  public clear(): void {
    this.logs = [];
  }

  /**
   * Enable/disable logging
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
