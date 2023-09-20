import { getCurrentUser } from '@nextcloud/auth'
import { IContext, ILogger, ILoggerFactory, LogLevel } from './contracts'

declare global {
    interface Window {
        _oc_config: {
            loglevel: LogLevel,
        },
        _oc_debug: boolean,
    }
}

/**
 * @notExported
 */
export class LoggerBuilder {

	protected context: IContext

	protected factory: ILoggerFactory

	constructor(factory: ILoggerFactory) {
		this.context = {}
		this.factory = factory
	}

	/**
	 * Set the app name within the logging context
	 *
	 * @param appId App name
	 */
	setApp(appId: string): LoggerBuilder {
		this.context.app = appId
		return this
	}

	/**
	 * Set the logging level within the logging context
	 *
	 * @param level Logging level
	 */
	setLogLevel(level: LogLevel) {
		this.context.level = level
		return this
	}

	/* eslint-disable jsdoc/no-undefined-types */
	/**
	 * Set the user id within the logging context
	 * @param uid User ID
	 * @see {@link detectUser}
	 */
	/* eslint-enable jsdoc/no-undefined-types */
	setUid(uid: string): LoggerBuilder {
		this.context.uid = uid
		return this
	}

	/**
	 * Detect the currently logged in user and set the user id within the logging context
	 */
	detectUser(): LoggerBuilder {
		const user = getCurrentUser()
		if (user !== null) {
			this.context.uid = user.uid
		}

		return this
	}

	/**
	 * Detect and use logging level configured in nextcloud config
	 */
	detectLogLevel(): LoggerBuilder {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this

		// Use arrow function to prevent undefined `this` within event handler
		const onLoaded = () => {
			if (document.readyState === 'complete' || (document.readyState === 'interactive')) {
				// Up to, including, nextcloud 24 the loglevel was not exposed
				self.context.level = window._oc_config?.loglevel ?? LogLevel.Warn
				// Override loglevel if we are in debug mode
				if (window._oc_debug) {
					self.context.level = LogLevel.Debug
				}
				document.removeEventListener('readystatechange', onLoaded)
			} else {
				document.addEventListener('readystatechange', onLoaded)
			}
		}

		onLoaded()
		return this
	}

	/** Build a logger using the logging context and factory */
	build(): ILogger {
		if (this.context.level === undefined) {
			// No logging level set manually, use the configured one
			this.detectLogLevel()
		}

		return this.factory(this.context)
	}

}
