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

describe('inFile.shouldNot.onlyHaveName (NestJS clean sample)', () => {
  describe('Scenario 1: File name does NOT match the pattern (PASS)', () => {
    test('"modules/todo/todo.controller.ts" should NOT only have name "*UseCase.ts" - PASS', async () => {
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
          .inFile('**/modules/todo/todo.controller.ts')
          .shouldNot()
          .onlyHaveName('*UseCase.ts')
          .check();
      }
    });

    test('"modules/todo/todo.dto.ts" should NOT only have name "*Controller.ts" - PASS', async () => {
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
          .shouldNot()
          .onlyHaveName('*Controller.ts')
          .check();
      }
    });

    test('"repositories/todo.repository.ts" should NOT only have name "*Controller.ts" - PASS', async () => {
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
          .inFile('**/repositories/todo.repository.ts')
          .shouldNot()
          .onlyHaveName('*Controller.ts')
          .check();
      }
    });

    test('"main.ts" should NOT only have name "*Repository.ts" - PASS', async () => {
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
          .shouldNot()
          .onlyHaveName('*Repository.ts')
          .check();
      }
    });
  });

  describe('Scenario 2: File name matches the pattern (FAIL)', () => {
    test('"modules/todo/todo.controller.ts" should NOT only have name "*controller.ts" - FAIL', async () => {
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
            .inFile('**/modules/todo/todo.controller.ts')
            .shouldNot()
            .onlyHaveName('*controller.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"modules/todo/todo.dto.ts" should NOT only have name "*.dto.ts" - FAIL', async () => {
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
            .inFile('**/modules/todo/todo.dto.ts')
            .shouldNot()
            .onlyHaveName('*.dto.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should NOT only have name "*.repository.ts" - FAIL', async () => {
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
            .inFile('**/repositories/in-memory-todo.repository.ts')
            .shouldNot()
            .onlyHaveName('*.repository.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/todo.repository.ts" should NOT only have name "todo.repository.ts" - FAIL (exact)', async () => {
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
            .inFile('**/repositories/todo.repository.ts')
            .shouldNot()
            .onlyHaveName('todo.repository.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"main.ts" should NOT only have name "main.ts" - FAIL (exact)', async () => {
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
            .inFile('**/main.ts')
            .shouldNot()
            .onlyHaveName('main.ts')
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty pattern should throw error (invalid)', async () => {
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
            .inFile('**/modules/todo/todo.controller.ts')
            .shouldNot()
            .onlyHaveName('')
            .check(),
        ).rejects.toThrow(/No pattern was provided for checking/);
      }
    });

    test('incorrect extension should throw error (mismatch)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inFile('**/modules/todo/todo.controller.ts')
            .shouldNot()
            .onlyHaveName('*controller.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('nonexistent file pattern should throw error (no files found)', async () => {
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
            .inFile('**/does-not-exist/file.ts')
            .shouldNot()
            .onlyHaveName('file.ts')
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });
  });
});
