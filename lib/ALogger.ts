/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { IContext, ILogger } from './contracts.ts'

import { LogLevel } from './contracts.ts'

/**
 * Abstract base logger implementing common functionality
 */
export abstract class ALogger implements ILogger {
	/**
	 * The initial logging context set by the constructor (LoggerBuilder factory)
	 */
	protected abstract context: IContext

	/**
	 * Log a message with the specified level and context
	 *
	 * @param level - The log level requested
	 * @param message - The log message
	 * @param context - The logging context
	 */
	protected abstract log(level: LogLevel, message: string, context: IContext): void

	public debug(message: string | Error, context?: IContext): void {
		this.logIfNeeded(LogLevel.Debug, message, { ...context, ...this.context })
	}

	public info(message: string | Error, context?: IContext): void {
		this.logIfNeeded(LogLevel.Info, message, { ...context, ...this.context })
	}

	public warn(message: string | Error, context?: IContext): void {
		this.logIfNeeded(LogLevel.Warn, message, { ...context, ...this.context })
	}

	public error(message: string | Error, context?: IContext): void {
		this.logIfNeeded(LogLevel.Error, message, { ...context, ...this.context })
	}

	public fatal(message: string | Error, context?: IContext): void {
		this.logIfNeeded(LogLevel.Fatal, message, { ...context, ...this.context })
	}

	/**
	 * Check if the message should be logged and prepare the context
	 *
	 * @param level - The logging level requested
	 * @param message - The log message or Error object
	 * @param context - The logging context
	 */
	private logIfNeeded(level: LogLevel, message: string | Error, context: IContext): void {
		// Skip if level is configured and this is below the level
		if (typeof this.context?.level === 'number' && level < this.context?.level && !this.debuggingEnabled()) {
			return
		}

		// Handle logging when only an error was passed as log message
		if (typeof message === 'object') {
			if (context.error) {
				context.error = [context.error, message]
			} else {
				context.error = message
			}
			if (level === LogLevel.Debug || this.debuggingEnabled()) {
				context.stacktrace = message.stack
			}
			return this.log(level, `${message.name}: ${message.message}`, context)
		}

		this.log(level, message, context)
	}

	/**
	 * Check if debugging is enabled for the current app
	 */
	private debuggingEnabled(): boolean {
		const debugContexts = window.__NC_LOGGER_DEBUG__
		return typeof this.context.app === 'string'
			&& Array.isArray(debugContexts)
			&& debugContexts.includes(this.context.app)
	}
}
