import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

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

describe('shouldNot.haveCycles scenarios', () => {
  test('entire project should not have cycles - should PASS', async () => {
    for (const [includeMatcher] of includeMatchers) {
      const options: Options = {
        extensionTypes: ['**/*.js'],
        includeMatcher: [...includeMatcher],
        ignoreMatcher: excludeMatchers,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await appInstance.projectFiles().inDirectory('**').shouldNot().haveCycles().check();
    }
  });
});
