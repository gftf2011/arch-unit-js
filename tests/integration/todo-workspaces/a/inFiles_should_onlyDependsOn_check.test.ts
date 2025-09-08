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
  'a',
);

const includeMatchers: string[][] = [
  ['<workspaceDir>/**'],
  ['<workspaceDir>/**/'],
  ['./packages/a/**'],
  ['./packages/a/**/'],
  [
    '<workspaceDir>/domain/**',
    '<workspaceDir>/use-cases/**',
    '<workspaceDir>/infra/**',
    '<workspaceDir>/main/**',
  ],
  [
    '<workspaceDir>/domain/**/',
    '<workspaceDir>/use-cases/**/',
    '<workspaceDir>/infra/**/',
    '<workspaceDir>/main/**/',
  ],
  [
    './packages/a/domain/**',
    './packages/a/use-cases/**',
    './packages/a/infra/**',
    './packages/a/main/**',
  ],
  [
    './packages/a/domain/**/',
    './packages/a/use-cases/**/',
    './packages/a/infra/**/',
    './packages/a/main/**/',
  ],
];

const ignoreMatchers = [
  '!<workspaceDir>/**/package.json',
  '!<workspaceDir>/**/package-lock.json',
  '!<workspaceDir>/**/node_modules/**',
  '!<workspaceDir>/**/webpack.config.js',
  '!<workspaceDir>/**/webpack2.config.js',
  '!<workspaceDir>/**/babel.config.json',
  '!<workspaceDir>/**/index.html',
];

const webpacks = [
  {
    webpack: {
      path: '<workspaceDir>/webpack.config.js',
    },
  },
  {
    webpack: {
      path: '<workspaceDir>/webpack2.config.js',
      names: ['app'],
    },
  },
];

describe('inFiles.should.onlyDependsOn scenarios (vanilla JS decorators sample)', () => {
  describe('Scenario 1: Selected files have NO dependencies (PASS)', () => {
    test("['domain/Todo.js','infra/InMemoryTodoRepository.js'] should only depend on 'domain' - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/a',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inFiles(['**/domain/Todo.js', '**/infra/InMemoryTodoRepository.js'])
            .should()
            .onlyDependsOn(['**/domain/**'])
            .check();
        }
      }
    });
  });

  describe('Scenario 2: Files have dependencies but NONE match the patterns (FAIL)', () => {
    test("['use-cases/CreateTodo.js'] should only depend on 'infra' - FAIL", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/a',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/use-cases/CreateTodo.js'])
              .should()
              .onlyDependsOn(['**/infra/**'])
              .check();

            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should only depends on '[**/infra/**]'\n\n`,
            );
            expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/CreateTodo.js'`);
          }
        }
      }
    });
  });

  describe('Scenario 3: Files depend exclusively on SOME of the allowed patterns (PASS)', () => {
    test("['use-cases/CreateTodo.js'] should only depend on 'domain' and 'use-cases' - PASS (subset)", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/a',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inFiles(['**/use-cases/CreateTodo.js'])
            .should()
            .onlyDependsOn(['**/domain/**', '**/use-cases/**'])
            .check();
        }
      }
    });
  });

  describe('Scenario 4: Files depend exclusively on ALL allowed patterns (PASS)', () => {
    test("['main/index.js'] should only depend on 'use-cases' and 'infra' - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/a',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inFiles(['**/main/index.js'])
            .should()
            .onlyDependsOn(['**/use-cases/**', '**/infra/**'])
            .check();
        }
      }
    });
  });

  describe('Scenario 5: Files have dependencies with additional non-matching dependencies (FAIL)', () => {
    test("['main/index.js'] should only depend on 'use-cases' - FAIL (has 'infra' too)", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/a',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/main/index.js'])
              .should()
              .onlyDependsOn(['**/use-cases/**'])
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/main/index.js]' should only depends on '[**/use-cases/**]'\n\n`,
            );
            expect(errorMessage).toContain(`- '${workspaceDir}/main/index.js'`);
          }
        }
      }
    });

    test("['use-cases/CreateTodo.js','use-cases/GetAllTodos.js'] should only depend on 'infra' - FAIL (only 'use-cases')", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/a',
            extensionTypes: ['**/*.ts'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/use-cases/CreateTodo.js', '**/use-cases/GetAllTodos.js'])
              .should()
              .onlyDependsOn(['**/infra/**'])
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js, **/use-cases/GetAllTodos.js]' should only depends on '[**/infra/**]'\n\n`,
            );
            expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/CreateTodo.js'`);
            expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/GetAllTodos.js'`);
          }
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty selection should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/a',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles([])
              .should()
              .onlyDependsOn(['**/use-cases/**'])
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[]' should only depends on '[**/use-cases/**]'\n\n`,
            );
            expect(errorMessage).toContain(`No pattern was provided for checking`);
          }
        }
      }
    });

    test('array with empty string pattern should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            workspaceDir: '<rootDir>/packages/a',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/main/index.js'])
              .should()
              .onlyDependsOn(['**/infra/**', ''])
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/main/index.js]' should only depends on '[**/infra/**, ]'\n\n`,
            );
            expect(errorMessage).toContain(`No pattern was provided for checking`);
          }
        }
      }
    });
  });
});
