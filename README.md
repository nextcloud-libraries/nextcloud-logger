# nextcloud-logger
Generic JavaScript logging interface for Nextcloud apps and libraries

## Usage

```js
import { getLoggerBuilder } from './index'

const logger = getLoggerBuilder()
    .setApp('mail')
    .setUid('christoph')
    .build()

logger.debug('hello')
logger.error('this should not have happened', { someContext: 13 })
logger.warn('it\'s just a warning, carry on')
```

Right now the package uses `window.console` as log appender and produces the following output

```
hello { app: 'mail', uid: 'christoph' }
this should not have happened { app: 'mail', uid: 'christoph', someContext: 13 }
it's just a warning, carry on { app: 'mail', uid: 'christoph' }
```
