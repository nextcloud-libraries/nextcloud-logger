import { buildConsoleLogger } from './ConsoleLogger'
import { ILogger } from './contracts'
import { LoggerBuilder } from './LoggerBuilder'

/**
 * Build a customized logger instance
 */
export function getLoggerBuilder(): LoggerBuilder {
    return new LoggerBuilder(buildConsoleLogger)
}

/**
 * Get a default logger instance without any configuration
 */
export function getLogger(): ILogger {
    return getLoggerBuilder().build()
}
