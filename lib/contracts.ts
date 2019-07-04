export enum LogLevel {
    Debug = 'DEBUG',
    Info = 'INFO',
    Warn = 'WARN',
    Error = 'ERROR',
    Fatal = 'FATAL',
}

export interface ILogger {

    debug(message: string, context?: object): void
    info(message: string, context?: object): void
    warn(message: string, context?: object): void
    error(message: string, context?: object): void
    fatal(message: string, context?: object): void

}

export interface ILoggerFactory {
    (context: any): ILogger
}
