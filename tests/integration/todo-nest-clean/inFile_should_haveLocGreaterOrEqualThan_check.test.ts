import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-nest-clean');

const includeMatchers: string[][] = [['<rootDir>/**'], ['./**']];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/tsconfig.json',
  '!<rootDir>/**/.swcrc',
  '!<rootDir>/**/tsconfig.build.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('inFile.should.haveLocGreaterOrEqualThan scenarios (NestJS clean sample)', () => {
  describe('Scenario 1: File has lines of code GREATER than or EQUAL to the threshold', () => {
    test('"use-cases/create-todo.usecase.ts" should have LOC >= 1 - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inFile('**/use-cases/create-todo.usecase.ts')
          .should()
          .haveLocGreaterOrEqualThan(1)
          .check();
      }
    });

    test('"domain/todo.entity.ts" should have LOC >= 1 - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inFile('**/domain/todo.entity.ts')
          .should()
          .haveLocGreaterOrEqualThan(1)
          .check();
      }
    });
  });

  describe('Scenario 2: File has lines of code LESS than the threshold', () => {
    test('"use-cases/create-todo.usecase.ts" should have LOC >= 100 - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inFile('**/use-cases/create-todo.usecase.ts')
            .should()
            .haveLocGreaterOrEqualThan(100)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `project files in file '**/use-cases/create-todo.usecase.ts' should have L.O.C. greater or equal than: 100`,
          );
        }
      }
    });

    test('"main.ts" should have LOC >= 200 - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inFile('**/main.ts')
            .should()
            .haveLocGreaterOrEqualThan(200)
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('"domain/todo.entity.ts" should have LOC >= 36 - should PASS (boundary case file has exactly 36 LOC)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inFile('**/domain/todo.entity.ts')
          .should()
          .haveLocGreaterOrEqualThan(36)
          .check();
      }
    });

    test('empty threshold (0) - should FAIL (invalid threshold)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.ts'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: excludeMatchers,
            typescriptPath,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inFile('**/domain/todo.entity.ts')
            .should()
            .haveLocGreaterOrEqualThan(0)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `project files in file '**/domain/todo.entity.ts' should have L.O.C. greater or equal than: 0`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('negative threshold (-1) - should FAIL (invalid threshold)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.ts'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: excludeMatchers,
            typescriptPath,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inFile('**/domain/todo.entity.ts')
            .should()
            .haveLocGreaterOrEqualThan(-1)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `project files in file '**/domain/todo.entity.ts' should have L.O.C. greater or equal than: -1`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('nonexistent file pattern - should throw error (no files exist)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inFile('**/nonexistent/file.ts')
            .should()
            .haveLocGreaterOrEqualThan(10)
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });

    test(`file path not reached by includeMatcher - should throw error`, async () => {
      const options: Options = {
        extensionTypes: ['**/*.ts'],
        includeMatcher: ['<rootDir>/infra/**'],
        ignoreMatcher: excludeMatchers,
        typescriptPath,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await expect(
        appInstance
          .projectFiles()
          .inFile('**/use-cases/create-todo.usecase.ts')
          .should()
          .haveLocGreaterOrEqualThan(1)
          .check(),
      ).rejects.toThrow(/No files found|reached by 'includeMatcher'/);
    });
  });
});
