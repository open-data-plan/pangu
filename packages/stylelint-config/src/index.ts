import postcssHtml from 'postcss-html'
import { Config } from 'stylelint'

const stylelintConfig: Config = {
  extends: [require.resolve('stylelint-config-standard'), require.resolve('stylelint-prettier/recommended')],
  plugins: [require.resolve('stylelint-prettier')],
  rules: {
    'prettier/prettier': true,
    'function-name-case': null,
    'function-no-unknown': null,
    'selector-pseudo-class-no-unknown': null,
    'import-notation': null,
    'media-feature-range-notation': 'prefix',
  },
  ignoreFiles: ['**/*.(t|j)sx', '**/*.(t|j)s', '**/*.svg'],
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.vue', '**/*.html'],
      customSyntax: postcssHtml({
        less: require('postcss-less'),
        scss: require('postcss-scss'),
      }),
    },
    {
      files: ['**/*.md'],
      customSyntax: 'postcss-markdown',
    },
    // {
    //   files: ['**/*.(t|j)sx'],
    //   customSyntax: 'postcss-jsx',
    // },
    // {
    //   files: ['**/*.(t|j)s'],
    //   customSyntax: 'postcss-jsx',
    // },
  ],
}

export default stylelintConfig

module.exports = stylelintConfig
