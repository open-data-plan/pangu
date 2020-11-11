'use strict'

let isReactExist = false

try {
  require('react')
  isReactExist = true
} catch (error) {}

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'standard',
    isReactExist && 'standard-jsx',
    isReactExist && 'standard-react',
    'plugin:prettier/recommended',
    isReactExist && 'prettier/react',
  ].filter(Boolean),
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    isReactExist && 'react',
    isReactExist && 'react-hooks',
    'prettier',
  ].filter(Boolean),
  rules: {
    'standard/no-callback-literal': 'off',
    'prettier/prettier': 'error',
    ...(isReactExist
      ? {
          'jsx-quotes': ['error', 'prefer-double'],
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',
          'react/jsx-curly-newline': 'off',
          'react/jsx-indent': 'off',
          'react/jsx-handler-names': 'off',
        }
      : {}),
  },
  settings: isReactExist
    ? {
        react: {
          version: 'detect',
        },
      }
    : {},
}
