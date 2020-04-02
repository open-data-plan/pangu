# `@opd/babel-preset-app`

> babel preset used by react app in pangu

## Usage

```js
// babel.config.js
module.exports = {
  presets: ['@opd/babel-preset-app'],
}
```

## Features

- [x] `TypeScript`
- [x] `React`(include [`react-hot-loader`](https://github.com/gaearon/react-hot-loader))
- [x] `NODE_ENV`/`BABEL_ENV` support
  - [x] `development`: used in development mode
  - [x] `test`: used in test
  - [x] `production`: used in production mode
