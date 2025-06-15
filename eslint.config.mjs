// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tslint from 'typescript-eslint';

export default tslint.config(
   {
      ignores: ['dist', 'node_modules', 'logs', '.env', 'eslint.config.mjs'],
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
      rules: {

         '@typescript-eslint/no-floating-promises': 'error',
         '@typescript-eslint/no-unsafe-argument': 'warn',
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
         '@typescript-eslint/no-explicit-any': 'off',
      },
   },

   eslintPluginPrettierRecommended,
);