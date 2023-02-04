export enum LogLevel {
    Debug = 0,
    Info  = 1,
    Warn  = 2,
    Error = 3,
    Fatal = 4,
}

export interface ILogger {

    debug(message: string|Error, context?: object): void
    info(message: string|Error, context?: object): void
    warn(message: string|Error, context?: object): void
    error(message: string|Error, context?: object): void
    fatal(message: string|Error, context?: object): void

}

export interface ILoggerFactory {
    (context: any): ILogger
}
