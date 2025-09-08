import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  '..',
  'sample',
  'todo-workspaces',
);

const includeMatchers = [
  ['<rootDir>/packages/b/**'],
  ['<rootDir>/packages/b/**/'],
  ['./packages/b/**'],
  ['./packages/b/**/'],
  [
    '<rootDir>/packages/b/domain/**',
    '<rootDir>/packages/b/use-cases/**',
    '<rootDir>/packages/b/infra/**',
    '<rootDir>/packages/b/main/**',
  ],
  [
    '<rootDir>/packages/b/domain/**/',
    '<rootDir>/packages/b/use-cases/**/',
    '<rootDir>/packages/b/infra/**/',
    '<rootDir>/packages/b/main/**/',
  ],
  [
    './packages/b/domain/**',
    './packages/b/use-cases/**',
    './packages/b/infra/**',
    './packages/b/main/**',
  ],
  [
    './packages/b/domain/**/',
    './packages/b/use-cases/**/',
    './packages/b/infra/**/',
    './packages/b/main/**/',
  ],
];

const ignoreMatchers = [
  '!<rootDir>/packages/b/**/package.json',
  '!<rootDir>/packages/b/**/node_modules/**',
  '!<rootDir>/packages/b/**/package-lock.json',
];

describe('shouldNot.haveCycles scenarios', () => {
  test('entire project should not have cycles - should PASS', async () => {
    for (const includeMatcher of includeMatchers) {
      const options: Options = {
        workspaceDir: './packages/b',
        extensionTypes: ['**/*.js'],
        includeMatcher: [...includeMatcher],
        ignoreMatcher: ignoreMatchers,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await appInstance.projectFiles().inDirectory('**').shouldNot().haveCycles().check();
    }
  });
});
