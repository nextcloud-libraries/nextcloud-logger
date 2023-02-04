import { ILogger, LoggerContext, LogLevel } from './contracts'

export class ConsoleLogger implements ILogger {

	private context: LoggerContext

	constructor(context: LoggerContext) {
		this.context = context
	}

	private formatMessage(message: string, level: LogLevel, context: LoggerContext): string {
		let msg = '[' + LogLevel[level].toUpperCase() + ']'

		if (context.app) {
			msg += ' ' + context.app + ': '
		}
		return msg + message
	}

	log(level: LogLevel, message: string, ctx?: object) {
		if (this.context.level && level < this.context?.level) return

		const context = { ...this.context, ...ctx }

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
		this.log(LogLevel.Debug, message, context)
	}

	info(message: string, context?: object): void {
		this.log(LogLevel.Info, message, context)
	}

	warn(message: string, context?: object): void {
		this.log(LogLevel.Warn, message, context)
	}

	error(message: string, context?: object): void {
		this.log(LogLevel.Error, message, context)
	}

	fatal(message: string, context?: object): void {
		this.log(LogLevel.Fatal, message, context)
	}

}

/**
 * ConsoleLogger factory
 *
 * @param context logger context, contains e.g. current user and app
 */
export function buildConsoleLogger(context: LoggerContext): ILogger {
	return new ConsoleLogger(context)
}
