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

describe('inFiles.should.haveLocLessThan scenarios (vanilla JS decorators sample)', () => {
  describe('Scenario 1: All selected files have LOC LESS than the threshold (PASS)', () => {
    test("['use-cases/CreateTodo.js','use-cases/GetAllTodos.js'] should have LOC < 50 - PASS", async () => {
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
            .inFiles(['**/use-cases/CreateTodo.js', '**/use-cases/GetAllTodos.js'])
            .should()
            .haveLocLessThan(50)
            .check();
        }
      }
    });

    test("['infra/InMemoryTodoRepository.js'] should have LOC < 1000 - PASS", async () => {
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
            .inFiles(['**/infra/InMemoryTodoRepository.js'])
            .should()
            .haveLocLessThan(1000)
            .check();
        }
      }
    });
  });

  describe('Scenario 2: ANY selected file has LOC GREATER than or EQUAL to the threshold (FAIL)', () => {
    test("['main/index.js'] should have LOC < 33 - FAIL (equals boundary)", async () => {
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
              .haveLocLessThan(33)
              .check();

            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/main/index.js]' should have L.O.C. less than: 33\n\n`,
            );
            expect(errorMessage).toContain(`- '${rootDir}/main/index.js'`);
          }
        }
      }
    });

    test("['domain/Todo.js'] should have LOC < 13 - FAIL (equals boundary)", async () => {
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
              .inFiles(['**/domain/Todo.js'])
              .should()
              .haveLocLessThan(13)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/domain/Todo.js]' should have L.O.C. less than: 13\n\n`,
            );
            expect(errorMessage).toContain(`- '${rootDir}/domain/Todo.js'`);
          }
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty selection should FAIL', async () => {
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
            await appInstance.projectFiles().inFiles([]).should().haveLocLessThan(10).check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[]' should have L.O.C. less than: 10\n\n`,
            );
            expect(errorMessage).toContain(`No files found in '[]'`);
          }
        }
      }
    });

    test('threshold of 0 should FAIL (no file can have < 0 LOC)', async () => {
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
              .should()
              .haveLocLessThan(0)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should have L.O.C. less than: 0\n\n`,
            );
            expect(errorMessage).toContain(`Threshold value must be greater than 0`);
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
              .should()
              .haveLocLessThan(10)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/domain/Todo.js]' should have L.O.C. less than: 10\n\n`,
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
