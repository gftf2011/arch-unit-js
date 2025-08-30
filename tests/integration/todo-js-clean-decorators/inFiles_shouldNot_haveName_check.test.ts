import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-clean-decorators',
);

const includeMatchers: string[][] = [
  ['<rootDir>/**'],
  ['<rootDir>/**/'],
  ['./**'],
  ['./**/'],
  ['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**', '<rootDir>/main/**'],
  ['<rootDir>/domain/**/', '<rootDir>/use-cases/**/', '<rootDir>/infra/**/', '<rootDir>/main/**/'],
  ['./domain/**', './use-cases/**', './infra/**', './main/**'],
  ['./domain/**/', './use-cases/**/', './infra/**/', './main/**/'],
];

const ignoreMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/package-lock.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/webpack.config.js',
  '!<rootDir>/**/webpack2.config.js',
  '!<rootDir>/**/babel.config.json',
  '!<rootDir>/**/index.html',
];

const webpacks = [
  {
    webpack: {
      path: '<rootDir>/webpack.config.js',
    },
  },
  {
    webpack: {
      path: '<rootDir>/webpack2.config.js',
      names: ['app'],
    },
  },
];

describe('inFiles.shouldNot.haveName scenarios (vanilla JS decorators sample)', () => {
  describe('Scenario 1: None of the selected files match the pattern (PASS)', () => {
    test("['infra/InMemoryTodoRepository.js','domain/Todo.js'] should NOT have name '*UseCase.js' - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inFiles(['**/infra/InMemoryTodoRepository.js', '**/domain/Todo.js'])
            .shouldNot()
            .haveName('*UseCase.js')
            .check();
        }
      }
    });
  });

  describe('Scenario 2: Some selected files match the pattern (FAIL)', () => {
    test("['use-cases/CreateTodo.js','use-cases/GetAllTodos.js'] should NOT have name '*Todo*.js' - FAIL", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/use-cases/CreateTodo.js', '**/use-cases/GetAllTodos.js'])
              .shouldNot()
              .haveName('*Todo*.js')
              .check();

            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js, **/use-cases/GetAllTodos.js]' should not have name '*Todo*.js'\n\n`,
            );
            expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
            expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          }
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty pattern should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/use-cases/CreateTodo.js'])
              .shouldNot()
              .haveName('')
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should not have name ''\n\n`,
            );
            expect(errorMessage).toContain(`No pattern was provided for checking`);
          }
        }
      }
    });

    test('incorrect extension types should FAIL with mismatch details', async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            extensionTypes: ['**/*.ts'], // Looking for TypeScript in JavaScript project
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/domain/Todo.js'])
              .shouldNot()
              .haveName('*Todo.js')
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/domain/Todo.js]' should not have name '*Todo.js'\n\n`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/domain/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/infra/InMemoryTodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/main/index.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/use-cases/CreateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/use-cases/Service.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
          }
        }
      }
    });
  });
});
