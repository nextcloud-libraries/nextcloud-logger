/**
 * SPDX-FileCopyrightText: 2019-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
export enum LogLevel {
	Debug = 0,
	Info = 1,
	Warn = 2,
	Error = 3,
	Fatal = 4,
}

export type IContext = Record<string, unknown>

export interface ILogger {
	debug(message: string | Error, context?: IContext): void
	info(message: string | Error, context?: IContext): void
	warn(message: string | Error, context?: IContext): void
	error(message: string | Error, context?: IContext): void
	fatal(message: string | Error, context?: IContext): void
}

export interface ILoggerFactory {
	(context?: IContext): ILogger
}
