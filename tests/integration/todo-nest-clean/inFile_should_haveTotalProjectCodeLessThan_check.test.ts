import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-nest-clean');

const includeMatchers: string[][] = [['<rootDir>/**'], ['./**']];

const ignoreMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
  '!<rootDir>/**/tsconfig.json',
  '!<rootDir>/**/.swcrc',
  '!<rootDir>/**/tsconfig.build.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('inFile.should.haveTotalProjectCodeLessThan (NestJS clean sample)', () => {
  describe('Scenario 1: File bytes < allowed percentage of total project (PASS)', () => {
    test("'main.ts' should represent less than 100% of total project bytes - PASS", async () => {
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
          .inFile('**/main.ts')
          .should()
          .haveTotalProjectCodeLessThan(1)
          .check();
      }
    });

    test("'modules/todo/todo.dto.ts' should represent less than 90% of total project bytes - PASS", async () => {
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
          .inFile('**/modules/todo/todo.dto.ts')
          .should()
          .haveTotalProjectCodeLessThan(0.9)
          .check();
      }
    });
  });

  describe('Scenario 2: File bytes >= allowed percentage of total project (FAIL)', () => {
    test("'main.ts' should represent less than 1% of total project bytes - FAIL", async () => {
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
            .inFile('**/main.ts')
            .should()
            .haveTotalProjectCodeLessThan(0.01)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in file '**/main.ts' should have total project code less than: 0.01\n`,
          );
          expect(err.message).toContain(`- '${rootDir}/src/main.ts'`);
        }
      }
    });

    test("'modules/app.module.ts' should represent less than 2% of total project bytes - FAIL", async () => {
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
            .inFile('**/modules/app.module.ts')
            .should()
            .haveTotalProjectCodeLessThan(0.02)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in file '**/modules/app.module.ts' should have total project code less than: 0.02\n`,
          );
          expect(err.message).toContain(`- '${rootDir}/src/modules/app.module.ts'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('nonexistent file pattern - should throw error (no files found)', async () => {
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
            .inFile('**/nonexistent/file.ts')
            .should()
            .haveTotalProjectCodeLessThan(0.5)
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
            .inFile('**/main.ts')
            .should()
            .haveTotalProjectCodeLessThan(0.5)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in file '**/main.ts' should have total project code less than: 0.5\n`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/domain/todo.entity.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/main.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/modules/app.module.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/modules/todo/todo.controller.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/modules/todo/todo.dto.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/modules/todo/todo.module.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/repositories/in-memory-todo.repository.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/repositories/todo.repository.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/use-cases/create-todo.usecase.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/use-cases/delete-todo.usecase.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/use-cases/get-todo.usecase.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/use-cases/list-todos.usecase.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(err.message).toContain(
            `- '${rootDir}/src/use-cases/update-todo.usecase.ts' - mismatch in 'extensionTypes': [**/*.js]`,
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
            .inFile('**/main.ts')
            .should()
            .haveTotalProjectCodeLessThan(0)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in file '**/main.ts' should have total project code less than: 0\n`,
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
            .inFile('**/modules/app.module.ts')
            .should()
            .haveTotalProjectCodeLessThan(1.2)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const err = error as Error;
          expect(err.message).toContain(
            `Violation - Rule: project files in file '**/modules/app.module.ts' should have total project code less than: 1.2\n`,
          );
          expect(err.message).toContain(
            `Percentage value must be greater than 0 and less or equal than 1`,
          );
        }
      }
    });
  });
});
