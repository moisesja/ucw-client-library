# Widget Client Library

At the moment this NPM module has not been deployed to the NPM registry. You must leverage npm link to access it as a local NPM package.

## Installation

Navigate to the root folder of this UCW-CLIENT-LIBRARY repo and run:

```bash
npm link
```

Navigate to your app's folder (where your package.json resides) and run

```bash
npm link widget-client-library && npm i widget-client-library --save
```

## Use

```javascript
import { UCWClient, Config } from "widget-client-library";

const config: Config = {
      LogLevel: "debug",
      Component: "uvcs-demo",
      Env: "pre", // mocked
      ...

const ucwClient = new UCWClient(config);
...

ucwClient.getVc(provider, connectionId, type, userId, account_id)
```
