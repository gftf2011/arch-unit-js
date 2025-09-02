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

describe('inFiles.should.haveTotalProjectCodeLessThan scenarios (vanilla JS decorators sample)', () => {
  describe('Scenario 1: Selection SUM is strictly < threshold (PASS)', () => {
    test("['use-cases/CreateTodo.js','use-cases/GetAllTodos.js'] should be < 90% of project - PASS", async () => {
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
            .haveTotalProjectCodeLessThan(0.9)
            .check();
        }
      }
    });
  });

  describe('Scenario 2: Selection SUM is ≥ threshold (FAIL)', () => {
    test("['main/index.js'] should be < 1% of project - FAIL", async () => {
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
              .haveTotalProjectCodeLessThan(0.01)
              .check();

            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/main/index.js]' should have total project code less than: 0.01\n`,
            );
          }
        }
      }
    });

    test("['infra/InMemoryTodoRepository.js'] should be < 5% of project - FAIL", async () => {
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
              .inFiles(['**/infra/InMemoryTodoRepository.js'])
              .should()
              .haveTotalProjectCodeLessThan(0.05)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/infra/InMemoryTodoRepository.js]' should have total project code less than: 0.05`,
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
              .should()
              .haveTotalProjectCodeLessThan(0.5)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[]' should have total project code less than: 0.5`,
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
              .should()
              .haveTotalProjectCodeLessThan(0)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should have total project code less than: 0`,
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
              .should()
              .haveTotalProjectCodeLessThan(1.2)
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should have total project code less than: 1.2`,
            );
          }
        }
      }
    });
  });
});
