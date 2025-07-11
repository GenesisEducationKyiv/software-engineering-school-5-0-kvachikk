// @ts-check
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
   js.configs.recommended,
   {
      ignores: ['dist', 'node_modules', 'logs', 'eslint.config.mjs'],
   },
   {
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
         parser: tsParser,
         parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: import.meta.dirname,
         },
         globals: {
            ...globals.node,
            ...globals.jest,
         },
      },
      plugins: {
         '@typescript-eslint': tseslint,
         import: importPlugin,
      },
      rules: {
         '@typescript-eslint/no-floating-promises': 'error',
         '@typescript-eslint/no-unsafe-argument': 'error',
         '@typescript-eslint/no-explicit-any': 'warn',
         '@typescript-eslint/no-misused-promises': 'warn',
         '@typescript-eslint/no-unsafe-assignment': 'warn',
         '@typescript-eslint/no-deprecated': 'error',
         '@typescript-eslint/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],

         'import/order': [
            'error',
            {
               groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
               'newlines-between': 'always',
               alphabetize: {
                  order: 'asc',
                  caseInsensitive: true,
               },
            },
         ],
         'import/no-unresolved': 'error',
         'import/no-unused-modules': 'warn',
         'import/no-duplicates': 'error',
         'max-len': 'off',
         'no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
      },
      settings: {
         'import/resolver': {
            typescript: {
               alwaysTryTypes: true,
               project: './tsconfig.json',
            },
         },
      },
   },
   eslintPluginPrettierRecommended,
];