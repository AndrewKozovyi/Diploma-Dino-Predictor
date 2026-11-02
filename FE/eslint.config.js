// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier/flat');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

const forbidImports = (files, layers) => ({
  files,
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: layers.map((layer) => ({
          group: [`**/${layer}/**`],
          message: `Dependencies go features -> domain -> shared -> core, this layer must not import ${layer}.`,
        })),
      },
    ],
  },
});

module.exports = tseslint.config(
  {
    ignores: ['dist/', '.angular/', 'coverage/'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  forbidImports(['src/app/core/**/*.ts'], ['shared', 'domain', 'features', 'layout']),
  forbidImports(['src/app/shared/**/*.ts'], ['domain', 'features', 'layout']),
  forbidImports(['src/app/domain/**/*.ts'], ['features', 'layout']),
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
  prettier,
);
