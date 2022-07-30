/// <reference types="@nextcloud/typings" />

import { getCurrentUser } from '@nextcloud/auth'
import { ILogger, ILoggerFactory, LogLevel } from './contracts'

declare var OC: Nextcloud.v22.OC | Nextcloud.v23.OC | Nextcloud.v24.OC;

export class LoggerBuilder {

    private context: any

    private factory: ILoggerFactory

    constructor(factory: ILoggerFactory) {
        this.context = {}
        this.factory = factory
        // Up to, including, nextcloud 24 the loglevel was not exposed
        this.context.level = (window.hasOwnProperty('OC') && OC?.config?.loglevel !== undefined) ? OC.config.loglevel : LogLevel.Warn
        // Override loglevel if we are in debug mode
        if (window.hasOwnProperty('OC') && OC?.debug) {
            this.context.level = LogLevel.Debug
        }
    }

    /** Set the app name within the logging context */
    setApp(appId: string): LoggerBuilder {
        this.context.app = appId
        return this
    }

    /** Set the logging level within the logging context */
    setLogLevel(level: LogLevel) {
        this.context.level = level
        return this
    }

    /** Set the user id within the logging context
     * @see {@link detectUser}
    */
    setUid(uid: string): LoggerBuilder {
        this.context.uid = uid
        return this
    }

    /** Detect the currently logged in user and set the user id within the logging context */
    detectUser(): LoggerBuilder {
        const user = getCurrentUser()
        if (user !== null) {
            this.context.uid = user.uid
        }

        return this
    }

    /** Build a logger using the logging context and factory */
    build(): ILogger {
        return this.factory(this.context)
    }

}
