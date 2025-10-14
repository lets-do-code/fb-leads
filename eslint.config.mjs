import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(tseslint.configs.strict, tseslint.configs.stylistic, {
  rules: {
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    'no-console': ['warn']
  },
  ignores: ['dist', 'node_modules', '.turbo', 'tsconfig.json', 'eslint.config.mjs', 'package.json']
});
