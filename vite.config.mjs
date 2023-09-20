import { createLibConfig } from '@nextcloud/vite-config'

export default createLibConfig({
	index: 'lib/index.ts',
}, {
	coreJS: {
		usage: true,
	},
	minify: false,
	libraryFormats: ['es', 'cjs'],
	thirdPartyLicense: false, // non included all external
})
