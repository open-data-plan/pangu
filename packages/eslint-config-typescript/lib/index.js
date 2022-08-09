'use strict'

let isReactExist = false

try {
  require('react')
  isReactExist = true
} catch (error) {}

const reactRules = {
  'jsx-quotes': ['error', 'prefer-double'],
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react/jsx-curly-newline': 'off',
  'react/jsx-indent': 'off',
  'react/jsx-handler-names': 'off',
}

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
  ].filter(Boolean),
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false,
  },
  plugins: [
    isReactExist && 'react',
    isReactExist && 'react-hooks',
    'prettier',
  ].filter(Boolean),
  rules: {
    'prettier/prettier': 'error',
    'standard/no-callback-literal': 'off',
    ...(isReactExist ? reactRules : {}),
  },
  settings: isReactExist
    ? {
        react: {
          version: 'detect',
        },
      }
    : {},
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
      extends: [
        'standard',
        isReactExist && 'standard-jsx',
        isReactExist && 'standard-react',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
      ].filter(Boolean),
      plugins: [
        isReactExist && 'react',
        isReactExist && 'react-hooks',
        'prettier',
        '@typescript-eslint',
      ].filter(Boolean),
      rules: {
        // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
        'default-case': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
        'no-dupe-class-members': 'off',
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
        'no-undef': 'off',

        // Add TypeScript specific rules (and turn off ESLint equivalents)
        '@typescript-eslint/consistent-type-assertions': 'warn',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'warn',
        '@typescript-eslint/no-namespace': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            functions: false,
            classes: false,
            variables: false,
            typedefs: false,
          },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'none',
            ignoreRestSiblings: true,
          },
        ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'warn',
        'prettier/prettier': 'error',
        ...(isReactExist
          ? {
              'react/prop-types': 'off',
              'react-hooks/rules-of-hooks': 'error',
              'react-hooks/exhaustive-deps': 'warn',
              'react/jsx-curly-newline': 'off',
              'react/jsx-indent': 'off',
              'react/jsx-handler-names': 'off',
            }
          : {}),
        'standard/no-callback-literal': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
