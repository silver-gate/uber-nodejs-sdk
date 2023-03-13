# uber-nodejs-sdk

## GetStarted

```bash
npm i --save uber-nodejs-sdk
```

```js
const Uber = require('uber-nodejs-sdk');

const uber = new Uber({
  clientId,
  clientSecret,
  customerId,
  debug: true,
});

// Bearer token will be generated when calling the apis.
```

## Documentations

- [API Docs](https://developer.uber.com/docs/deliveries/direct/guides/getting-started)
- [Backoffice](https://direct.uber.com/)
