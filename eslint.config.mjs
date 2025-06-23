// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tslint from 'typescript-eslint';

export default tslint.config(
   {
      ignores: ['dist', 'node_modules', 'logs', 'eslint.config.mjs'],
   },
   eslint.configs.recommended,
   {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [...tslint.configs.recommendedTypeChecked],
      languageOptions: {
         parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname,
         },
      },
      plugins: {
         import: importPlugin,
      },
      rules: {
         '@typescript-eslint/no-floating-promises': 'error',
         '@typescript-eslint/no-unsafe-argument': 'error',
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

   {
      languageOptions: {
         globals: {
            ...globals.node,
            ...globals.jest,
         },
      },
      rules: {
         '@typescript-eslint/no-explicit-any': 'error',
         'max-len': ['off'],
      },
   },

   eslintPluginPrettierRecommended,
);
