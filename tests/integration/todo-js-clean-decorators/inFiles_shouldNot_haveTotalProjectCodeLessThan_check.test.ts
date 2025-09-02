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

describe('inFiles.shouldNot.haveTotalProjectCodeLessThan scenarios (vanilla JS decorators sample)', () => {
  describe('Scenario 1: Selection SUM is ≥ threshold (PASS)', () => {
    test("['main/index.js','infra/InMemoryTodoRepository.js'] should NOT be < 10% of project - PASS", async () => {
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
            .inFiles(['**/main/index.js', '**/infra/InMemoryTodoRepository.js'])
            .shouldNot()
            .haveTotalProjectCodeLessThan(0.1)
            .check();
        }
      }
    });

    test("['main/index.js'] should NOT be < 1% of project - PASS", async () => {
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
            .shouldNot()
            .haveTotalProjectCodeLessThan(0.01)
            .check();
        }
      }
    });
  });

  describe('Scenario 2: Selection SUM is strictly < threshold (FAIL)', () => {
    test("['use-cases/CreateTodo.js','use-cases/GetAllTodos.js'] should NOT be < 90% of project - FAIL", async () => {
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
              .haveTotalProjectCodeLessThan(0.9)
              .check();

            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js, **/use-cases/GetAllTodos.js]' should not have total project code less than: 0.9`,
            );
          }
        }
      }
    });

    test("['use-cases/CreateTodo.js'] should NOT be < 40% of project - FAIL", async () => {
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
              .haveTotalProjectCodeLessThan(0.4)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should not have total project code less than: 0.4`,
            );
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
            await appInstance
              .projectFiles()
              .inFiles([])
              .shouldNot()
              .haveTotalProjectCodeLessThan(0.5)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[]' should not have total project code less than: 0.5`,
            );
            expect(errorMessage).toContain(`No files found in '[]'`);
          }
        }
      }
    });

    test('threshold of 0 should FAIL (invalid threshold)', async () => {
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
              .haveTotalProjectCodeLessThan(0)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should not have total project code less than: 0`,
            );
          }
        }
      }
    });

    test('threshold > 1 should FAIL (invalid threshold)', async () => {
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
              .haveTotalProjectCodeLessThan(1.2)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should not have total project code less than: 1.2`,
            );
          }
        }
      }
    });
  });
});
