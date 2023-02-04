import { ILogger, LogLevel } from './contracts'

export class ConsoleLogger implements ILogger {

    private context: any

    constructor(context: any) {
        this.context = context || {}
    }

    private formatMessage(message: string|Error, level: LogLevel, context: any): string {
        let msg = '[' + LogLevel[level].toUpperCase() + ']'

        if (context && context.app) {
            msg += ' ' + context.app + ': '
        }

        if (typeof message === 'string') return msg + message

        // basic error formatting
        msg += `Unexpected ${message.name}`
        if (message.message) msg += ` "${message.message}"`
        // only add stack trace when debugging
        if (level === LogLevel.Debug && message.stack) msg += `\n\nStack trace:\n${message.stack}`

        return msg
    }

    log(level: LogLevel, message: string|Error, context: object) {
        if (level < this.context?.level) return;

        // Add error object to context
        if (typeof message === 'object' && (context as any).error === undefined) (context as any).error = message

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

    debug(message: string|Error, context?: object): void {
        this.log(LogLevel.Debug, message, Object.assign({}, this.context, context))
    }

    info(message: string|Error, context?: object): void {
        this.log(LogLevel.Info, message, Object.assign({}, this.context, context))
    }

    warn(message: string|Error, context?: object): void {
        this.log(LogLevel.Warn, message, Object.assign({}, this.context, context))
    }

    error(message: string|Error, context?: object): void {
        this.log(LogLevel.Error, message, Object.assign({}, this.context, context))
    }

    fatal(message: string|Error, context?: object): void {
        this.log(LogLevel.Fatal, message, Object.assign({}, this.context, context))
    }

}

export function buildConsoleLogger(context: any): ILogger {
    return new ConsoleLogger(context)
}
