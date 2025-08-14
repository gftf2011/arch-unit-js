import { spawn } from 'child_process';
import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-sample-with-module-aliases',
);

const includeMatchers: string[][] = [
  ['<rootDir>/**'],
  ['<rootDir>/**/'],
  ['./**'],
  ['./**/'],
  [
    '<rootDir>/domain/**',
    '<rootDir>/use-cases/**',
    '<rootDir>/infra/**',
    '<rootDir>/main/**',
    '<rootDir>/setup-aliases.js',
  ],
  [
    '<rootDir>/domain/**/',
    '<rootDir>/use-cases/**/',
    '<rootDir>/infra/**/',
    '<rootDir>/main/**/',
    '<rootDir>/setup-aliases.js',
  ],
  ['./domain/**', './use-cases/**', './infra/**', './main/**', './setup-aliases.js'],
  ['./domain/**/', './use-cases/**/', './infra/**/', './main/**/', './setup-aliases.js'],
];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
];

describe('inDirectories.shouldNot.haveCycles scenarios', () => {
  beforeAll(async () => {
    const runAliases = async () =>
      new Promise((resolve, reject) => {
        const child = spawn('node', [path.resolve(rootDir, 'setup-aliases.js')], {
          stdio: 'inherit',
        });
        child.on('close', (code) =>
          code === 0 ? resolve(true) : reject(new Error(`code ${code}`)),
        );
        child.on('error', (err) => reject(err));
      });
    await runAliases();
  });

  test('entire project should not have cycles - should PASS', async () => {
    for (const includeMatcher of includeMatchers) {
      const options: Options = {
        extensionTypes: ['**/*.js'],
        includeMatcher: [...includeMatcher],
        ignoreMatcher: excludeMatchers,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await appInstance.projectFiles().inDirectories(['**']).shouldNot().haveCycles().check();
    }
  });
});
