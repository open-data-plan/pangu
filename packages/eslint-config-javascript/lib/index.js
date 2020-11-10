'use strict'

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'standard',
    'standard-jsx',
    'standard-react',
    'plugin:prettier/recommended',
  ],
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
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    'standard/no-callback-literal': 'off',
    'prettier/prettier': 'error',
    'jsx-quotes': ['error', 'prefer-double'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-curly-newline': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-handler-names': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
