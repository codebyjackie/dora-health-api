import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import nodePlugin from 'eslint-plugin-node';

export default [
  {
    ignores: ['.gitignore'],
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: globals.node,
    },
    plugins: {
      prettier: prettierPlugin,
      node: nodePlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          printWidth: 80,
          trailingComma: 'none',
          endOfLine: 'auto',
        },
      ],
      'no-undef': 'error',
      'node/no-missing-require': 'off',
      'node/no-unpublished-require': 'off',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^next$' }
      ],
    },
  },
];
