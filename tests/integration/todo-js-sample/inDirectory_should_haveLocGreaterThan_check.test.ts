import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample');

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

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('should.haveLocGreaterThan scenarios', () => {
  describe('Scenario 1: All files have lines of code GREATER than the threshold', () => {
    test('"use-cases" should have LOC greater than 5 - should PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**')
          .should()
          .haveLocGreaterThan(5)
          .check();
      }
    });

    test('"use-cases" should have LOC greater than 10, ignoring "use-cases/GetAllTodos.js" - should PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**', ['!**/use-cases/GetAllTodos.js'])
          .should()
          .haveLocGreaterThan(10)
          .check();
      }
    });

    test('"entities" should have LOC greater than 8 - should PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/entities/**')
          .should()
          .haveLocGreaterThan(8)
          .check();
      }
    });

    test('"domain" should have LOC greater than 10 - should PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/domain/**')
          .should()
          .haveLocGreaterThan(10)
          .check();
      }
    });

    test('"infra" should have LOC greater than 12 - should PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/infra/**')
          .should()
          .haveLocGreaterThan(12)
          .check();
      }
    });
  });

  describe('Scenario 2: ANY files have lines of code LESS than or EQUAL to the threshold', () => {
    test('"use-cases" should have LOC greater than 25 - should FAIL (some files at or below threshold)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .should()
            .haveLocGreaterThan(25)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should have L.O.C. greater than: 25\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
        }
      }
    });

    test('"domain" should have LOC greater than 25 - should FAIL (multiple files at or below threshold)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .should()
            .haveLocGreaterThan(25)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should have L.O.C. greater than: 25\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
        }
      }
    });

    test('entire project should have LOC greater than 20 - should FAIL (some files at or below threshold)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**')
            .should()
            .haveLocGreaterThan(20)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**' should have L.O.C. greater than: 20\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
        }
      }
    });

    test('"domain/entities" should have LOC greater than exact Todo.js LOC count - should FAIL (boundary case)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/entities/**')
            .should()
            .haveLocGreaterThan(22)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/entities/**' should have L.O.C. greater than: 22\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('projectFiles.inDirectory("**/nonexistent/**").should().haveLocGreaterThan(10).check() - should throw error (no files exist)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: excludeMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);

          await appInstance
            .projectFiles()
            .inDirectory('**/nonexistent/**')
            .should()
            .haveLocGreaterThan(10)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/nonexistent/**' should have L.O.C. greater than: 10\n\n`,
          );
          expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
        }
      }
    });

    test('threshold of 0 should always throw error (invalid threshold)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: excludeMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);

          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .should()
            .haveLocGreaterThan(0)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater than: 0\n\n`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('threshold of -1 should always throw error (invalid threshold)', async () => {
      for (const [includeMatcher] of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: excludeMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);

          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .should()
            .haveLocGreaterThan(-1)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater than: -1\n\n`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('very low threshold (1) should always PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance.projectFiles().inDirectory('**').should().haveLocGreaterThan(1).check();
      }
    });

    test('incorrect extension', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'], // Looking for TypeScript in JavaScript project
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .should()
            .haveLocGreaterThan(10)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater than: 10\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/repositories/TodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/main/app.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/CreateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/DeleteTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/GetTodoById.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/UpdateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });
  });
});
