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

describe('inFile.should.haveLocLessThan (NestJS clean sample)', () => {
  describe('Scenario 1: File LOC < threshold (PASS)', () => {
    test('"modules/app.module.ts" should have LOC less than 21 - PASS', async () => {
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
          .should()
          .haveLocLessThan(21)
          .check();
      }
    });

    test('"modules/todo/todo.dto.ts" should have LOC less than 8 - PASS', async () => {
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
          .should()
          .haveLocLessThan(8)
          .check();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should have LOC less than 27 - PASS', async () => {
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
          .haveLocLessThan(27)
          .check();
      }
    });

    test('"modules/todo/todo.controller.ts" should have LOC less than 39 - PASS', async () => {
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
          .haveLocLessThan(39)
          .check();
      }
    });

    test('"main.ts" should have LOC less than 16 - PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance.projectFiles().inFile('**/main.ts').should().haveLocLessThan(16).check();
      }
    });
  });

  describe('Scenario 2: File LOC >= threshold (FAIL)', () => {
    test('"modules/todo/todo.controller.ts" should have LOC less than 38 - FAIL (boundary)', async () => {
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
            .haveLocLessThan(38)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should have LOC less than 26 - FAIL (boundary)', async () => {
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
            .should()
            .haveLocLessThan(26)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"modules/todo/todo.dto.ts" should have LOC less than 7 - FAIL (boundary)', async () => {
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
            .haveLocLessThan(7)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"use-cases/create-todo.usecase.ts" should have LOC less than 15 - FAIL', async () => {
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
            .should()
            .haveLocLessThan(15)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/todo.repository.ts" should have LOC less than 9 - FAIL', async () => {
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
            .haveLocLessThan(9)
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"main.ts" should have LOC less than 11 - FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance.projectFiles().inFile('**/main.ts').should().haveLocLessThan(11).check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('nonexistent file pattern - should throw error (no files found)', async () => {
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
            .haveLocLessThan(10)
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });
  });
});
