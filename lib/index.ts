import { buildConsoleLogger } from './ConsoleLogger'
import { ILogger } from './contracts'
import { LoggerBuilder } from './Builder'

export function getLoggerBuilder(): LoggerBuilder {
    return new LoggerBuilder(buildConsoleLogger)
}

export function getLogger(): ILogger {
    return getLoggerBuilder().build()
}
