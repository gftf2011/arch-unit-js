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

describe('inFiles.should.dependsOn scenarios (vanilla JS decorators sample)', () => {
  describe('Scenario 1: Some selected files have NO dependencies (FAIL)', () => {
    test("'domain/Todo.js' and 'infra/InMemoryTodoRepository.js' should depend on @infra and @usecases - FAIL", async () => {
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
              .inFiles(['**/domain/Todo.js', '**/infra/InMemoryTodoRepository.js'])
              .should()
              .dependsOn(['**/infra/**', '**/use-cases/**'])
              .check();
            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/domain/Todo.js, **/infra/InMemoryTodoRepository.js]' should depends on '[**/infra/**, **/use-cases/**]'\n\n`,
            );
            expect(errorMessage).toContain(`- '${rootDir}/domain/Todo.js'`);
            expect(errorMessage).toContain(`- '${rootDir}/infra/InMemoryTodoRepository.js'`);
          }
        }
      }
    });
  });

  describe('Scenario 2: Some selected files have dependencies but NONE match the patterns (FAIL)', () => {
    test("'use-cases/CreateTodo.js' and 'use-cases/GetAllTodos.js' should depend on 'infra' and 'domain' - FAIL (only local imports)", async () => {
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
              .should()
              .dependsOn(['**/infra/**', '**/domain/**'])
              .check();
            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js, **/use-cases/GetAllTodos.js]' should depends on '[**/infra/**, **/domain/**]'\n\n`,
            );

            expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
            expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          }
        }
      }
    });
  });

  describe('Scenario 3: Some selected files have dependencies and SOME match the patterns (FAIL)', () => {
    test("'main/index.js' and 'use-cases/CreateTodo.js' should depend on 'infra' and 'use-cases' - FAIL (use-cases missing 'infra' and 'use-cases')", async () => {
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
              .inFiles(['**/main/index.js', '**/use-cases/CreateTodo.js'])
              .should()
              .dependsOn(['**/infra/**', '**/use-cases/**'])
              .check();
            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/main/index.js, **/use-cases/CreateTodo.js]' should depends on '[**/infra/**, **/use-cases/**]'\n\n`,
            );
            expect(errorMessage).not.toContain(`- '${rootDir}/main/index.js'`);
            expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          }
        }
      }
    });
  });

  describe('Scenario 4: All selected files have dependencies and ALL patterns are present (PASS)', () => {
    test("'main/index.js' should depend on 'infra' and 'use-cases' - PASS", async () => {
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
            .inFiles(['**/main/index.js'])
            .should()
            .dependsOn(['**/use-cases/**'])
            .and()
            .dependsOn(['**/infra/**'])
            .check();
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty array - should FAIL', async () => {
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
              .inFiles([])
              .should()
              .dependsOn(['**/infra/**'])
              .check();
            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[]' should depends on '[**/infra/**]'\n\n`,
            );
            expect(errorMessage).toContain(`No pattern was provided for checking`);
          }
        }
      }
    });

    test('array with empty string pattern - should FAIL', async () => {
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
              .inFiles(['**/main/index.js'])
              .should()
              .dependsOn(['**/infra/**', ''])
              .check();
            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/main/index.js]' should depends on '[**/infra/**, ]'\n\n`,
            );
            expect(errorMessage).toContain(`No pattern was provided for checking`);
          }
        }
      }
    });
  });
});
