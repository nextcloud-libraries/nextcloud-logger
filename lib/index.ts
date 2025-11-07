/**
 * SPDX-FileCopyrightText: 2019-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ILogger } from './contracts.ts'

import { buildConsoleLogger } from './ConsoleLogger.ts'
import { LoggerBuilder } from './LoggerBuilder.ts'

export type { LoggerBuilder }
export type { ILogger, ILoggerFactory } from './contracts.ts'

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

export { LogLevel } from './contracts.ts'
