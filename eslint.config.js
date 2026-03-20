
import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
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
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
          readonly: 'generic',
        },
      ],
      'no-duplicate-imports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@app/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@libs/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@modules/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@services/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
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
      // 'no-restricted-syntax': [
      //   'error',
      //   {
      //     selector: "JSXAttribute[name.name='style']",
      //     message:
      //       'Inline style is banned. Use Tailwind utilities or themed component APIs.',
      //   },
      //   {
      //     selector:
      //       "JSXOpeningElement[name.name=/^(Box|Stack|Grid|Container)$/] > JSXAttribute[name.name='sx']",
      //     message:
      //       'Do not use sx on layout primitives. Use className (Tailwind) for layout/spacing.',
      //   },
      //   {
      //     selector:
      //       "JSXAttribute[name.name='className'] Literal[value=/\\b(?:text|bg|border|fill|stroke)-\\[#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\]\\b/]",
      //     message:
      //       'Arbitrary hex classes are banned. Use semantic tokens (e.g. text-primary, bg-surface-card).',
      //   },
      //   {
      //     selector:
      //       "JSXAttribute[name.name='className'] TemplateElement[value.raw=/\\b(?:text|bg|border|fill|stroke)-\\[#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\]\\b/]",
      //     message: 'Arbitrary hex classes are banned. Use semantic tokens.',
      //   },
      // ],
    },
  },
])
