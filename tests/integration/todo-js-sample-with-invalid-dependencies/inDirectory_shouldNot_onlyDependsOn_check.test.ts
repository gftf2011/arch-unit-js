import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-sample-with-invalid-dependencies',
);

const includeMatchers = ['<rootDir>/**'];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
];

describe('shouldNot.onlyDependsOn scenarios', () => {
  it('should throw an error if the dependency is not found', async () => {
    const options: Options = {
      extensionTypes: ['**/*.js'],
      includeMatcher: [...includeMatchers],
      ignoreMatcher: excludeMatchers,
    };
    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    try {
      await appInstance
        .projectFiles()
        .inDirectory('**')
        .shouldNot()
        .onlyDependsOn('something')
        .check();
      // If we get here, the test should fail
      expect(1).toBe(2);
    } catch (error) {
      const errorMessage = (error as Error).message;

      expect(errorMessage).toContain(
        `Violation - Rule: project files in directory '**' should not only depends on '[something]'\n\n`,
      );
      expect(errorMessage).toContain(
        `Check if dependencies in file: '${rootDir}/app.js' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'\n`,
      );
      expect(errorMessage).toContain(`- './application/use-cases/CreateTodo'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/CreateTodo'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/GetAllTodos'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/GetTodoById'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/UpdateTodo'\n`);
      expect(errorMessage).toContain(`- './application/use-cases/DeleteTodo'\n`);
      expect(errorMessage).toContain(
        `Check if dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'\n`,
      );
      expect(errorMessage).toContain(`- '../../../domain/repositories/TodoRepository'\n`);
      expect(errorMessage).toContain(
        `Check if dependencies in file: '${rootDir}/use-cases/CreateTodo.js' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'\n`,
      );
      expect(errorMessage).toContain(`- '../../domain/entities/Todo'`);
    }
  });
});
