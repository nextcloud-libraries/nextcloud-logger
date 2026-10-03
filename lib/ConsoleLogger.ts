/**
 * SPDX-FileCopyrightText: 2019-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { IContext, ILogger } from './contracts.ts'

import { ALogger } from './ALogger.ts'
import { LogLevel } from './contracts.ts'

/* eslint-disable no-console -- This class is a console logger so it needs to write to the console. */
export class ConsoleLogger extends ALogger implements ILogger {
	protected context: IContext

	constructor(context?: IContext) {
		super()
		this.context = context || {}
	}

	protected log(level: LogLevel, message: string | Error, context: IContext) {
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

	private formatMessage(message: string | Error, level: LogLevel, context?: IContext): string {
		let msg = '[' + LogLevel[level].toUpperCase() + '] '

		if (context && context.app) {
			msg += context.app + ': '
		}

		if (typeof message === 'string') {
			return msg + message
		}

		// basic error formatting
		msg += `Unexpected ${message.name}`
		if (message.message) {
			msg += ` "${message.message}"`
		}
		// only add stack trace when debugging
		if (level === LogLevel.Debug && message.stack) {
			msg += `\n\nStack trace:\n${message.stack}`
		}

		return msg
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
