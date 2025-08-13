import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-nest-clean');

const includeMatchers: string[][] = [['<rootDir>/**'], ['./**']];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/tsconfig.json',
  '!<rootDir>/**/.swcrc',
  '!<rootDir>/**/tsconfig.build.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('should.haveCycles scenarios', () => {
  test('entire project should have cycles - DO I REALLY NEED TO EXPLAIN THIS ?', async () => {
    for (const includeMatcher of includeMatchers) {
      try {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance.projectFiles().inFile('**/*.ts').should().haveCycles().check();

        expect(1).toBe(2);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toBe(
          "Violation - Rule: project files in file '**/*.ts' should have cycles\n\nIF YOU SEE THIS, YOU MUST BE A UTTERLY STUPID PERSON",
        );
      }
    }
  });
});
