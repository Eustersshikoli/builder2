// Production-safe logging utility
// Automatically filters sensitive data and provides different log levels

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

class ProductionLogger {
  private isDevelopment = import.meta.env.DEV;
  private enabledLevels: Set<LogLevel>;

  // Patterns that might contain sensitive data
  private sensitivePatterns = [
    /password/i,
    /secret/i,
    /token/i,
    /key/i,
    /auth/i,
    /credential/i,
    /private/i,
    /secure/i,
  ];

  // Specific keys that should be filtered
  private sensitiveKeys = [
    "password",
    "encrypted_password",
    "password_hash",
    "secret",
    "token",
    "api_key",
    "private_key",
    "session_id",
    "auth_token",
    "access_token",
    "refresh_token",
    "bearer_token",
    "authorization",
    "cookie",
    "x-api-key",
  ];

  constructor() {
    // In production, only log warnings and errors
    this.enabledLevels = this.isDevelopment
      ? new Set(["debug", "info", "warn", "error"])
      : new Set(["warn", "error"]);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enabledLevels.has(level);
  }

  private sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === "string") {
      // Check if string might contain sensitive information
      for (const pattern of this.sensitivePatterns) {
        if (pattern.test(data)) {
          return "[REDACTED]";
        }
      }
      return data;
    }

    if (typeof data === "object") {
      if (Array.isArray(data)) {
        return data.map((item) => this.sanitizeData(item));
      }

      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();

        // Check if key is sensitive
        if (
          this.sensitiveKeys.some((sensitiveKey) =>
            lowerKey.includes(sensitiveKey.toLowerCase()),
          )
        ) {
          sanitized[key] = "[REDACTED]";
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (!context) {
      return `${prefix} ${message}`;
    }

    const sanitizedContext = this.sanitizeData(context);
    return `${prefix} ${message} ${JSON.stringify(sanitizedContext)}`;
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog("debug")) return;
    console.log(this.formatMessage("debug", message, context));
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog("info")) return;
    console.log(this.formatMessage("info", message, context));
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog("warn")) return;
    console.warn(this.formatMessage("warn", message, context));
  }

  error(message: string, context?: LogContext): void {
    if (!this.shouldLog("error")) return;
    console.error(this.formatMessage("error", message, context));
  }

  // Special method for database operations
  database(
    operation: string,
    result: "success" | "error",
    context?: LogContext,
  ): void {
    const sanitizedContext = context ? this.sanitizeData(context) : undefined;

    if (result === "success") {
      this.debug(`Database ${operation} completed`, sanitizedContext);
    } else {
      this.error(`Database ${operation} failed`, sanitizedContext);
    }
  }

  // Special method for authentication operations
  auth(operation: string, result: "success" | "error", userId?: string): void {
    const context = userId ? { userId } : undefined;

    if (result === "success") {
      this.info(`Authentication ${operation} successful`, context);
    } else {
      this.warn(`Authentication ${operation} failed`, context);
    }
  }

  // Method to temporarily enable debug logging (for development)
  enableDebugMode(): void {
    if (this.isDevelopment) {
      this.enabledLevels.add("debug");
      this.enabledLevels.add("info");
    }
  }

  // Method to disable all logging except errors (for production)
  setProductionMode(): void {
    this.enabledLevels.clear();
    this.enabledLevels.add("error");
  }
}

// Create a singleton instance
export const logger = new ProductionLogger();

// Export types for use in other modules
export type { LogLevel, LogContext };

// Convenience functions for backward compatibility
export const log = {
  debug: (message: string, context?: LogContext) =>
    logger.debug(message, context),
  info: (message: string, context?: LogContext) =>
    logger.info(message, context),
  warn: (message: string, context?: LogContext) =>
    logger.warn(message, context),
  error: (message: string, context?: LogContext) =>
    logger.error(message, context),
  database: (
    operation: string,
    result: "success" | "error",
    context?: LogContext,
  ) => logger.database(operation, result, context),
  auth: (operation: string, result: "success" | "error", userId?: string) =>
    logger.auth(operation, result, userId),
};

export default logger;
