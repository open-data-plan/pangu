'use strict'

module.exports = {
  extends: ['@opd/eslint-config-typescript'],
  overrides: [
    {
      files: '*.js?(x)',
      extends: ['@opd/eslint-config-javascript'],
    },
  ],
}
