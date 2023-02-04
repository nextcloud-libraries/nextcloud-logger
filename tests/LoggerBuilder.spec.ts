import { LogLevel } from '../lib/contracts'
import { getLoggerBuilder, MockedLogger } from './mocks'


describe('detect logging level', () => {
    let state = window.document.readyState

    /** Set document ready state and emit events */
    const setReadyState = (newState: typeof state) => {
        state = newState
        if (state === 'complete') global.window.dispatchEvent(new Event('load'))
        global.window.document.dispatchEvent(new Event('readystatechange'))
    }
    
    beforeAll(() => {
        state = global.window.document.readyState
        
        Object.defineProperty(global.window.document, "readyState", {
            get() { return state }
        })
    })

    describe('without `OC.config.loglevel` (<=NC24)', () => {
        afterEach(() => {
            // @ts-expect-error
            delete window.OC
        })
        it ('without `OC.debug`', async () => {
            setReadyState('loading')
            const builder = getLoggerBuilder()
            builder.detectLogLevel()

            // Still loading so no level set
            expect('level' in builder.getContext()).toBe(false)

            // Trigger document loaded
            setReadyState('complete')
            await new Promise(process.nextTick);

            // Level should now be set
            expect('level' in builder.getContext()).toBe(true)

            // Should default to warn as NC24 has no `OC.config.loglevel`
            expect(builder.getContext().level).toBe(LogLevel.Warn)
        })

        it ('with `OC.debug`', async () => {
            setReadyState('loading')
            const builder = getLoggerBuilder()
            builder.detectLogLevel()

            // Still loading so no level set
            expect('level' in builder.getContext()).toBe(false)

            // Mock OC and trigger document loaded
            // @ts-ignore
            window.OC = { debug: true }
            setReadyState('complete')
            await new Promise(process.nextTick);

            // Level should now be set
            expect('level' in builder.getContext()).toBe(true)

            // Should default to warn as NC24 has no `OC.config.loglevel`
            expect(builder.getContext().level).toBe(LogLevel.Debug)
        })
    })

    /* Since NC25 configuring the loglevel is possible */
    describe('with `OC.config.loglevel`', () => {
        beforeAll(() => {
            // @ts-ignore
            window.OC = {
                config: {
                    loglevel: LogLevel.Info,
                },
                debug: false,
            }
        })
        afterAll(() => {
            // @ts-expect-error
            delete window.OC
        })

        it ('already loaded', async () => {
            setReadyState('complete')
            const builder = getLoggerBuilder()
            builder.detectLogLevel()

            expect('level' in builder.getContext()).toBe(true)
            expect(builder.getContext().level).toBe(window.OC.config.loglevel)
        })

        it ('stil loading', async () => {
            setReadyState('loading');
            const builder = getLoggerBuilder()
            builder.detectLogLevel()
            const logger = builder.build() as MockedLogger

            // Still loading so no level set
            expect('level' in builder.getContext()).toBe(false)
            expect('level' in logger.context).toBe(false)

            // Trigger document loaded
            setReadyState('complete')
            await new Promise(process.nextTick);

            // Level should now be set to configured one, also in logger
            expect('level' in builder.getContext()).toBe(true)
            expect('level' in logger.context).toBe(true)
            expect(builder.getContext().level).toBe(window.OC.config.loglevel)
            expect(logger.context.level).toBe(window.OC.config.loglevel)
        })

        it ('with `OC.debug` override', async () => {
            setReadyState('loading');
            const builder = getLoggerBuilder()
            builder.detectLogLevel()

            // Still loading so no level set
            expect('level' in builder.getContext()).toBe(false)

            // Trigger document loaded
            window.OC.debug = true
            setReadyState('complete')
            await new Promise(process.nextTick);

            // Level should now be set to configured one
            expect('level' in builder.getContext()).toBe(true)
            expect(builder.getContext().level).toBe(LogLevel.Debug)
        })

        it ('with `OC.debug` override on HTML interactive phase', async () => {
            setReadyState('loading');
            const builder = getLoggerBuilder()
            builder.detectLogLevel()

            // Still loading so no level set
            expect('level' in builder.getContext()).toBe(false)

            // Trigger document loaded
            window.OC.debug = true
            setReadyState('interactive')
            await new Promise(process.nextTick);

            // Level should now be set to configured one
            expect('level' in builder.getContext()).toBe(true)
            expect(builder.getContext().level).toBe(LogLevel.Debug)
        })
    })
})

test('setApp()', () => {
    const builder = getLoggerBuilder()
    builder.setApp('myapp')
    expect(builder.getContext()).toHaveProperty('app', 'myapp')
})

test('setLogLevel()', () => {
    const builder = getLoggerBuilder()
    expect(builder.getContext()).not.toHaveProperty('level')
    builder.setLogLevel(LogLevel.Warn)
    expect(builder.getContext()).toHaveProperty('level', LogLevel.Warn)
})

test('setUid()', () => {
    const builder = getLoggerBuilder()
    expect(builder.getContext()).not.toHaveProperty('uid')
    builder.setUid('myUser')
    expect(builder.getContext()).toHaveProperty('uid', 'myUser')
})

describe('detectUser()', () => {
    it('without user', () => {
        const builder = getLoggerBuilder()
        builder.detectUser()
        expect(builder.getContext()).not.toHaveProperty('uid')
    })

    it('with user', async () => {
        // @nextcloud/auth caches the current user so we have to reset the modules and set the user before importing it
        jest.resetModules()
        document.head.setAttribute('data-user', 'myUser')

        const { getLoggerBuilder } = await import('./mocks')
        const builder = getLoggerBuilder()

        builder.detectUser()
        expect(builder.getContext()).toHaveProperty('uid', 'myUser')
    })
})

test('build()', () => {
    const builder = getLoggerBuilder()
    const logger = builder.setApp('myApp')
        .setUid('myUser')
        .setLogLevel(LogLevel.Debug)
        .build() as MockedLogger

    expect(logger).toBeInstanceOf(MockedLogger)
    expect(logger.context).toHaveProperty('app', 'myApp')
    expect(logger.context).toHaveProperty('uid', 'myUser')
    expect(logger.context).toHaveProperty('level', LogLevel.Debug)
})
