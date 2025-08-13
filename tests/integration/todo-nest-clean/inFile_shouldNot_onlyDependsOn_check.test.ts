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

describe('inFile.shouldNot.onlyDependsOn (NestJS clean sample)', () => {
  describe('Scenario 1: File has NO dependencies (PASS)', () => {
    test('"domain/todo.entity.ts" should NOT only depend on [@nestjs/**] - PASS (no imports)', async () => {
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
          .onlyDependsOn(['@nestjs/**'])
          .check();
      }
    });
  });

  describe('Scenario 2: File has dependencies but NONE match the patterns (PASS)', () => {
    test('"use-cases/create-todo.usecase.ts" should NOT only depend on [**/infra/**] - PASS (none match)', async () => {
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
          .onlyDependsOn(['**/infra/**'])
          .check();
      }
    });
  });

  describe('Scenario 3: File has mixed dependencies (PASS)', () => {
    test('"main.ts" should NOT only depend on [@nestjs/**] - PASS (mixed: also imports modules)', async () => {
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
          .onlyDependsOn(['@nestjs/**'])
          .check();
      }
    });

    test('"use-cases/create-todo.usecase.ts" should NOT only depend on [**/domain/**] - PASS (mixed)', async () => {
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
          .onlyDependsOn(['**/domain/**'])
          .check();
      }
    });
  });

  describe('Scenario 4: File has exclusive dependencies to specified patterns (FAIL)', () => {
    test('"main.ts" should NOT only depend on [@nestjs/**, **/modules/**, reflect-metadata] - FAIL (exclusive)', async () => {
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
            .onlyDependsOn(['@nestjs/**', '**/modules/**', 'reflect-metadata'])
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty array should throw error (invalid patterns)', async () => {
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
            .onlyDependsOn([])
            .check(),
        ).rejects.toThrow(/No pattern was provided for checking/);
      }
    });

    test('array with empty string should throw error (invalid pattern)', async () => {
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
            .onlyDependsOn(['uuid', ''])
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
            .inFile('**/infra/repositories/in-memory-todo.repository.ts')
            .shouldNot()
            .onlyDependsOn(['**/domain/**'])
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
            .inFile('**/nonexistent/file.ts')
            .shouldNot()
            .onlyDependsOn(['**/domain/**'])
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });
  });
});
