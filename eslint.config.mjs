import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import pluginChaiFriendly from 'eslint-plugin-chai-friendly';
import tsParser from '@typescript-eslint/parser';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [{
    ignores: ['.eslint.config.mjs'],
},
...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
),
{
    plugins: {
        '@typescript-eslint': typescriptEslintEslintPlugin,
        'chai-friendly': pluginChaiFriendly,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: 'module',

        parserOptions: {
            project: 'tsconfig.json',
            tsconfigRootDir: __dirname,
        },
    },

    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',

        //Avoid no-unused-expressions eslint error on chai asserts
        '@typescript-eslint/no-unused-expressions': 'off',
        'chai-friendly/no-unused-expressions': 'error'
    },
},
];
