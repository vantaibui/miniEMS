
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.pnpm']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
          readonly: 'generic',
        },
      ],
      // Enforce module boundaries: modules cannot import each other directly,
      // only the shell (src/app) can depend on multiple modules.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@modules/auth/*'],
              message: 'Please use the public API of @modules/auth instead of deep imports.',
            },
            {
              group: ['@modules/users/*'],
              message: 'Please use the public API of @modules/users instead of deep imports.',
            },
            {
              group: ['@modules/roles/*'],
              message: 'Please use the public API of @modules/roles instead of deep imports.',
            },
            {
              group: ['@modules/device/*'],
              message: 'Please use the public API of @modules/device instead of deep imports.',
            },
            {
              group: ['@modules/dashboard/*'],
              message: 'Please use the public API of @modules/dashboard instead of deep imports.',
            },
          ],
        },
      ],
    },
  },
])
