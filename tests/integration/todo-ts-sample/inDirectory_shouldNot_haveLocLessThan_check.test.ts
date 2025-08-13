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

describe('shouldNot.haveLocLessThan scenarios', () => {
  describe('Scenario 1: All files have lines of code GREATER than or EQUAL to the threshold', () => {
    test('"use-cases" should not have LOC less than 5 - should PASS', async () => {
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
          .haveLocLessThan(5)
          .check();
      }
    });

    test('"entities" should not have LOC less than 1 - should PASS', async () => {
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
          .haveLocLessThan(1)
          .check();
      }
    });

    test('"domain" should not have LOC less than 1 - should PASS', async () => {
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
          .inDirectory('**/domain/**')
          .shouldNot()
          .haveLocLessThan(1)
          .check();
      }
    });

    test('entire project should not have LOC less than 1 - should PASS (index.ts equals threshold)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance.projectFiles().inDirectory('**').shouldNot().haveLocLessThan(1).check();
      }
    });

    test('"infra" should not have LOC less than 30 - should PASS', async () => {
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
          .shouldNot()
          .haveLocLessThan(30)
          .check();
      }
    });
  });

  describe('Scenario 2: ANY files have lines of code LESS than the threshold', () => {
    test('"use-cases" should not have LOC less than 10 - should FAIL (GetAllTodos.ts and index.ts below threshold)', async () => {
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
            .shouldNot()
            .haveLocLessThan(10)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not have L.O.C. less than: 10\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
        }
      }
    });

    test('"use-cases" should not have LOC less than 20 - should FAIL (multiple files below threshold)', async () => {
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
            .shouldNot()
            .haveLocLessThan(20)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not have L.O.C. less than: 20\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
        }
      }
    });

    test('"entities" should not have LOC less than 30 - should FAIL (Todo.ts below threshold)', async () => {
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
            .inDirectory('**/entities/**')
            .shouldNot()
            .haveLocLessThan(30)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. less than: 30\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
        }
      }
    });

    test('"domain" should not have LOC less than 40 - should FAIL (all files below threshold)', async () => {
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
            .inDirectory('**/domain/**')
            .shouldNot()
            .haveLocLessThan(40)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should not have L.O.C. less than: 40\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
        }
      }
    });

    test('entire project should not have LOC less than 50 - should FAIL (all files below threshold)', async () => {
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
            .inDirectory('**')
            .shouldNot()
            .haveLocLessThan(50)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**' should not have L.O.C. less than: 50\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
        }
      }
    });

    test('"main" should not have LOC less than 41 - should FAIL (app.ts below threshold)', async () => {
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
            .haveLocLessThan(41)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not have L.O.C. less than: 41\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('projectFiles.inDirectory("**/nonexistent/**").shouldNot().haveLocLessThan(10).check() - should throw error (no files exist)', async () => {
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
            .inDirectory('**/nonexistent/**')
            .shouldNot()
            .haveLocLessThan(10)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/nonexistent/**' should not have L.O.C. less than: 10\n\n`,
          );
          expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
        }
      }
    });

    test('threshold of 0 should always throw error (invalid threshold)', async () => {
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
            .inDirectory('**/entities/**')
            .shouldNot()
            .haveLocLessThan(0)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. less than: 0\n\n`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('threshold of -1 should always throw error (invalid threshold)', async () => {
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
            .inDirectory('**/entities/**')
            .shouldNot()
            .haveLocLessThan(-1)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. less than: -1\n\n`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('very low threshold should always PASS (threshold of 1)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance.projectFiles().inDirectory('**').shouldNot().haveLocLessThan(1).check();
      }
    });

    test('incorrect extension', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'], // Looking for JavaScript in TypeScript project
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
          typescriptPath,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .shouldNot()
            .haveLocLessThan(10)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. less than: 10\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/Todo.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/index.ts' - mismatch in 'extensionTypes': [**/*.js]`,
          );
        }
      }
    });
  });
});
