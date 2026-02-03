import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';
import reactRefresh from 'eslint-plugin-react-refresh';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const srcFiles = ['src/**/*.ts', 'src/**/*.tsx'];

export default [
  { ignores: ['dist', '**/node_modules/**', '.eslintrc.cjs', 'eslint.config.js'] },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ).map((c) => ({ ...c, files: c.files ?? srcFiles })),
  {
    files: srcFiles,
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // UI/context files often export components + helpers; allow for fast refresh
  {
    files: [
      'src/app/components/ui/**/*.tsx',
      'src/app/context/**/*.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];
