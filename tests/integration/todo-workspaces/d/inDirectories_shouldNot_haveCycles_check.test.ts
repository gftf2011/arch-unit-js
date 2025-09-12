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

const includeMatchers: string[][] = [
  ['<workspaceDir>/**'],
  ['<workspaceDir>/**/'],
  ['./packages/d/**'],
  ['./packages/d/**/'],
  [
    '<workspaceDir>/domain/**',
    '<workspaceDir>/use-cases/**',
    '<workspaceDir>/infra/**',
    '<workspaceDir>/main/**',
    '<workspaceDir>/setup-aliases.js',
  ],
  [
    '<workspaceDir>/domain/**/',
    '<workspaceDir>/use-cases/**/',
    '<workspaceDir>/infra/**/',
    '<workspaceDir>/main/**/',
    '<workspaceDir>/setup-aliases.js',
  ],
  [
    './packages/d/domain/**',
    './packages/d/use-cases/**',
    './packages/d/infra/**',
    './packages/d/main/**',
    './packages/d/setup-aliases.js',
  ],
  [
    './packages/d/domain/**/',
    './packages/d/use-cases/**/',
    './packages/d/infra/**/',
    './packages/d/main/**/',
    './packages/d/setup-aliases.js',
  ],
];

const ignoreMatchers = [
  '!<workspaceDir>/**/package.json',
  '!<workspaceDir>/**/node_modules/**',
  '!<workspaceDir>/**/package-lock.json',
];

describe('inDirectories.shouldNot.haveCycles scenarios', () => {
  test('entire project should not have cycles - should PASS', async () => {
    for (const includeMatcher of includeMatchers) {
      const options: Options = {
        workspaceDir: '<rootDir>/packages/d',
        extensionTypes: ['**/*.js'],
        includeMatcher: [...includeMatcher],
        ignoreMatcher: ignoreMatchers,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await appInstance.projectFiles().inDirectories(['**']).shouldNot().haveCycles().check();
    }
  });
});
