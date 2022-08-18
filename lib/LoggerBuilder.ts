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

    setApp(appId: string): LoggerBuilder {
        this.context.app = appId
        return this
    }

    setLogLevel(level: LogLevel) {
        this.context.level = level
        return this
    }

    setUid(uid: string): LoggerBuilder {
        this.context.uid = uid
        return this
    }

    detectUser(): LoggerBuilder {
        const user = getCurrentUser()
        if (user !== null) {
            this.context.uid = user.uid
        }

        return this
    }

    build(): ILogger {
        return this.factory(this.context)
    }

}
