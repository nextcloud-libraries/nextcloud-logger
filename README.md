# @nextcloud/logger

Generic JavaScript logging interface for Nextcloud apps and libraries

## Usage

```js
import { getLoggerBuilder } from '@nextcloud/logger'

const logger = getLoggerBuilder()
    .setApp('mail')
    .detectUser()
    .build()

logger.debug('hello')
logger.error('this should not have happened', { someContext: 13 })
logger.warn('it\'s just a warning, carry on')
```

Right now the package uses `window.console` as log appender and produces the following output

```
[DEBUG] mail: hello { app: 'mail', uid: 'christoph' }
[ERROR] mail: this should not have happened { app: 'mail', uid: 'christoph', someContext: 13 }
[WARN] mail: it's just a warning, carry on { app: 'mail', uid: 'christoph' }
```
