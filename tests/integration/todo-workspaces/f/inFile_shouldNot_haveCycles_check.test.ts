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

const includeMatchers: string[][] = [['<workspaceDir>/**'], ['./packages/f/**']];

const ignoreMatchers = [
  '!<workspaceDir>/**/package.json',
  '!<workspaceDir>/**/node_modules/**',
  '!<workspaceDir>/**/package-lock.json',
  '!<workspaceDir>/**/tsconfig.json',
  '!<workspaceDir>/**/.swcrc',
  '!<workspaceDir>/**/tsconfig.build.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('inFile.shouldNot.haveCycles scenarios', () => {
  test('entire project should not have cycles', async () => {
    for (const includeMatcher of includeMatchers) {
      const options: Options = {
        workspaceDir: '<rootDir>/packages/f',
        extensionTypes: ['**/*.ts'],
        includeMatcher: [...includeMatcher],
        ignoreMatcher: ignoreMatchers,
        typescriptPath,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await appInstance.projectFiles().inFile('**/*.ts').shouldNot().haveCycles().check();
    }
  });
});
