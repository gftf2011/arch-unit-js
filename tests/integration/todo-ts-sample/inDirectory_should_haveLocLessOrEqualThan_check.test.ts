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

describe('should.haveLocLessOrEqualThan scenarios', () => {
  describe('Scenario 1: All files have lines of code LESS than or EQUAL to the threshold', () => {
    test('"use-cases" should have LOC less or equal than 50 - should PASS', async () => {
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
          .should()
          .haveLocLessOrEqualThan(50)
          .check();
      }
    });

    test('"entities" should have LOC less or equal than 30 - should PASS', async () => {
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
          .haveLocLessOrEqualThan(30)
          .check();
      }
    });

    test('"domain" should have LOC less or equal than 40 - should PASS', async () => {
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
          .should()
          .haveLocLessOrEqualThan(40)
          .check();
      }
    });

    test('"use-cases" should have LOC less or equal than exact UpdateTodo.ts LOC count - should PASS (boundary case)', async () => {
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
          .should()
          .haveLocLessOrEqualThan(43)
          .check();
      }
    });

    test('"main" should have LOC less or equal than exact app.ts LOC count - should PASS (boundary case)', async () => {
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
          .should()
          .haveLocLessOrEqualThan(40)
          .check();
      }
    });
  });

  describe('Scenario 2: ANY files have lines of code GREATER than the threshold', () => {
    test('"use-cases" should have LOC less or equal than 25 - should FAIL (UpdateTodo.ts exceeds threshold)', async () => {
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
            .haveLocLessOrEqualThan(25)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should have L.O.C. less or equal than: 25\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
        }
      }
    });

    test('"domain" should have LOC less or equal than 15 - should FAIL (multiple files exceed threshold)', async () => {
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
            .should()
            .haveLocLessOrEqualThan(15)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should have L.O.C. less or equal than: 15\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
        }
      }
    });

    test('entire project should have LOC less or equal than 8 - should FAIL (almost all files exceed threshold)', async () => {
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
            .should()
            .haveLocLessOrEqualThan(8)
            .check();
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**' should have L.O.C. less or equal than: 8\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
        }
      }
    });

    test('"infra" should have LOC less or equal than 20 - should FAIL (InMemoryTodoRepository.ts exceeds threshold)', async () => {
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
            .should()
            .haveLocLessOrEqualThan(20)
            .check();
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should have L.O.C. less or equal than: 20\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`,
          );
        }
      }
    });

    test('"main" should have LOC less or equal than 39 - should FAIL (app.ts exceeds threshold)', async () => {
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
            .haveLocLessOrEqualThan(39)
            .check();
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should have L.O.C. less or equal than: 39\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('projectFiles.inDirectory("**/nonexistent/**").should().haveLocLessOrEqualThan(10).check() - should throw error (no files exist)', async () => {
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
            .should()
            .haveLocLessOrEqualThan(10)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/nonexistent/**' should have L.O.C. less or equal than: 10\n\n`,
          );
          expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
        }
      }
    });

    test('threshold of 0 should always FAIL (no files can have less or equal than 0 LOC)', async () => {
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
            .should()
            .haveLocLessOrEqualThan(0)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should have L.O.C. less or equal than: 0\n\n`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('very high threshold should always PASS', async () => {
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
          .inDirectory('**')
          .should()
          .haveLocLessOrEqualThan(1000)
          .check();
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
            .should()
            .haveLocLessOrEqualThan(50)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should have L.O.C. less or equal than: 50\n\n`,
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
