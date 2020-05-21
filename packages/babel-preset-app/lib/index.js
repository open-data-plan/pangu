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
            modules: false, // close this to make tree-shaking work
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
      env: {
        development: {
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
            '@babel/plugin-proposal-class-properties',
            'react-hot-loader/babel',
          ],
        },
        test: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
              },
            ],
            '@babel/preset-typescript',
            '@babel/preset-react',
          ],
          plugins: [
            ['import', false, 'antd'],
            ['import', false, 'antd-mobile'],
            '@babel/plugin-proposal-class-properties',
          ],
        },
        production: {
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
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
    }
  }
)
