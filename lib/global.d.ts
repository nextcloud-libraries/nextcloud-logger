/**
 * SPDX-FileCopyrightText: 2024 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: GPL-3.0-or-later or LGPL-3.0-or-later
 */

import type { LogLevel } from './contracts'

declare global {
	interface Window {
		_oc_config: {
			loglevel: LogLevel,
		},
		_oc_debug: boolean,
	}
}

export {}
