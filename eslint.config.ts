import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginVitest from '@vitest/eslint-plugin';
import pluginPlaywright from 'eslint-plugin-playwright';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import path from 'node:path';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    rules: {
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-use-before-define': ['error', { functions: false }],
      'no-param-reassign': 'off',
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    },
    languageOptions: {
      ecmaVersion: 'latest',
    },
    settings: {
      'import/resolver': {
        node: {},
        'custom-alias': {
          alias: {
            '@': path.resolve(__dirname, 'src'),
          },
          extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.ts', '.tsx', '.mts'],
        },
      },
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  skipFormatting,
);
