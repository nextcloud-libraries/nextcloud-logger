import { ILogger, LogLevel } from './contracts'

export class ConsoleLogger implements ILogger {

    private context: any

    constructor(context: any) {
        this.context = context
    }

    private formatMessage(message: string, level: LogLevel, context: any): string {
        let msg = '[' + level + ']'
        if (context && context.app) {
            msg += ' ' + context.app + ': '
        }
        return msg + message
    }

    log(level: number, message: string, context: object) {
        switch (level) {
            case 0:
                console.debug(this.formatMessage(message, LogLevel.Debug, context), context)
                break
            case 1:
                console.info(this.formatMessage(message, LogLevel.Info, context), context)
                break
            case 2:
                console.warn(this.formatMessage(message, LogLevel.Warn, context), context)
                break
            case 3:
                console.error(this.formatMessage(message, LogLevel.Error, context), context)
                break
            default:
                console.error(this.formatMessage(message, LogLevel.Fatal, context), context)
                break
        }
    }

    debug(message: string, context?: object): void {
        this.log(0, message, Object.assign({}, this.context, context))
    }

    info(message: string, context?: object): void {
        this.log(1, message, Object.assign({}, this.context, context))
    }

    warn(message: string, context?: object): void {
        this.log(2, message, Object.assign({}, this.context, context))
    }

    error(message: string, context?: object): void {
        this.log(3, message, Object.assign({}, this.context, context))
    }

    fatal(message: string, context?: object): void {
        this.log(4, message, Object.assign({}, this.context, context))
    }

}

export function buildConsoleLogger(context: any): ILogger {
    return new ConsoleLogger(context)
}
