import * as path from 'pathe';

import { ComponentSelectorBuilder } from '../../../src/fluent-api';
import { Options } from '../../../src/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-sample-with-self-import',
);

const includeMatchers = ['<rootDir>/**'];

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('shouldNot.haveCycles scenarios', () => {
  it('should throw error if there is a cycle', async () => {
    const options: Options = {
      extensionTypes: ['**/*.js'],
      includeMatcher: [...includeMatchers],
      ignoreMatcher: excludeMatchers,
    };
    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    try {
      await appInstance.projectFiles().inDirectory('**').shouldNot().haveCycles().check();
      // If we get here, the test should fail
      expect(1).toBe(2);
    } catch (error) {
      const errorMessage = (error as Error).message;

      expect(errorMessage).toContain(
        `Violation - Rule: project files in directory '**' should not have cycles`,
      );
    }
  });
});
