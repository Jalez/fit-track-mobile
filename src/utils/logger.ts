import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Extend Error interface to include 'cause' which is available in ES2022
declare global {
  interface Error {
    cause?: unknown;
  }
}

const LOG_STORAGE_KEY = '@FitTrack:logs';
const MAX_LOGS = 100;
const MAX_RECURSION = 3; // Prevent infinite recursion in error logging

export interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: string;
  timestamp: string;
}

/**
 * App logger utility for capturing errors and important events
 */
class Logger {
  private static isLogging = false; // Prevent recursive logging

  private static async storeLogs(logs: LogEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      // Silently fail storage errors to prevent loops
      if (!this.isLogging) {
        this.isLogging = true;
        console.warn('Failed to store logs:', e);
        this.isLogging = false;
      }
    }
  }

  private static async fetchLogs(): Promise<LogEntry[]> {
    try {
      const logsJson = await AsyncStorage.getItem(LOG_STORAGE_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (e) {
      // Silently fail storage errors to prevent loops
      if (!this.isLogging) {
        this.isLogging = true;
        console.warn('Failed to fetch logs:', e);
        this.isLogging = false;
      }
      return [];
    }
  }

  private static serializeError(error: any, depth = 0): string {
    if (depth > MAX_RECURSION) return '[Max Recursion Depth]';
    
    try {
      if (error instanceof Error) {
        return JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...(error.cause ? { cause: this.serializeError(error.cause, depth + 1) } : {})
        });
      }
      
      if (typeof error === 'object' && error !== null) {
        const serialized: any = {};
        for (const key in error) {
          try {
            serialized[key] = this.serializeError(error[key], depth + 1);
          } catch {
            serialized[key] = '[Circular Reference]';
          }
        }
        return JSON.stringify(serialized);
      }
      
      return JSON.stringify(error);
    } catch {
      return '[Unserializable Error]';
    }
  }

  private static async addLog(
    level: 'info' | 'warn' | 'error',
    message: string,
    details?: any
  ): Promise<void> {
    if (this.isLogging) return; // Prevent recursive logging
    
    this.isLogging = true;
    try {
      const logs = await this.fetchLogs();
      
      const serializedDetails = details ? 
        typeof details === 'string' ? 
          details : 
          this.serializeError(details) 
        : undefined;

      const newLog: LogEntry = {
        level,
        message,
        details: serializedDetails,
        timestamp: new Date().toISOString(),
      };
      
      logs.unshift(newLog);
      const trimmedLogs = logs.slice(0, MAX_LOGS);
      
      await this.storeLogs(trimmedLogs);
    } catch (e) {
      // Silently fail to prevent loops
    } finally {
      this.isLogging = false;
    }
  }

  static async info(message: string, details?: any): Promise<void> {
    if (!this.isLogging) {
      console.log(`[INFO] ${message}`, details ?? '');
    }
    return this.addLog('info', message, details);
  }

  static async warn(message: string, details?: any): Promise<void> {
    if (!this.isLogging) {
      console.warn(`[WARN] ${message}`, details ?? '');
    }
    return this.addLog('warn', message, details);
  }

  static async error(message: string, details?: any): Promise<void> {
    if (!this.isLogging) {
      console.error(`[ERROR] ${message}`, details ?? '');
    }
    return this.addLog('error', message, details);
  }

  static async getAllLogs(): Promise<LogEntry[]> {
    return this.fetchLogs();
  }

  static async clearLogs(): Promise<void> {
    return this.storeLogs([]);
  }
}

export default Logger;