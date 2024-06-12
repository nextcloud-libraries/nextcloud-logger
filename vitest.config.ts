/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import type { UserConfig } from 'vitest'
import config from './vite.config'

export default async (env) => {
	const cfg = await config(env)
	// rollup-node-externals is not compatible with vitest
	cfg.plugins = cfg.plugins!.filter((plugin) => plugin && 'name' in plugin && plugin.name !== 'node-externals')

	cfg.test = {
		environment: 'happy-dom',
		coverage: {
			include: ['lib/**'],
			reporter: ['lcov', 'text'],
		},
	} as UserConfig
	delete cfg.define

	return cfg
}
