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

describe('inFile.should.haveLocGreaterThan (NestJS clean sample)', () => {
  describe('Scenario 1: File LOC > threshold (PASS)', () => {
    test('"use-cases/create-todo.usecase.ts" should have LOC > 15 - should PASS', async () => {
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
          .haveLocGreaterThan(15)
          .check();
      }
    });

    test('"modules/todo/todo.controller.ts" should have LOC > 30 - should PASS', async () => {
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
          .inFile('**/modules/todo/todo.controller.ts')
          .should()
          .haveLocGreaterThan(30)
          .check();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should have LOC > 25 - should PASS', async () => {
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
          .inFile('**/repositories/in-memory-todo.repository.ts')
          .should()
          .haveLocGreaterThan(25)
          .check();
      }
    });
  });

  describe('Scenario 2: File LOC ≤ threshold (FAIL)', () => {
    test('"modules/app.module.ts" should have LOC > 10 - should FAIL', async () => {
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
            .inFile('**/modules/app.module.ts')
            .should()
            .haveLocGreaterThan(10)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"modules/todo/todo.dto.ts" should have LOC > 7 - should FAIL (boundary, equals 7 LOC)', async () => {
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
            .inFile('**/modules/todo/todo.dto.ts')
            .should()
            .haveLocGreaterThan(7)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/todo.repository.ts" should have LOC > 11 - should FAIL', async () => {
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
            .inFile('**/repositories/todo.repository.ts')
            .should()
            .haveLocGreaterThan(11)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"main.ts" should have LOC > 20 - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance.projectFiles().inFile('**/main.ts').should().haveLocGreaterThan(20).check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('nonexistent file pattern - should throw error', async () => {
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
            .haveLocGreaterThan(10)
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });

    test('invalid threshold (0) - should throw error', async () => {
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
            .inFile('**/modules/todo/todo.controller.ts')
            .should()
            .haveLocGreaterThan(0)
            .check(),
        ).rejects.toThrow(/Threshold value must be greater than 0/);
      }
    });

    test('includeMatcher does not reach file - should throw error', async () => {
      const options: Options = {
        extensionTypes: ['**/*.ts'],
        includeMatcher: ['<rootDir>/use-cases/**'],
        ignoreMatcher: excludeMatchers,
        typescriptPath,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await expect(
        appInstance
          .projectFiles()
          .inFile('**/modules/todo/todo.controller.ts')
          .should()
          .haveLocGreaterThan(5)
          .check(),
      ).rejects.toThrow(/No files found|reached by 'includeMatcher'/);
    });
  });
});
