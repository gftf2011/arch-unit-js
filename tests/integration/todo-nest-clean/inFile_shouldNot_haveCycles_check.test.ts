import * as path from 'pathe';

import { ComponentSelectorBuilder } from '../../../src/fluent-api';
import { Options } from '../../../src/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-nest-clean');

const includeMatchers: string[][] = [['<rootDir>/**'], ['./**']];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/tsconfig.json',
  '!<rootDir>/**/.swcrc',
  '!<rootDir>/**/tsconfig.build.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('shouldNot.haveCycles scenarios', () => {
  test('entire project should not have cycles', async () => {
    for (const includeMatcher of includeMatchers) {
      const options: Options = {
        extensionTypes: ['**/*.ts'],
        includeMatcher: [...includeMatcher],
        ignoreMatcher: excludeMatchers,
        typescriptPath,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await appInstance.projectFiles().inFile('**/*.ts').shouldNot().haveCycles().check();
    }
  });
});
