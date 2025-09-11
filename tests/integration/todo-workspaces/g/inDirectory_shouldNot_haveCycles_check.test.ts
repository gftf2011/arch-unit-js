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
  ['<workspaceDir>/**'],
  ['<workspaceDir>/**/'],
  ['./packages/g/**'],
  ['./packages/g/**/'],
  [
    '<workspaceDir>/domain/**',
    '<workspaceDir>/use-cases/**',
    '<workspaceDir>/infra/**',
    '<workspaceDir>/main/**',
  ],
  [
    '<workspaceDir>/domain/**/',
    '<workspaceDir>/use-cases/**/',
    '<workspaceDir>/infra/**/',
    '<workspaceDir>/main/**/',
  ],
  [
    './packages/g/domain/**',
    './packages/g/use-cases/**',
    './packages/g/infra/**',
    './packages/g/main/**',
  ],
  [
    './packages/g/domain/**/',
    './packages/g/use-cases/**/',
    './packages/g/infra/**/',
    './packages/g/main/**/',
  ],
];

const ignoreMatchers = [
  '!<workspaceDir>/**/package.json',
  '!<workspaceDir>/**/node_modules/**',
  '!<workspaceDir>/**/package-lock.json',
  '!<workspaceDir>/**/tsconfig.json',
];

const typescriptPath = '<workspaceDir>/tsconfig.json';

describe('shouldNot.haveCycles scenarios', () => {
  test('entire project should not have cycles - should PASS', async () => {
    for (const includeMatcher of includeMatchers) {
      const options: Options = {
        workspaceDir: '<rootDir>/packages/g',
        extensionTypes: ['**/*.ts'],
        includeMatcher: [...includeMatcher],
        ignoreMatcher: ignoreMatchers,
        typescriptPath,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await appInstance.projectFiles().inDirectory('**').shouldNot().haveCycles().check();
    }
  });
});
