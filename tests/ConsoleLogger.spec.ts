import { ConsoleLogger, buildConsoleLogger } from '../lib/ConsoleLogger'

// Dummy Error
class MyError extends Error {
    constructor(msg: string) {
        super(msg)
        this.name = 'MyError'
    }
}

afterEach(() => {
    jest.resetAllMocks()
})

test('building the console logger', () => {
    const logger = buildConsoleLogger({ app: 'myapp' })
    expect(logger).toBeInstanceOf(ConsoleLogger)

    // ensure initial context is preserved
    const consoleArgs = [] as any[]
    const warn = jest.spyOn(console, "warn").mockImplementation((...args) => consoleArgs.push(...args))
    logger.warn('some message', { foo: 'bar' })
    expect(warn).toHaveBeenCalledTimes(1)
    expect(consoleArgs).toHaveLength(2)
    expect(consoleArgs[1]).toHaveProperty('app', 'myapp')
})

describe('ConsoleLogger', () => {
    afterEach(() => jest.resetAllMocks())

    it('logs errors', () => {
        const error = new MyError('some message')
        const logger = new ConsoleLogger({})

        const console = [] as any[][]
        const warn = jest.spyOn(window.console, "warn").mockImplementation((msg, ctx) => console.push([msg, ctx]))

        logger.warn(error)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(console[0][0]).toContain('MyError')
        expect(console[0][0]).toContain('some message')
        expect(console[0][0]).not.toContain('Stack trace')
        expect(console[0][1]).toHaveProperty('error', error)
    })

    it('logs error and stack trace on debug', () => {
        const error = new MyError('some message')
        const logger = new ConsoleLogger({})

        const console = [] as any[][]
        const debug = jest.spyOn(window.console, "debug").mockImplementation((msg, ctx) => console.push([msg, ctx]))

        logger.debug(error)
        expect(debug).toHaveBeenCalledTimes(1)
        expect(console[0][0]).toContain('MyError')
        expect(console[0][0]).toContain('some message')
        expect(console[0][0]).toContain('Stack trace:')
    })

    it('logs error and does not override context', () => {
        const error = new MyError('some message')
        const logger = new ConsoleLogger({ error: 'none' })

        const console = [] as any[][]
        const warn = jest.spyOn(window.console, "warn").mockImplementation((msg, ctx) => console.push([msg, ctx]))

        logger.warn(error)
        expect(warn).toHaveBeenCalledTimes(1)
        expect(console[0][0]).toContain('MyError')
        expect(console[0][0]).toContain('some message')
        expect(console[0][1]).toHaveProperty('error', 'none')
    })
})