import { ILogger } from './contracts'

export class ConsoleLogger implements ILogger {

    private context: any

    constructor(context: any) {
        this.context = context
    }

    log(level: number, message: string, context: object) {
        switch (level) {
            case 0:
                console.debug(message, context)
                break
            case 1:
                console.info(message, context)
                break
            case 2:
                console.warn(message, context)
                break
            case 3:
                console.error(message, context)
                break
            default:
                console.error(message, context)
                break
        }
    }

    debug(message: string, context?: object): void {
        this.log(0, message, Object.assign({}, this.context, context))
    }

    info(message: string, context?: object): void {
        this.log(1, message, Object.assign({}, this.context, context))
    }

    warn(message: string, context?: object): void {
        this.log(2, message, Object.assign({}, this.context, context))
    }

    error(message: string, context?: object): void {
        this.log(3, message, Object.assign({}, this.context, context))
    }

    fatal(message: string, context?: object): void {
        this.log(4, message, Object.assign({}, this.context, context))
    }

}

export function buildConsoleLogger(context: any): ILogger {
    return new ConsoleLogger(context)
}
