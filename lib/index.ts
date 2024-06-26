/**
 * SPDX-FileCopyrightText: 2019-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { buildConsoleLogger } from './ConsoleLogger'
import { ILogger } from './contracts'
import { LoggerBuilder } from './LoggerBuilder'

/**
 * Build a customized logger instance
 */
export function getLoggerBuilder(): LoggerBuilder {
	return new LoggerBuilder(buildConsoleLogger)
}

/**
 * Get a default logger instance without any configuration
 */
export function getLogger(): ILogger {
	return getLoggerBuilder().build()
}

export { type LoggerBuilder }
export { LogLevel, type ILogger, type ILoggerFactory } from './contracts'
