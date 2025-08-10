import * as path from 'pathe';

import { ComponentSelectorBuilder } from '../../../src/fluent-api';
import { Options } from '../../../src/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-nest-clean');

const includeMatchers: string[][] = [
  ['<rootDir>/**'],
  ['./**'],
];

const excludeMatchers = ['!<rootDir>/**/package.json', '!<rootDir>/**/tsconfig.json', '!<rootDir>/**/.swcrc', '!<rootDir>/**/tsconfig.build.json'];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('withFile.should.dependsOn scenarios (NestJS clean sample)', () => {
  describe('Scenario 1: File has NO dependencies', () => {
    test('"domain/todo.entity.ts" should depend on "repositories" - should FAIL', async () => {
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
            .withFile('**/domain/todo.entity.ts')
            .should()
            .dependsOn(['**/repositories/**'])
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
    test('"use-cases/create-todo.usecase.ts" should depend on "modules" - should FAIL (no module imports)', async () => {
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
            .withFile('**/use-cases/create-todo.usecase.ts')
            .should()
            .dependsOn(['**/modules/**'])
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Scenario 3: File has dependencies and SOME match the patterns', () => {
    test('"use-cases/list-todos.usecase.ts" should depend on "domain" and "repositories" - should FAIL (missing domain)', async () => {
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
            .withFile('**/use-cases/list-todos.usecase.ts')
            .should()
            .dependsOn(['**/domain/**', '**/repositories/**'])
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Scenario 4: File has dependencies and ALL patterns are present', () => {
    test('"use-cases/create-todo.usecase.ts" should depend on "domain" and "repositories" - should PASS', async () => {
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
          .withFile('**/use-cases/create-todo.usecase.ts')
          .should()
          .dependsOn(['**/domain/**', '**/repositories/**'])
          .check();
      }
    });

    test('"main.ts" should depend on "modules" and "reflect-metadata" - should PASS', async () => {
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
          .withFile('**/main.ts')
          .should()
          .dependsOn(['**/modules/**', 'reflect-metadata'])
          .check();
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
            .withFile('**/domain/todo.entity.ts')
            .should()
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
            .withFile('**/use-cases/create-todo.usecase.ts')
            .should()
            .dependsOn(['**/domain/**', ''])
            .check(),
        ).rejects.toThrow();
      }
    });
  });
});
