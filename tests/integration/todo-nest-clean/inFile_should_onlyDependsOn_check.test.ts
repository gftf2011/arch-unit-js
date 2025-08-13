import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-nest-clean');

const includeMatchers: string[][] = [['<rootDir>/**'], ['./**']];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
  '!<rootDir>/**/tsconfig.json',
  '!<rootDir>/**/.swcrc',
  '!<rootDir>/**/tsconfig.build.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('inFile.should.onlyDependsOn (NestJS clean sample)', () => {
  describe('Scenario 1: File has NO dependencies (PASS)', () => {
    test('"domain/todo.entity.ts" should only depend on [inexistent-dependency] - PASS (no imports)', async () => {
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
          .should()
          .onlyDependsOn(['inexistent-dependency'])
          .check();
      }
    });
  });

  describe('Scenario 2: File has dependencies but NONE match the patterns (FAIL)', () => {
    test('"use-cases/create-todo.usecase.ts" should only depend on [**/infra/**] - FAIL (imports not from infra)', async () => {
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
            .onlyDependsOn(['**/infra/**'])
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Scenario 3: File has dependencies that match only SOME of the patterns (exclusively) (PASS)', () => {
    test('"use-cases/create-todo.usecase.ts" should only depend on [**/*todo*, @nestjs/**, something-else] - PASS (subset)', async () => {
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
          .onlyDependsOn(['**/*todo*', '@nestjs/**', 'something-else'])
          .check();
      }
    });
  });

  describe('Scenario 4: File has dependencies and ALL patterns are present (exclusively) (PASS)', () => {
    test('"main.ts" should only depend on [@nestjs/**, **/modules/**, reflect-metadata] - PASS (imports only from allowed)', async () => {
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
          .onlyDependsOn(['@nestjs/**', '**/modules/**', 'reflect-metadata'])
          .check();
      }
    });
  });

  describe('Scenario 5: File has dependencies with additional non-matching dependencies (FAIL)', () => {
    test('"main.ts" should only depend on [@nestjs/core] - FAIL (also imports app.module)', async () => {
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
            .should()
            .onlyDependsOn(['@nestjs/core'])
            .check(),
        ).rejects.toThrow();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty array should throw error', async () => {
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
            .inFile('**/domain/entities/Todo.ts')
            .should()
            .onlyDependsOn([])
            .check(),
        ).rejects.toThrow(/No pattern was provided for checking/);
      }
    });

    test('array with empty string should throw error', async () => {
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
            .inFile('**/domain/entities/Todo.ts')
            .should()
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
            .should()
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
            .should()
            .onlyDependsOn(['**/domain/**'])
            .check(),
        ).rejects.toThrow(/No files found/);
      }
    });
  });
});
