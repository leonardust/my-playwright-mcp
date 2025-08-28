import winston from 'winston';

/**
 * Worker context for logging
 */
interface WorkerContext {
  workerId?: string;
  workerIndex?: number;
}

let workerContext: WorkerContext = {};

/**
 * Set worker information for logging
 */
export const setWorkerContext = (context: WorkerContext): void => {
  workerContext = context;
};

/**
 * Get formatted worker info for logs
 */
const getWorkerPrefix = (): string => {
  if (workerContext.workerId) {
    return `[Worker-${workerContext.workerId}] `;
  }
  if (workerContext.workerIndex !== undefined) {
    return `[Worker-${workerContext.workerIndex}] `;
  }
  return '';
};

/**
 * Custom log levels for Playwright tests
 */
const customLevels = {
  levels: {
    error: 0,
    test: 1,
    assert: 2,
    meth: 3,
    elem: 4,
  },
  colors: {
    error: 'red',
    test: 'cyan bold',
    assert: 'magenta bold',
    meth: 'green',
    elem: 'yellow',
  },
};

/**
 * Logger configuration for Playwright tests
 * Provides structured logging with custom levels and colors
 */
const createLogger = (): winston.Logger => {
  const isDevelopment = !process.env.CI;
  const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'elem' : 'test');

  // Add custom colors to winston
  winston.addColors(customLevels.colors);

  return winston.createLogger({
    levels: customLevels.levels,
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.colorize({ all: isDevelopment }),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        const workerPrefix = getWorkerPrefix();
        const logMessage = `[${timestamp}] ${workerPrefix}${level}: ${message}`;
        return stack ? `${logMessage}\n${stack}` : logMessage;
      })
    ),
    transports: [
      new winston.transports.Console({
        silent: process.env.NODE_ENV === 'test' && !process.env.DEBUG_LOGS,
      }),
      new winston.transports.File({
        filename: 'test-results/test-logs.log',
        level: 'test',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      }),
      new winston.transports.File({
        filename: 'test-results/error-logs.log',
        level: 'error',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      }),
    ],
  });
};

export const logger = createLogger();

/**
 * Assertion logger - logs test assertions and verifications
 */
export const logAssertion = (description: string, context?: string): void => {
  const message = context ? `[${context}] ${description}` : description;
  logger.log('assert', message);
};

/**
 * Page action logger - logs page object actions
 */
export const logPageAction = (pageName: string, action: string, details?: string): void => {
  const message = details ? `[${pageName}] ${action} - ${details}` : `[${pageName}] ${action}`;
  logger.log('meth', message);
};

/**
 * Error logger with context
 */
export const logError = (error: Error, context?: string): void => {
  const message = context ? `Error in ${context}: ${error.message}` : `Error: ${error.message}`;
  logger.error(message, { stack: error.stack });
};

/**
 * Element action logger - logs element interactions with selectors
 */
export const logElementAction = (
  pageName: string,
  action: string,
  elementName: string,
  selector: string,
  value?: string
): void => {
  const message = value
    ? `[${pageName}] ${action} on "${elementName}" (${selector}) with value: "${value}"`
    : `[${pageName}] ${action} on "${elementName}" (${selector})`;
  logger.log('elem', message);
};
