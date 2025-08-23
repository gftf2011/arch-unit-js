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

const includeMatchers = [
  ['<rootDir>/**'],
  ['<rootDir>/**/'],
  ['./**'],
  ['./**/'],
  ['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**'],
  ['<rootDir>/domain/**/', '<rootDir>/use-cases/**/', '<rootDir>/infra/**/'],
  ['./domain/**', './use-cases/**', './infra/**'],
  ['./domain/**/', './use-cases/**/', './infra/**/'],
];

const ignoreMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
];

describe('inDirectory.should.haveTotalProjectCodeLessOrEqualThan (JS sample with invalid deps)', () => {
  describe('Scenario 1: SUM of directory bytes <= allowed percentage of total project (PASS)', () => {
    test("'domain' should have total project code less or equal than 100% - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/domain/**')
          .should()
          .haveTotalProjectCodeLessOrEqualThan(1)
          .check();
      }
    });

    test("'use-cases' should have total project code less or equal than 90% - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**')
          .should()
          .haveTotalProjectCodeLessOrEqualThan(0.9)
          .check();
      }
    });
  });

  describe('Scenario 2: SUM of directory bytes > allowed percentage of total project (FAIL)', () => {
    test("'domain' should have total project code less or equal than 0.01% - FAIL", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .should()
            .haveTotalProjectCodeLessOrEqualThan(0.0001)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should have total project code less or equal than: 0.0001`,
          );
          expect(err.message).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
          expect(err.message).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
        }
      }
    });

    test("'use-cases' should have total project code less or equal than 0.01% - FAIL", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .should()
            .haveTotalProjectCodeLessOrEqualThan(0.0001)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should have total project code less or equal than: 0.0001`,
          );
          expect(err.message).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('nonexistent directory pattern - should throw error (no files found)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inDirectory('**/nonexistent/**')
            .should()
            .haveTotalProjectCodeLessOrEqualThan(0.5)
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });

    test('incorrect extension', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .should()
            .haveTotalProjectCodeLessOrEqualThan(0.5)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should have total project code less or equal than: 0.5`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });

    test('invalid percentage: 0 - should FAIL (invalid input)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .should()
            .haveTotalProjectCodeLessOrEqualThan(0)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should have total project code less or equal than: 0`,
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
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .should()
            .haveTotalProjectCodeLessOrEqualThan(1.2)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should have total project code less or equal than: 1.2`,
          );
          expect(err.message).toContain(
            `Percentage value must be greater than 0 and less or equal than 1`,
          );
        }
      }
    });
  });
});
