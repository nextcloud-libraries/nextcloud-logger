export enum LogLevel {
    Debug = 0,
    Info  = 1,
    Warn  = 2,
    Error = 3,
    Fatal = 4,
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
