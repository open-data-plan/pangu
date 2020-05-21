'use strict'

const { declare } = require('@babel/helper-plugin-utils')

module.exports = declare(
  (
    api,
    { jsxPragma, allExtensions = false, isTSX = false, allowNamespaces }
  ) => {
    api.assertVersion(7)

    return {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: 'last 2 versions, IE >= 11',
            },
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: ['@babel/plugin-proposal-class-properties'],
      env: {
        commonjs: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: 'last 2 versions, IE >= 11',
                },
              },
            ],
            '@babel/preset-typescript',
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
        test: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: 'last 2 versions, IE >= 11',
                },
              },
            ],
            '@babel/preset-typescript',
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
    }
  }
)
