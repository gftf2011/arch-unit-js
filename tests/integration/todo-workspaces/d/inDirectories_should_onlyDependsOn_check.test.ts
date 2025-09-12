import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  '..',
  'sample',
  'todo-workspaces',
);

const workspaceDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  '..',
  'sample',
  'todo-workspaces',
  'packages',
  'd',
);

const includeMatchers: string[][] = [
  ['<workspaceDir>/**'],
  ['<workspaceDir>/**/'],
  ['./packages/d/**'],
  ['./packages/d/**/'],
  [
    '<workspaceDir>/domain/**',
    '<workspaceDir>/use-cases/**',
    '<workspaceDir>/infra/**',
    '<workspaceDir>/main/**',
    '<workspaceDir>/setup-aliases.js',
  ],
  [
    '<workspaceDir>/domain/**/',
    '<workspaceDir>/use-cases/**/',
    '<workspaceDir>/infra/**/',
    '<workspaceDir>/main/**/',
    '<workspaceDir>/setup-aliases.js',
  ],
  [
    './packages/d/domain/**',
    './packages/d/use-cases/**',
    './packages/d/infra/**',
    './packages/d/main/**',
    './packages/d/setup-aliases.js',
  ],
  [
    './packages/d/domain/**/',
    './packages/d/use-cases/**/',
    './packages/d/infra/**/',
    './packages/d/main/**/',
    './packages/d/setup-aliases.js',
  ],
];

const ignoreMatchers = [
  '!<workspaceDir>/**/package.json',
  '!<workspaceDir>/**/node_modules/**',
  '!<workspaceDir>/**/package-lock.json',
];

describe('inDirectories.should.onlyDependsOn scenarios (module-alias sample)', () => {
  describe('Scenario 1: Files with NO dependencies', () => {
    test("domain should only depend on ['inexistent-dependency'] - should PASS (no imports)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectories(['**/domain/**'])
          .should()
          .onlyDependsOn(['inexistent-dependency'])
          .check();
      }
    });
  });

  describe('Scenario 2: Files have dependencies but NONE match the patterns', () => {
    test("use-cases should only depend on ['**/infra/**'] - should FAIL (imports from domain)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/use-cases/**'])
            .should()
            .onlyDependsOn(['**/infra/**'])
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**]' should only depends on '[**/infra/**]'`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/GetAllTodos.js'`);
        }
      }
    });
  });

  describe('Scenario 3: Files depend exclusively on SOME of the allowed patterns', () => {
    test("use-cases should only depend on ['**/domain/**', 'uuid'] - should PASS (subset)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectories(['**/use-cases/**'])
          .should()
          .onlyDependsOn(['**/domain/**', 'uuid'])
          .check();
      }
    });
  });

  describe('Scenario 4: Files depend exclusively on ALL allowed patterns', () => {
    test("infra + use-cases should only depend on ['**/domain/**'] - should PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectories(['**/infra/**', '**/use-cases/**'])
          .should()
          .onlyDependsOn(['**/domain/**'])
          .check();
      }
    });
  });

  describe('Scenario 5: Files include extra non-matching dependencies', () => {
    test("main should only depend on ['**/use-cases/**', '**/domain/**'] - should FAIL (has other deps)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/main/**'])
            .should()
            .onlyDependsOn(['**/use-cases/**', '**/domain/**'])
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/main/**]' should only depends on '[**/use-cases/**, **/domain/**]'`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty array should throw error (no patterns provided)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/d',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);

          await appInstance
            .projectFiles()
            .inDirectories(['**/domain/**'])
            .should()
            .onlyDependsOn([])
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**]' should only depends on '[]'`,
          );
          expect(errorMessage).toContain('No pattern was provided for checking');
        }
      }
    });

    test('array with empty string should throw error', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/d',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);

          await appInstance
            .projectFiles()
            .inDirectories(['**/domain/**'])
            .should()
            .onlyDependsOn(['uuid', ''])
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**]' should only depends on '[uuid, ]'`,
          );
          expect(errorMessage).toContain('No pattern was provided for checking');
        }
      }
    });

    test('incorrect extension type should show mismatch entries', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.ts'], // Looking for TS in JS project
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/infra/**'])
            .should()
            .onlyDependsOn(['**/domain/**'])
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/infra/**]' should only depends on '[**/domain/**]'`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/domain/repositories/TodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/main/app.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/CreateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });
  });
});
