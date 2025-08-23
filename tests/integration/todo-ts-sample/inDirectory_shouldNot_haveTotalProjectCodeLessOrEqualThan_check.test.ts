import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample');

const includeMatchers = [
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
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
  '!<rootDir>/**/tsconfig.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('inDirectory.shouldNot.haveTotalProjectCodeLessOrEqualThan (TS sample)', () => {
  describe('Scenario 1: SUM of directory bytes > allowed percentage (PASS)', () => {
    test("'main' should NOT have total project code less or equal than 0.01% - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/main/**')
          .shouldNot()
          .haveTotalProjectCodeLessOrEqualThan(0.0001)
          .check();
      }
    });

    test("'infra' should NOT have total project code less or equal than 0.01% - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/infra/**')
          .shouldNot()
          .haveTotalProjectCodeLessOrEqualThan(0.0001)
          .check();
      }
    });
  });

  describe('Scenario 2: SUM of directory bytes <= allowed percentage (FAIL)', () => {
    test("'domain' should NOT have total project code less or equal than 80% - FAIL", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .haveTotalProjectCodeLessOrEqualThan(0.8)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should not have total project code less or equal than: 0.8`,
          );
          expect(err.message).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
          expect(err.message).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
        }
      }
    });

    test("'use-cases' should NOT have total project code less or equal than 60% - FAIL", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .shouldNot()
            .haveTotalProjectCodeLessOrEqualThan(0.6)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not have total project code less or equal than: 0.6`,
          );
          expect(err.message).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
          expect(err.message).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
          expect(err.message).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
          expect(err.message).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
          expect(err.message).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('nonexistent directory pattern - should throw error (no files found)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inDirectory('**/nonexistent/**')
            .shouldNot()
            .haveTotalProjectCodeLessOrEqualThan(0.5)
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });

    test('incorrect extension', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .shouldNot()
            .haveTotalProjectCodeLessOrEqualThan(0.5)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not have total project code less or equal than: 0.5`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/use-cases/CreateTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/use-cases/DeleteTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/use-cases/GetAllTodos.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/use-cases/GetTodoById.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/use-cases/UpdateTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
        }
      }
    });

    test('invalid percentage: 0 - should FAIL (invalid input)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .haveTotalProjectCodeLessOrEqualThan(0)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should not have total project code less or equal than: 0`,
          );
          expect(err.message).toContain(
            `Percentage value must be greater than 0 and less or equal than 1`,
          );
        }
      }
    });

    test('invalid percentage: > 1 - should FAIL (invalid input)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .shouldNot()
            .haveTotalProjectCodeLessOrEqualThan(1.2)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should not have total project code less or equal than: 1.2`,
          );
          expect(err.message).toContain(
            `Percentage value must be greater than 0 and less or equal than 1`,
          );
        }
      }
    });
  });
});
