/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import { createLibConfig } from '@nextcloud/vite-config'

export default createLibConfig({
	index: 'lib/index.ts',
}, {
	minify: false,
	libraryFormats: ['es', 'cjs'],
	thirdPartyLicense: false, // non included all external
})
