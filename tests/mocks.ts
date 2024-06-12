/**
 * SPDX-FileCopyrightText: 2023-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILogger, ILoggerFactory, LogLevel } from '../lib'
import { LoggerBuilder } from '../lib/LoggerBuilder'

export class MockedLoggerBuilder extends LoggerBuilder {

	getContext() {
		return this.context
	}

}

export class MockedLogger implements ILogger {

	public messages: {level: LogLevel, message: string, context: any}[]
	public context: any

	constructor(context: any) {
		this.context = context
		this.messages = []
	}

	debug(message: string, context?: object | undefined): void {
		this.messages.push({ level: LogLevel.Debug, message, context: Object.assign({}, this.context, context) })
	}

	info(message: string, context?: object | undefined): void {
		this.messages.push({ level: LogLevel.Info, message, context: Object.assign({}, this.context, context) })
	}

	warn(message: string, context?: object | undefined): void {
		this.messages.push({ level: LogLevel.Warn, message, context: Object.assign({}, this.context, context) })
	}

	error(message: string, context?: object | undefined): void {
		this.messages.push({ level: LogLevel.Error, message, context: Object.assign({}, this.context, context) })
	}

	fatal(message: string, context?: object | undefined): void {
		this.messages.push({ level: LogLevel.Fatal, message, context: Object.assign({}, this.context, context) })
	}

}

export const mockedFactory: ILoggerFactory = (context: any) => new MockedLogger(context)

export const getLoggerBuilder = () => new MockedLoggerBuilder(mockedFactory)
export const getLogger = () => getLoggerBuilder().build()
