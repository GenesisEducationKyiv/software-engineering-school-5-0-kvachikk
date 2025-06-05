const js = require('@eslint/js');
const globals = require('globals');
const {defineConfig} = require('eslint/config');

module.exports = defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {js},
        extends: ['js/recommended'],
        rules: {
            'no-undef': 'warn',
            'no-unused-vars': 'warn',
            'no-throw-literal': 'off',
            'quotes': ['error', 'single'],
        }
    },
    {
        ignores: ['node_modules', 'dist', 'logs', '.env'],
    },
    {
        extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    }
]);
