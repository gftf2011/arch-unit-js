import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample');

const includeMatchers = [
  ['<rootDir>/**'],
  ['<rootDir>/**/'],
  ['./**'],
  ['./**/'],
  ['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**', '<rootDir>/main/**'],
  ['<rootDir>/domain/**/', '<rootDir>/use-cases/**/', '<rootDir>/infra/**/', '<rootDir>/main/**/'],
  ['./domain/**', './use-cases/**', './infra/**', './main/**'],
  ['./domain/**/', './use-cases/**/', './infra/**/', './main/**/'],
];

const ignoreMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
  '!<rootDir>/**/tsconfig.json',
];

const typescriptPath = '<rootDir>/tsconfig.json';

describe('shouldNot.haveLocGreaterThan scenarios', () => {
  describe('Scenario 1: All files have lines of code LESS than or EQUAL to the threshold', () => {
    test('"entities" should not have LOC greater than 50 - should PASS (all files <= 50)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/entities/**')
          .shouldNot()
          .haveLocGreaterThan(50)
          .check();
      }
    });

    test('"use-cases" should not have LOC greater than 50 - should PASS (all files <= 50)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**')
          .shouldNot()
          .haveLocGreaterThan(50)
          .check();
      }
    });

    test('"domain" should not have LOC greater than 30 - should PASS (all files <= 30)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/domain/**')
          .shouldNot()
          .haveLocGreaterThan(30)
          .check();
      }
    });

    test('"main" should not have LOC greater than 40 - should PASS (app.ts has exactly 40 LOC)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/main/**')
          .shouldNot()
          .haveLocGreaterThan(40)
          .check();
      }
    });

    test('"infra" should not have LOC greater than 32 - should PASS (InMemoryTodoRepository.ts has exactly 32 LOC)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/infra/**')
          .shouldNot()
          .haveLocGreaterThan(32)
          .check();
      }
    });

    test('"use-cases" excluding UpdateTodo.ts should not have LOC greater than 20 - should PASS (all remaining files <= 20)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**', ['!**/use-cases/UpdateTodo.ts'])
          .shouldNot()
          .haveLocGreaterThan(20)
          .check();
      }
    });

    test('entire project should not have LOC greater than 100 - should PASS (all files <= 100)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**')
          .shouldNot()
          .haveLocGreaterThan(100)
          .check();
      }
    });

    test('"entities" should not have LOC greater than 28 - should PASS (Todo.ts has exactly 28 LOC)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/entities/**')
          .shouldNot()
          .haveLocGreaterThan(28)
          .check();
      }
    });
  });

  describe('Scenario 2: ANY files have lines of code GREATER than the threshold', () => {
    test('"use-cases" should not have LOC greater than 42 - should FAIL (UpdateTodo.ts has 43 LOC)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .shouldNot()
            .haveLocGreaterThan(42)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not have L.O.C. greater than: 42\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
        }
      }
    });

    test('"main" should not have LOC greater than 39 - should FAIL (app.ts has 40 LOC)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/main/**')
            .shouldNot()
            .haveLocGreaterThan(39)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not have L.O.C. greater than: 39\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
        }
      }
    });

    test('"infra" should not have LOC greater than 31 - should FAIL (InMemoryTodoRepository.ts has 32 LOC)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .shouldNot()
            .haveLocGreaterThan(31)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should not have L.O.C. greater than: 31\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`,
          );
        }
      }
    });

    test('"entities" should not have LOC greater than 27 - should FAIL (Todo.ts has 28 LOC)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .shouldNot()
            .haveLocGreaterThan(27)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. greater than: 27\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
        }
      }
    });

    test('"domain" should not have LOC greater than 20 - should FAIL (multiple files > 20)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .haveLocGreaterThan(20)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should not have L.O.C. greater than: 20\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
        }
      }
    });

    test('entire project should not have LOC greater than 30 - should FAIL (multiple files > 30)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**')
            .shouldNot()
            .haveLocGreaterThan(30)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**' should not have L.O.C. greater than: 30\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
        }
      }
    });

    test('"use-cases" should not have LOC greater than 15 - should FAIL (multiple files > 15)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .shouldNot()
            .haveLocGreaterThan(15)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not have L.O.C. greater than: 15\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
        }
      }
    });

    test('"use-cases" should not have LOC greater than 7 - should FAIL (multiple files > 7)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .shouldNot()
            .haveLocGreaterThan(7)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not have L.O.C. greater than: 7\n\n`,
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
    test('projectFiles.inDirectory("**/nonexistent/**").shouldNot().haveLocGreaterThan(10).check() - should throw error (no files exist)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.ts'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            typescriptPath,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);

          await appInstance
            .projectFiles()
            .inDirectory('**/nonexistent/**')
            .shouldNot()
            .haveLocGreaterThan(10)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/nonexistent/**' should not have L.O.C. greater than: 10\n\n`,
          );
          expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
        }
      }
    });

    test('threshold of 0 should always throw error (invalid threshold)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.ts'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            typescriptPath,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);

          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .shouldNot()
            .haveLocGreaterThan(0)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. greater than: 0\n\n`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('threshold of -1 should always throw error (invalid threshold)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.ts'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            typescriptPath,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);

          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .shouldNot()
            .haveLocGreaterThan(-1)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. greater than: -1\n\n`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('very high threshold (1000) should always PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**')
          .shouldNot()
          .haveLocGreaterThan(1000)
          .check();
      }
    });

    test('boundary case: threshold equal to largest file LOC should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**')
          .shouldNot()
          .haveLocGreaterThan(43) // UpdateTodo.ts has exactly 43 LOC
          .check();
      }
    });

    test('boundary case: threshold one less than largest file LOC should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .shouldNot()
            .haveLocGreaterThan(42) // UpdateTodo.ts has 43 LOC
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not have L.O.C. greater than: 42\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
        }
      }
    });

    test('incorrect extension', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'], // Looking for JavaScript in TypeScript project
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .shouldNot()
            .haveLocGreaterThan(10)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. greater than: 10\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/Todo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/index.ts' - mismatch in 'extensionTypes': [**/*.js]`,
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
