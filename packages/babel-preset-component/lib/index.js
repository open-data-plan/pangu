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
        '@babel/preset-react',
      ],
      plugins: [
        [
          'import',
          {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,
          },
          'antd',
        ],
        [
          'import',
          {
            libraryName: 'antd-mobile',
            libraryDirectory: 'es',
            style: true,
          },
          'antd-mobile',
        ],
        [
          '@babel/plugin-transform-runtime',
          {
            version: require('@babel/runtime/package.json').version,
          },
        ],
        '@babel/plugin-proposal-class-properties',
      ],
      env: {
        test: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-typescript',
            '@babel/preset-react',
          ],
          plugins: [
            ['import', false, 'antd'],
            ['import', false, 'antd-mobile'],
            [
              '@babel/plugin-transform-runtime',
              {
                version: require('@babel/runtime/package.json').version,
              },
            ],
            '@babel/plugin-proposal-class-properties',
          ],
        },
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
            '@babel/preset-react',
          ],
          plugins: [
            [
              'import',
              {
                libraryName: 'antd',
                libraryDirectory: 'lib',
                style: true,
              },
              'antd',
            ],
            [
              'import',
              {
                libraryName: 'antd-mobile',
                libraryDirectory: 'lib',
                style: true,
              },
              'antd-mobile',
            ],
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
