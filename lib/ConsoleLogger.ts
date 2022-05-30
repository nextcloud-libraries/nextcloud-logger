import { ILogger, LogLevel } from './contracts'

export class ConsoleLogger implements ILogger {

    private context: any

    constructor(context: any) {
        this.context = context
    }

    private formatMessage(message: string, level: LogLevel, context: any): string {
        let msg = '[' + LogLevel[level].toUpperCase() + ']'
        if (context && context.app) {
            msg += ' ' + context.app + ': '
        }
        return msg + message
    }

    log(level: LogLevel, message: string, context: object) {
	if (level < this.context?.level) return;
        switch (level) {
            case LogLevel.Debug:
                console.debug(this.formatMessage(message, LogLevel.Debug, context), context)
                break
            case LogLevel.Info:
                console.info(this.formatMessage(message, LogLevel.Info, context), context)
                break
            case LogLevel.Warn:
                console.warn(this.formatMessage(message, LogLevel.Warn, context), context)
                break
            case LogLevel.Error:
                console.error(this.formatMessage(message, LogLevel.Error, context), context)
                break
            case LogLevel.Fatal:
            default:
                console.error(this.formatMessage(message, LogLevel.Fatal, context), context)
                break
        }
    }

    debug(message: string, context?: object): void {
        this.log(LogLevel.Debug, message, Object.assign({}, this.context, context))
    }

    info(message: string, context?: object): void {
        this.log(LogLevel.Info, message, Object.assign({}, this.context, context))
    }

    warn(message: string, context?: object): void {
        this.log(LogLevel.Warn, message, Object.assign({}, this.context, context))
    }

    error(message: string, context?: object): void {
        this.log(LogLevel.Error, message, Object.assign({}, this.context, context))
    }

    fatal(message: string, context?: object): void {
        this.log(LogLevel.Fatal, message, Object.assign({}, this.context, context))
    }

}

export function buildConsoleLogger(context: any): ILogger {
    return new ConsoleLogger(context)
}
