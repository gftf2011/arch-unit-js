import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-nest-clean');

const includeMatchers: string[][] = [
  ['<rootDir>/**'],
  //   ['./**'],
];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/tsconfig.json',
  '!<rootDir>/**/.swcrc',
  '!<rootDir>/**/tsconfig.build.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('inFile.shouldNot.dependsOn scenarios (NestJS clean sample)', () => {
  describe('Scenario 1: File has NO dependencies', () => {
    test('"domain/todo.entity.ts" should not depend on "repositories" and "uuid" - should PASS', async () => {
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
          .shouldNot()
          .dependsOn(['**/repositories/**', 'uuid'])
          .check();
      }
    });
  });

  describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
    test('"use-cases/create-todo.usecase.ts" should not depend on "modules" - should PASS', async () => {
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
          .shouldNot()
          .dependsOn(['**/modules/**'])
          .check();
      }
    });

    test('"use-cases/list-todos.usecase.ts" should not depend on "modules" - should PASS', async () => {
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
          .inFile('**/use-cases/list-todos.usecase.ts')
          .shouldNot()
          .dependsOn(['**/modules/**'])
          .check();
      }
    });
  });

  describe('Scenario 3: File has dependencies and ANY patterns are present', () => {
    test('"use-cases/create-todo.usecase.ts" should not depend on "repositories" - should FAIL', async () => {
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
            .dependsOn(['**/repositories/**'])
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"use-cases/create-todo.usecase.ts" should not depend on "domain" and "pg" - should FAIL', async () => {
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
            .dependsOn(['**/domain/**', 'pg'])
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"repositories/in-memory-todo.repository.ts" should not depend on "domain" - should FAIL', async () => {
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
            .dependsOn(['**/domain/**'])
            .check(),
        ).rejects.toThrow();
      }
    });

    test('"src/main.ts" should not depend on npm "@nestjs/core" - should FAIL', async () => {
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
            .dependsOn(['@nestjs/core'])
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty array - should FAIL', async () => {
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
            .dependsOn([])
            .check(),
        ).rejects.toThrow();
      }
    });

    test('array with empty string - should FAIL', async () => {
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
            .dependsOn(['**/domain/**', ''])
            .check(),
        ).rejects.toThrow();
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
            .dependsOn(['uuid'])
            .check(),
        ).rejects.toThrow();
      }
    });
  });
});
