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
            useBuiltIns: 'usage',
            corejs: 3,
            targets: {
              chrome: 58,
            },
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        [
          '@babel/plugin-transform-runtime',
          {
            version: require('@babel/runtime/package.json').version,
          },
        ],
      ],
      env: {
        commonjs: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                  chrome: 58,
                },
              },
            ],
            '@babel/preset-typescript',
          ],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                version: require('@babel/runtime/package.json').version,
              },
            ],
            '@babel/plugin-proposal-class-properties',
          ],
        },
        test: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: {
                  chrome: 58,
                },
              },
            ],
            '@babel/preset-typescript',
          ],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                version: require('@babel/runtime/package.json').version,
              },
            ],
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
    }
  }
)
