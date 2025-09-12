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

const includeMatchers = ['<workspaceDir>/**'];

const ignoreMatchers = [
  '!<workspaceDir>/**/package.json',
  '!<workspaceDir>/**/node_modules/**',
  '!<workspaceDir>/**/package-lock.json',
];

describe('shouldNot.haveCycles scenarios', () => {
  it('should throw error if there is a cycle', async () => {
    const options: Options = {
      workspaceDir: '<rootDir>/packages/e',
      extensionTypes: ['**/*.js'],
      includeMatcher: [...includeMatchers],
      ignoreMatcher: ignoreMatchers,
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
