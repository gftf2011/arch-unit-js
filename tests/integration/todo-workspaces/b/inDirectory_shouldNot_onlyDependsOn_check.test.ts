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
  'b',
);

const includeMatchers = [
  ['<rootDir>/packages/b/**'],
  ['<rootDir>/packages/b/**/'],
  ['./packages/b/**'],
  ['./packages/b/**/'],
  [
    '<rootDir>/packages/b/domain/**',
    '<rootDir>/packages/b/use-cases/**',
    '<rootDir>/packages/b/infra/**',
    '<rootDir>/packages/b/main/**',
  ],
  [
    '<rootDir>/packages/b/domain/**/',
    '<rootDir>/packages/b/use-cases/**/',
    '<rootDir>/packages/b/infra/**/',
    '<rootDir>/packages/b/main/**/',
  ],
  [
    './packages/b/domain/**',
    './packages/b/use-cases/**',
    './packages/b/infra/**',
    './packages/b/main/**',
  ],
  [
    './packages/b/domain/**/',
    './packages/b/use-cases/**/',
    './packages/b/infra/**/',
    './packages/b/main/**/',
  ],
];

const ignoreMatchers = [
  '!<rootDir>/packages/b/**/package.json',
  '!<rootDir>/packages/b/**/node_modules/**',
  '!<rootDir>/packages/b/**/package-lock.json',
];

describe('shouldNot.onlyDependsOn scenarios', () => {
  describe('Scenario 1: File has NO dependencies', () => {
    test('"domain/entities" should not only depend on "domain" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/entities/**')
          .shouldNot()
          .onlyDependsOn(['**/domain/**'])
          .check();
      }
    });
  });

  describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
    test('"use-cases" should not only depend on "infra" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**')
          .shouldNot()
          .onlyDependsOn(['**/infra/**'])
          .check();
      }
    });
  });

  describe('Scenario 3: File has mixed dependencies', () => {
    test('"main" should not only depend on "domain" - should PASS (has mixed dependencies)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/main/**')
          .shouldNot()
          .onlyDependsOn(['**/domain/**'])
          .check();
      }
    });

    test('"main" should not only depend on "domain" and "use-cases" - should PASS (has mixed dependencies)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/main/**')
          .shouldNot()
          .onlyDependsOn(['**/domain/**', '**/use-cases/**'])
          .check();
      }
    });
  });

  describe('Scenario 4: File has exclusive dependencies to specified patterns', () => {
    test('"infra" should not only depend on "domain" - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .shouldNot()
            .onlyDependsOn(['**/domain/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should not only depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });

    test('"main" should not only depend on "domain" and "use-cases" and "infra" - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/main/**')
            .shouldNot()
            .onlyDependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not only depends on '[**/domain/**, **/use-cases/**, **/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('projectFiles.inDirectory("**/domain/**").should().onlyDependsOn([]).check() - should FAIL (empty array)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            workspaceDir: './packages/b',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .onlyDependsOn([])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should not only depends on '[]'\n\n`,
          );
          expect(errorMessage).toContain(`No pattern was provided for checking`);
        }
      }
    });

    test('projectFiles.inDirectory("**/domain/**").should().onlyDependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            workspaceDir: './packages/b',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .onlyDependsOn(['uuid', ''])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should not only depends on '[uuid, ]'\n\n`,
          );
          expect(errorMessage).toContain(`No pattern was provided for checking`);
        }
      }
    });

    test('incorrect extension', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .shouldNot()
            .onlyDependsOn(['**/domain/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should not only depends on '[**/domain/**]'\n\n`,
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
            `- '${workspaceDir}/use-cases/DeleteTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/GetTodoById.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/UpdateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });

    test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
      const options: Options = {
        workspaceDir: './packages/b',
        extensionTypes: ['**/*.js'],
        includeMatcher: ['<rootDir>/packages/b/infra/**'],
        ignoreMatcher: ignoreMatchers,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      try {
        await appInstance
          .projectFiles()
          .inDirectory('**/domain/**')
          .shouldNot()
          .onlyDependsOn(['**/infra/**'])
          .check();

        // If we get here, the test should fail
        expect(1).toBe(2);
      } catch (error) {
        const errorMessage = (error as Error).message;

        expect(errorMessage).toContain(
          `Violation - Rule: project files in directory '**/domain/**' should not only depends on '[**/infra/**]'\n\n`,
        );
        expect(errorMessage).toContain(
          `Check if dependencies in file: '${workspaceDir}/infra/repositories/InMemoryTodoRepository.js' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'`,
        );
        expect(errorMessage).toContain(`- '../../domain/repositories/TodoRepository'`);
      }
    });
  });
});
