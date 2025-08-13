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

describe('inFile.shouldNot.haveName (NestJS clean sample)', () => {
  describe('Scenario 1: File does NOT match the pattern (PASS)', () => {
    test('"modules/todo/todo.controller.ts" should NOT have name "*.repository.ts" - PASS (does not match)', async () => {
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
          .shouldNot()
          .haveName('*.repository.ts')
          .check();
      }
    });

    test('"modules/todo/todo.dto.ts" should NOT have name "*Controller.ts" - PASS (does not match)', async () => {
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
          .haveName('*Controller.ts')
          .check();
      }
    });

    test('"repositories/todo.repository.ts" should NOT have name "*Controller.ts" - PASS (does not match)', async () => {
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
          .inFile('**/repositories/todo.repository.ts')
          .shouldNot()
          .haveName('*Controller.ts')
          .check();
      }
    });

    test('"main.ts" should NOT have name "*Repository.ts" - PASS (does not match)', async () => {
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
          .inFile('**/main.ts')
          .shouldNot()
          .haveName('*Repository.ts')
          .check();
      }
    });
  });

  describe('Scenario 2: File matches the pattern (FAIL)', () => {
    test('"modules/todo/todo.controller.ts" should NOT have name "*controller.ts" - FAIL (matches)', async () => {
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
            .shouldNot()
            .haveName('*controller.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"modules/todo/todo.dto.ts" should NOT have name "*.dto.ts" - FAIL (matches)', async () => {
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
            .shouldNot()
            .haveName('*.dto.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should NOT have name "*.repository.ts" - FAIL (matches)', async () => {
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
            .haveName('*.repository.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/todo.repository.ts" should NOT have name "todo.repository.ts" - FAIL (exact match)', async () => {
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
            .shouldNot()
            .haveName('todo.repository.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"main.ts" should NOT have name "main.ts" - FAIL (exact match)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance.projectFiles().inFile('**/main.ts').shouldNot().haveName('main.ts').check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty pattern should throw error', async () => {
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
            .shouldNot()
            .haveName('')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('incorrect extension (mismatch) should throw error', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inFile('**/modules/todo/todo.controller.ts')
            .shouldNot()
            .haveName('*controller.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('nonexistent file pattern should throw error (no files found)', async () => {
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
            .inFile('**/does-not-exist/file.ts')
            .shouldNot()
            .haveName('file.ts')
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });
  });
});
