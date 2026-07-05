import { getCoreLogsPath } from "core/util/paths";
import fs from "node:fs";

// Store original console methods to allow dual output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleDebug = console.debug;

export function setupCoreLogging() {
  const logFilePath = getCoreLogsPath();

  // Ensure logs directory exists
  const logsDir = logFilePath.substring(0, logFilePath.lastIndexOf("\\"));
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const logger = (
    level: string,
    originalFn: (...args: any[]) => void,
    message: any,
    ...optionalParams: any[]
  ) => {
    const timestamp = new Date().toISOString().split(".")[0];
    const logMessage = `[${timestamp}] [${level}] ${message} ${optionalParams.join(" ")}\n`;

    // Write to file
    try {
      fs.appendFileSync(logFilePath, logMessage);
    } catch (err) {
      // Fallback to console if file write fails
      originalConsoleError(`Failed to write to log file: ${err}`);
    }

    // Also output to console
    originalFn(`[${level}] ${message}`, ...optionalParams);
  };

  console.log = (message: any, ...optionalParams: any[]) =>
    logger("INFO", originalConsoleLog, message, ...optionalParams);
  console.error = (message: any, ...optionalParams: any[]) =>
    logger("ERROR", originalConsoleError, message, ...optionalParams);
  console.warn = (message: any, ...optionalParams: any[]) =>
    logger("WARN", originalConsoleWarn, message, ...optionalParams);
  console.debug = (message: any, ...optionalParams: any[]) =>
    logger("DEBUG", originalConsoleDebug, message, ...optionalParams);

  console.log("[info] Starting Continue core...");
}
