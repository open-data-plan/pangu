# `@opd/pangu`

> pangu devtools for ui engine

## Usage

- Install

  ```bash
  npm i @opd/pangu --dev
  # help
  pangu --help
  ```

- Local Develop

  ```bash
  pangu dev
  # help
  pangu dev --help
  ```

- Build

  ```bash
  pangu build
  # help
  pangu build --help
  ```

## Custom `Webpack` Config

- Function

  ```js
  // webpack.config.js
  module.exports = function (config) {
    // update config
    return config
  }
  ```

- Object

  ```js
  // webpack.config.js
  module.exports = {
    // your config
  }
  ```

  config will be merged by [`webpack-merge`](https://github.com/survivejs/webpack-merge)

## App Config

you can use `app.json` to customize app config

```json
{
  "appName": "App Name"
}
```

### Fields

- `appName`: `document.title` and `process.env.APP_NAME`

## Theme

you can use `theme.json` to customize app theme

- Support `extends`
- Support all `Ant Design` theme variables

```json
{
  "extends": "@ant-design/dark-theme",
  "primary-color": "#1890ff"
}
```

## Environment Variables

### Build Time

- `process.env.NODE_ENV`: `development`/`production`
- `process.env.PORT`: Dev Server Port
- `process.env.HOST`: Dev Server Host

### Run Time

- `process.env.APP_NAME`: APP Name
- `process.env.APP_ENV`:
  - `development`: `0`
  - `test`: `1`
  - `preproduction`: `2`
  - `production`: `3`
- `process.env.NODE_ENV`: `development`/`production`

## Mock Server

> Based on [`json-server`](https://github.com/typicode/json-server)

you can use `mocks/db.json` to setup mock server, see [`json-server`](https://github.com/typicode/json-server) for more
