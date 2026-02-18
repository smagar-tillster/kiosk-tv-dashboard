/**
 * Centralized logging utility with configurable log levels
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private currentLevel: LogLevel;

  constructor() {
    // Default to INFO level - only show INFO, WARN, ERROR
    // Set to DEBUG in config to see debug logs
    this.currentLevel = LogLevel.INFO;
  }

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  getLevel(): LogLevel {
    return this.currentLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.currentLevel);
  }

  debug(...args: any[]) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log('[DEBUG]', ...args);
    }
  }

  info(...args: any[]) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log('[INFO]', ...args);
    }
  }

  warn(...args: any[]) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: any[]) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error('[ERROR]', ...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
