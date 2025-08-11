import * as path from 'pathe';

import { ComponentSelectorBuilder } from '../../../src/fluent-api';
import { Options } from '../../../src/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-nest-clean');

const includeMatchers: string[][] = [['<rootDir>/**'], ['./**']];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/tsconfig.json',
  '!<rootDir>/**/.swcrc',
  '!<rootDir>/**/tsconfig.build.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('inFile.should.onlyHaveName (NestJS clean sample)', () => {
  describe('Scenario 1: File does NOT match the pattern (FAIL)', () => {
    test('"modules/todo/todo.controller.ts" should only have name "*UseCase.ts" - should FAIL', async () => {
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
            .onlyHaveName('*UseCase.ts')
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/todo.repository.ts" should only have name "*Controller.ts" - should FAIL', async () => {
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
            .onlyHaveName('*Controller.ts')
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Scenario 2: File matches the pattern (PASS)', () => {
    test('"modules/todo/todo.controller.ts" should only have name "*controller.ts" - should PASS', async () => {
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
          .onlyHaveName('*controller.ts')
          .check();
      }
    });

    test('"modules/todo/todo.dto.ts" should only have name "*.dto.ts" - should PASS', async () => {
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
          .onlyHaveName('*.dto.ts')
          .check();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should only have name "*.repository.ts" - should PASS', async () => {
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
          .onlyHaveName('*.repository.ts')
          .check();
      }
    });

    test('"repositories/todo.repository.ts" should only have name "todo.repository.ts" - should PASS (exact)', async () => {
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
          .should()
          .onlyHaveName('todo.repository.ts')
          .check();
      }
    });

    test('"main.ts" should only have name "main.ts" - should PASS (exact)', async () => {
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
          .should()
          .onlyHaveName('main.ts')
          .check();
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
            .should()
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
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inFile('**/modules/todo/todo.controller.ts')
            .should()
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
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await expect(
          appInstance
            .projectFiles()
            .inFile('**/does-not-exist/file.ts')
            .should()
            .onlyHaveName('file.ts')
            .check(),
        ).rejects.toThrow(/No files found/);
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
          .onlyHaveName('*controller.ts')
          .check(),
      ).rejects.toThrow(/No files found|reached by 'includeMatcher'/);
    });
  });
});
