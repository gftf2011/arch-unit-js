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

describe('inFile.should.haveName (NestJS clean sample)', () => {
  describe('Scenario 1: File does NOT match the pattern (FAIL)', () => {
    test('"modules/todo/todo.controller.ts" should have name "*UseCase.ts" - should FAIL', async () => {
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
            .should()
            .haveName('*UseCase.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"modules/todo/todo.dto.ts" should have name "*Controller.ts" - should FAIL', async () => {
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
            .should()
            .haveName('*Controller.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/todo.repository.ts" should have name "*Controller.ts" - should FAIL', async () => {
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
            .should()
            .haveName('*Controller.ts')
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Scenario 2: File matches the pattern (PASS)', () => {
    test('"modules/todo/todo.controller.ts" should have name "*controller.ts" - should PASS', async () => {
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
          .should()
          .haveName('*controller.ts')
          .check();
      }
    });

    test('"modules/todo/todo.dto.ts" should have name "*.dto.ts" - should PASS', async () => {
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
          .haveName('*.dto.ts')
          .check();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should have name "*.repository.ts" - should PASS', async () => {
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
          .inFile('**/repositories/in-memory-todo.repository.ts')
          .should()
          .haveName('*.repository.ts')
          .check();
      }
    });

    test('"repositories/todo.repository.ts" should have name "todo.repository.ts" - should PASS (exact)', async () => {
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
          .should()
          .haveName('todo.repository.ts')
          .check();
      }
    });

    test('"main.ts" should have name "main.ts" - should PASS (exact)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance.projectFiles().inFile('**/main.ts').should().haveName('main.ts').check();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty pattern should throw error', async () => {
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
            .should()
            .haveName('')
            .check(),
        ).rejects.toThrow();
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
            .should()
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
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inFile('**/does-not-exist/file.ts')
            .should()
            .haveName('file.ts')
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });

    test('includeMatcher does not reach file - should throw error', async () => {
      const options: Options = {
        extensionTypes: ['**/*.ts'],
        includeMatcher: ['<rootDir>/use-cases/**'],
        ignoreMatcher: ignoreMatchers,
        typescriptPath,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      await expect(
        appInstance
          .projectFiles()
          .inFile('**/modules/todo/todo.controller.ts')
          .should()
          .haveName('*controller.ts')
          .check(),
      ).rejects.toThrow(/No files found|reached by 'includeMatcher'/);
    });
  });
});
