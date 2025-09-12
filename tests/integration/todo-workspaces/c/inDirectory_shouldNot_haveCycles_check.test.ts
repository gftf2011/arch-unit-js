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

const workspaceDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  '..',
  'sample',
  'todo-workspaces',
  'packages',
  'c',
);

const includeMatchers = ['<rootDir>/packages/c/**'];

const ignoreMatchers = [
  '!<rootDir>/packages/c/**/package.json',
  '!<rootDir>/packages/c/**/node_modules/**',
  '!<rootDir>/packages/c/**/package-lock.json',
];

describe('shouldNot.haveCycles scenarios', () => {
  it('should throw an error if the dependency is not found', async () => {
    const options: Options = {
      workspaceDir: '<rootDir>/packages/c',
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
        `Violation - Rule: project files in directory '**' should not have cycles\n\n`,
      );
      expect(errorMessage).toContain(
        `Check if dependencies in file: '${workspaceDir}/app.js' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'\n`,
      );
      expect(errorMessage).toContain(`- './application/use-cases/CreateTodo'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/CreateTodo'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/GetAllTodos'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/GetTodoById'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/UpdateTodo'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/DeleteTodo'\n`);
      expect(errorMessage).toContain(
        `Check if dependencies in file: '${workspaceDir}/infra/repositories/InMemoryTodoRepository.js' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'\n`,
      );
      expect(errorMessage).toContain(`- '../../../domain/repositories/TodoRepository'\n`);
      expect(errorMessage).toContain(
        `Check if dependencies in file: '${workspaceDir}/use-cases/CreateTodo.js' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'\n`,
      );
      expect(errorMessage).toContain(`- '../../domain/entities/Todo'`);
    }
  });
});
