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
	const warn = jest.spyOn(console, 'warn').mockImplementation((...args) => consoleArgs.push(...args))
	logger.warn('some message', { foo: 'bar' })
	expect(warn).toHaveBeenCalledTimes(1)
	expect(consoleArgs).toHaveLength(2)
	expect(consoleArgs[1]).toHaveProperty('app', 'myapp')
})

describe('ConsoleLogger', () => {
	afterEach(() => jest.resetAllMocks())

	it('logs debug messages', () => {
		const logger = new ConsoleLogger()
		const debug = jest.spyOn(window.console, 'debug').mockImplementation(() => {})

		logger.debug('Should be logged')
		expect(debug).toHaveBeenCalledTimes(1)
		expect(debug.mock.calls[0][0]).toBe('[DEBUG] Should be logged')
	})

	it('logs info messages', () => {
		const logger = new ConsoleLogger()
		const info = jest.spyOn(window.console, 'info').mockImplementation(() => {})

		logger.info('Should be logged')
		expect(info).toHaveBeenCalledTimes(1)
		expect(info.mock.calls[0][0]).toBe('[INFO] Should be logged')
	})

	it('logs warn messages', () => {
		const logger = new ConsoleLogger()
		const warn = jest.spyOn(window.console, 'warn').mockImplementation(() => {})

		logger.warn('Should be logged')
		expect(warn).toHaveBeenCalledTimes(1)
		expect(warn.mock.calls[0][0]).toBe('[WARN] Should be logged')
	})

	it('logs error messages', () => {
		const logger = new ConsoleLogger()
		const error = jest.spyOn(window.console, 'error').mockImplementation(() => {})

		logger.error('Should be logged')
		expect(error).toHaveBeenCalledTimes(1)
		expect(error.mock.calls[0][0]).toBe('[ERROR] Should be logged')
	})

	it('logs fatal messages', () => {
		const logger = new ConsoleLogger()
		const error = jest.spyOn(window.console, 'error').mockImplementation(() => {})

		logger.fatal('Should be logged')
		expect(error).toHaveBeenCalledTimes(1)
		expect(error.mock.calls[0][0]).toBe('[FATAL] Should be logged')
	})

	it('allows global context', () => {
		const logger = new ConsoleLogger({ foo: 'bar' })
		const debug = jest.spyOn(window.console, 'debug').mockImplementation(() => {})

		logger.debug('Should be logged')
		expect(debug).toHaveBeenCalledTimes(1)
		expect(debug.mock.calls[0][0]).toBe('[DEBUG] Should be logged')
		expect(debug.mock.calls[0][1]).toEqual({ foo: 'bar' })
	})

	it('allows extending global context', () => {
		const logger = new ConsoleLogger({ one: 1, two: 2 })
		const debug = jest.spyOn(window.console, 'debug').mockImplementation(() => {})

		logger.debug('Should be logged', { two: 3 })
		expect(debug).toHaveBeenCalledTimes(1)
		expect(debug.mock.calls[0][0]).toBe('[DEBUG] Should be logged')
		expect(debug.mock.calls[0][1]).toEqual({ one: 1, two: 3 })
	})

	it('allows extending empty global context', () => {
		const logger = new ConsoleLogger()
		const debug = jest.spyOn(window.console, 'debug').mockImplementation(() => {})

		logger.debug('Should be logged', { one: 1 })
		expect(debug).toHaveBeenCalledTimes(1)
		expect(debug.mock.calls[0][0]).toBe('[DEBUG] Should be logged')
		expect(debug.mock.calls[0][1]).toEqual({ one: 1 })
	})

	it('only logs configured levels', () => {
		const logger = new ConsoleLogger({ level: 2 })

		const debug = jest.spyOn(window.console, 'debug')

		logger.debug('Should not be logged')
		expect(debug).toHaveBeenCalledTimes(0)
	})

	it('logs Error objects', () => {
		const error = new MyError('some message')
		const logger = new ConsoleLogger({})

		const console = [] as [string, unknown][]
		const warn = jest.spyOn(window.console, 'warn').mockImplementation((msg, ctx) => console.push([msg, ctx]))

		logger.warn(error)
		expect(warn).toHaveBeenCalledTimes(1)
		expect(console[0][0]).toContain('MyError')
		expect(console[0][0]).toContain('some message')
		expect(console[0][0]).not.toContain('Stack trace')
		expect(console[0][1]).toHaveProperty('error', error)
	})

	it('logs Error objects and stack trace on debug', () => {
		const error = new MyError('some message')
		const logger = new ConsoleLogger({})

		const console = [] as [string, unknown][]
		const debug = jest.spyOn(window.console, 'debug').mockImplementation((msg, ctx) => console.push([msg, ctx]))

		logger.debug(error)
		expect(debug).toHaveBeenCalledTimes(1)
		expect(console[0][0]).toContain('MyError')
		expect(console[0][0]).toContain('some message')
		expect(console[0][0]).toContain('Stack trace:')
	})

	it('logs Error objects and does not override context', () => {
		const error = new MyError('some message')
		const logger = new ConsoleLogger({ error: 'none' })

		const console = [] as [string, unknown][]
		const warn = jest.spyOn(window.console, 'warn').mockImplementation((msg, ctx) => console.push([msg, ctx]))

		logger.warn(error)
		expect(warn).toHaveBeenCalledTimes(1)
		expect(console[0][0]).toContain('MyError')
		expect(console[0][0]).toContain('some message')
		expect(console[0][1]).toHaveProperty('error', 'none')
	})
})
