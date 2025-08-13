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
  [['./domain/**/', './use-cases/**/', './infra/**/', './main/**/']],
];

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('should.onlyHaveName scenarios', () => {
  describe('Scenario 1: Directory has files but NONE match the pattern', () => {
    test('"entities" should only have name "*UseCase.js" - should FAIL', async () => {
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
            .inDirectory('**/entities/**')
            .should()
            .onlyHaveName('*UseCase.js')
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should only have name '*UseCase.js'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
        }
      }
    });

    test('"infra repositories" should only have name "*Entity.js" - should FAIL', async () => {
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
            .inDirectory('**/infra/repositories/**')
            .should()
            .onlyHaveName('*Entity.js')
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/repositories/**' should only have name '*Entity.js'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });
  });

  describe('Scenario 2: Directory has files and SOME match the pattern', () => {
    test('"use-cases" should only have name "*Todo.js" - should FAIL', async () => {
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
            .onlyHaveName('*Todo.js')
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should only have name '*Todo.js'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
        }
      }
    });

    test('"use-cases" should only have name "Get*.js" - should FAIL', async () => {
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
            .onlyHaveName('Get*.js')
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should only have name 'Get*.js'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
        }
      }
    });
  });

  describe('Scenario 3: Directory has files and ALL files match the pattern', () => {
    test('"entities" should only have name "*Todo.js" - should PASS', async () => {
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
          .onlyHaveName('*Todo.js')
          .check();
      }
    });

    test('"entities" should only have name "*.js" - should PASS', async () => {
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
          .onlyHaveName('*.js')
          .check();
      }
    });

    test('"infra repositories" should only have name "*Repository.js" - should PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/infra/repositories/**')
          .should()
          .onlyHaveName('*Repository.js')
          .check();
      }
    });

    test('"main" should only have name "app.js" - should PASS', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectory('**/main/**')
          .should()
          .onlyHaveName('app.js')
          .check();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('projectFiles.inDirectory("**/domain/**").should().onlyHaveName("").check() - should FAIL (empty pattern)', async () => {
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
            .inDirectory('**/domain/**')
            .should()
            .onlyHaveName('')
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should only have name ''\n\n`,
          );
          expect(errorMessage).toContain(`No pattern was provided for checking`);
        }
      }
    });

    test('incorrect extension', async () => {
      for (const [includeMatcher] of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/entities/**')
            .should()
            .onlyHaveName('*Todo.js')
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/entities/**' should only have name '*Todo.js'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });
  });
});
