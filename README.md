# Widget Client Library

## Installation

```bash
npm i widget-client-library
```

## Use

```javascript
import UCWClient from 'widget-client-library'
import config from './config';

const ucwClient = new UCWClient(config);

...

ucwClient.getVc(provider, connectionId, type, userId, account_id)
```
