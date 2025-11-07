/**
 * SPDX-FileCopyrightText: 2019-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { IContext, ILogger } from './contracts.ts'

import { LogLevel } from './contracts.ts'

export class ConsoleLogger implements ILogger {
	private context: IContext

	constructor(context?: IContext) {
		this.context = context || {}
	}

	private formatMessage(message: string | Error, level: LogLevel, context?: IContext): string {
		let msg = '[' + LogLevel[level].toUpperCase() + '] '

		if (context && context.app) {
			msg += context.app + ': '
		}

		if (typeof message === 'string') { return msg + message }

		// basic error formatting
		msg += `Unexpected ${message.name}`
		if (message.message) { msg += ` "${message.message}"` }
		// only add stack trace when debugging
		if (level === LogLevel.Debug && message.stack) { msg += `\n\nStack trace:\n${message.stack}` }

		return msg
	}

	log(level: LogLevel, message: string | Error, context: IContext) {
		// Skip if level is configured and this is below the level
		if (typeof this.context?.level === 'number' && level < this.context?.level) {
			return
		}

		// Add error object to context
		if (typeof message === 'object' && context?.error === undefined) {
			context.error = message
		}

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

	debug(message: string | Error, context?: IContext): void {
		this.log(LogLevel.Debug, message, { ...this.context, ...context })
	}

	info(message: string | Error, context?: IContext): void {
		this.log(LogLevel.Info, message, { ...this.context, ...context })
	}

	warn(message: string | Error, context?: IContext): void {
		this.log(LogLevel.Warn, message, { ...this.context, ...context })
	}

	error(message: string | Error, context?: IContext): void {
		this.log(LogLevel.Error, message, { ...this.context, ...context })
	}

	fatal(message: string | Error, context?: IContext): void {
		this.log(LogLevel.Fatal, message, { ...this.context, ...context })
	}
}

/**
 * Create a new console logger
 *
 * @param context Optional global context which should be included for all logging messages
 */
export function buildConsoleLogger(context?: IContext): ILogger {
	return new ConsoleLogger(context)
}
