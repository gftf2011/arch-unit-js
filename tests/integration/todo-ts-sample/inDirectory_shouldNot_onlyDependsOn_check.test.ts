import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample');

const includeMatchers = [
  [['<rootDir>/**']],
  [['<rootDir>/**/']],
  [['./**']],
  [['./**/']],
  [['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**', '<rootDir>/main/**']],
  [
    [
      '<rootDir>/domain/**/',
      '<rootDir>/use-cases/**/',
      '<rootDir>/infra/**/',
      '<rootDir>/main/**/',
    ],
  ],
  [['./domain/**', './use-cases/**', './infra/**', './main/**']],
  [['./domain/**/', './use-cases/**/', './infra/**', './main/**/']],
];

const excludeMatchers = ['!<rootDir>/**/package.json', '!<rootDir>/**/tsconfig.json'];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('shouldNot.onlyDependsOn scenarios', () => {
  describe('Scenario 1: File has NO dependencies', () => {
    test('"domain/entities" should not only depend on "domain" - should PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
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
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
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

    test('"use-cases" should not only depend on "main" - should PASS (none match)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**')
          .shouldNot()
          .onlyDependsOn(['**/main/**'])
          .check();
      }
    });
  });

  describe('Scenario 3: File has mixed dependencies', () => {
    test('"main" should not only depend on "domain" - should PASS (has mixed dependencies)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
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
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
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

    test('"main" should not only depend on "use-cases" - should PASS (has mixed dependencies)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/main/**')
          .shouldNot()
          .onlyDependsOn(['**/use-cases/**'])
          .check();
      }
    });
  });

  describe('Scenario 4: File has exclusive dependencies to specified patterns', () => {
    test('"infra" should not only depend on "domain" and "pg" - should FAIL', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .shouldNot()
            .onlyDependsOn(['**/domain/**', 'pg'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should not only depends on '[**/domain/**, pg]'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`,
          );
        }
      }
    });

    test('"main" should not only depend on "domain", "use-cases" and "infra" and "uuid" - should FAIL', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/main/**')
            .shouldNot()
            .onlyDependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**', 'uuid'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not only depends on '[**/domain/**, **/use-cases/**, **/infra/**, uuid]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
        }
      }
    });

    test('"use-cases" excluding "index.ts" should not only depend on "domain" and "uuid" - should FAIL', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**', ['!**/index.ts'])
            .shouldNot()
            .onlyDependsOn(['**/domain/**', 'uuid'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' - excluding files [!**/index.ts] , should not only depends on '[**/domain/**, uuid]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('projectFiles.inDirectory("**/domain/**").shouldNot().onlyDependsOn([]).check() - should FAIL (empty array)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.ts'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: excludeMatchers,
            typescriptPath,
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

    test('projectFiles.inDirectory("**/domain/**").shouldNot().onlyDependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.ts'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: excludeMatchers,
            typescriptPath,
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
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
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
            `- '${rootDir}/domain/entities/Todo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/repositories/TodoRepository.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/main/app.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/CreateTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/DeleteTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/GetAllTodos.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/GetTodoById.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/UpdateTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/index.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
        }
      }
    });
  });
});
