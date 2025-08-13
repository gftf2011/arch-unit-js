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
  [['./domain/**/', './use-cases/**', './infra/**', './main/**/']],
];

const excludeMatchers = ['!<rootDir>/**/package.json', '!<rootDir>/**/tsconfig.json'];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('should.onlyDependsOn scenarios', () => {
  describe('Scenario 1: File has NO dependencies', () => {
    test('"domain" entities should only depend on "inexistent-dependency" - should PASS', async () => {
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
          .should()
          .onlyDependsOn(['inexistent-dependency'])
          .check();
      }
    });
  });

  describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
    test('"use-cases" should only depend on "infra" - should FAIL', async () => {
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
            .inDirectory('**/use-cases/**')
            .should()
            .onlyDependsOn(['**/infra/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should only depends on '[**/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
        }
      }
    });
  });

  describe('Scenario 3: File has dependencies that match only SOME of the patterns (exclusively)', () => {
    test('"use-cases" should only depend on "domain" and "uuid" excluding "index.ts" - should PASS ("domain" is a subset)', async () => {
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
          .inDirectory('**/use-cases/**', ['!**/index.ts', '!**/use-cases/Create*'])
          .should()
          .onlyDependsOn(['**/domain/**', 'uuid'])
          .check();
      }
    });
  });

  describe('Scenario 4: File has dependencies and ALL patterns are present (exclusively)', () => {
    test('"infra" should only depend on "domain" and "pg" - should PASS', async () => {
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
          .inDirectory('**/infra/**')
          .should()
          .onlyDependsOn(['**/domain/**', 'pg'])
          .check();
      }
    });
  });

  describe('Scenario 5: File has dependencies with additional non-matching dependencies', () => {
    test('"main" should only depend on "domain" and "use-cases" - should FAIL (has "infra" too)', async () => {
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
            .should()
            .onlyDependsOn(['**/use-cases/**', '**/domain/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should only depends on '[**/use-cases/**, **/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('projectFiles.inDirectory("**/domain/**").should().onlyDependsOn([]).check() - should FAIL (empty array)', async () => {
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
            .should()
            .onlyDependsOn([])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should only depends on '[]'\n`,
          );
          expect(errorMessage).toContain(`No pattern was provided for checking`);
        }
      }
    });

    test('projectFiles.inDirectory("**/domain/**").should().onlyDependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
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
            .should()
            .onlyDependsOn(['uuid', ''])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should only depends on '[uuid, ]'\n\n`,
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
            .should()
            .onlyDependsOn(['**/domain/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should only depends on '[**/domain/**]'\n\n`,
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
