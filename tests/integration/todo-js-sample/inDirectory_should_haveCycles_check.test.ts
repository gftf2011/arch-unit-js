import * as path from 'pathe';

import { ComponentSelectorBuilder } from '../../../src/fluent-api';
import { Options } from '../../../src/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample');

const includeMatchers = [
  [['<rootDir>/**']],
  [['<rootDir>/**/']],
  [['./**']],
  [['./**/']],
  [['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**', '<rootDir>/main/**']],
  [
    [
      '<rootDir>/domain/**/',
      '<rootDir>/use-cases/**/',
      '<rootDir>/infra/**/',
      '<rootDir>/main/**/',
    ],
  ],
  [['./domain/**', './use-cases/**', './infra/**', './main/**']],
  [['./domain/**/', './use-cases/**/', './infra/**/', './main/**/']],
];

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('should.haveCycles scenarios', () => {
  test('entire project should have cycles - DO I REALLY NEED TO EXPLAIN THIS ?', async () => {
    for (const [includeMatcher] of includeMatchers) {
      try {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance.projectFiles().inDirectory('**').should().haveCycles().check();

        expect(1).toBe(2);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toBe(
          "Violation - Rule: project files in directory '**' should have cycles\n\nIF YOU SEE THIS, YOU MUST BE A UTTERLY STUPID PERSON",
        );
      }
    }
  });
});
