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

describe('inFile.shouldNot.haveLocGreaterOrEqualThan (NestJS clean sample)', () => {
  describe('Scenario 1: File has lines of code LESS than the threshold (PASS)', () => {
    test('"modules/app.module.ts" should not have LOC >= 50 - should PASS', async () => {
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
          .inFile('**/modules/app.module.ts')
          .shouldNot()
          .haveLocGreaterOrEqualThan(50)
          .check();
      }
    });

    test('"modules/todo/todo.dto.ts" should not have LOC >= 20 - should PASS', async () => {
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
          .inFile('**/modules/todo/todo.dto.ts')
          .shouldNot()
          .haveLocGreaterOrEqualThan(20)
          .check();
      }
    });
  });

  describe('Scenario 2: File has lines of code GREATER than or EQUAL to the threshold (FAIL)', () => {
    test('"main.ts" should not have LOC >= 10 - should FAIL', async () => {
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
            .shouldNot()
            .haveLocGreaterOrEqualThan(10)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"use-cases/create-todo.usecase.ts" should not have LOC >= 5 - should FAIL', async () => {
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
            .inFile('**/use-cases/create-todo.usecase.ts')
            .shouldNot()
            .haveLocGreaterOrEqualThan(5)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should not have LOC >= 20 - should FAIL', async () => {
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
            .inFile('**/repositories/in-memory-todo.repository.ts')
            .shouldNot()
            .haveLocGreaterOrEqualThan(20)
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
        await expect(
          appInstance
            .projectFiles()
            .inFile('**/domain/todo.entity.ts')
            .shouldNot()
            .haveLocGreaterOrEqualThan(36)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('empty/invalid threshold (0) - should FAIL', async () => {
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
            .inFile('**/modules/app.module.ts')
            .shouldNot()
            .haveLocGreaterOrEqualThan(0)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `project files in file '**/modules/app.module.ts' should not have L.O.C. greater or equal than: 0`,
          );
          expect(errorMessage).toContain('Threshold value must be greater than 0');
        }
      }
    });

    test('negative threshold (-1) - should FAIL', async () => {
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
            .inFile('**/modules/todo/todo.dto.ts')
            .shouldNot()
            .haveLocGreaterOrEqualThan(-1)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `project files in file '**/modules/todo/todo.dto.ts' should not have L.O.C. greater or equal than: -1`,
          );
          expect(errorMessage).toContain('Threshold value must be greater than 0');
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
            .inFile('**/nonexistent/path/file.ts')
            .shouldNot()
            .haveLocGreaterOrEqualThan(10)
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });

    test('file path not reached by includeMatcher - should throw error', async () => {
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
          .shouldNot()
          .haveLocGreaterOrEqualThan(10)
          .check(),
      ).rejects.toThrow(/No files found|reached by 'includeMatcher'/);
    });
  });
});
