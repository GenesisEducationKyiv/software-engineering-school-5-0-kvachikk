const js = require('@eslint/js')
const globals = require('globals')
const { defineConfig } = require('eslint/config')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = defineConfig({
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
        sourceType: 'commonjs',
        globals: {
            ...globals.browser,
            ...globals.node,
        },
    },
    extends: [js.configs.recommended, eslintPluginPrettierRecommended],
    rules: {
        'no-undef': 'warn',
        'no-unused-vars': 'warn',
        'no-throw-literal': 'off',
        quotes: ['error', 'single'],
    },
    ignores: ['node_modules', 'dist', 'logs', '.env'],
})
