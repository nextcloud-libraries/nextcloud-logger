import { getCurrentUser } from '@nextcloud/auth'

import { ILogger, ILoggerFactory } from './contracts'

export class LoggerBuilder {

    private context: any

    private factory: ILoggerFactory

    constructor(factory: ILoggerFactory) {
        this.context = {}
        this.factory = factory
    }

    setApp(appId: string): LoggerBuilder {
        this.context.app = appId
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
