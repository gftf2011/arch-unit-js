import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-clean-decorators',
);

const includeMatchers: string[][] = [
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
  '!<rootDir>/**/package-lock.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/webpack.config.js',
  '!<rootDir>/**/webpack2.config.js',
  '!<rootDir>/**/babel.config.json',
  '!<rootDir>/**/index.html',
];

const webpacks = [
  {
    webpack: {
      path: '<rootDir>/webpack.config.js',
    },
  },
  {
    webpack: {
      path: '<rootDir>/webpack2.config.js',
      names: ['app'],
    },
  },
];

describe('inFiles.should.onlyHaveName scenarios (vanilla JS decorators sample)', () => {
  describe('Scenario 1: NONE match in the selection (FAIL)', () => {
    test("['use-cases/CreateTodo.js','use-cases/GetAllTodos.js'] should only have name '*UseCase.js' - FAIL (none match)", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            extensionTypes: ['**/*.js'],
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
              .onlyHaveName('*UseCase.js')
              .check();

            // If we get here, the test should fail
            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js, **/use-cases/GetAllTodos.js]' should only have name '*UseCase.js'\n\n`,
            );
            expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
            expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          }
        }
      }
    });
  });

  describe('Scenario 2: SOME match in the selection (FAIL)', () => {
    test("['use-cases/CreateTodo.js','main/index.js'] should only have name '*Todo*.js' - FAIL (some match)", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/use-cases/CreateTodo.js', '**/main/index.js'])
              .should()
              .onlyHaveName('*Todo*.js')
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js, **/main/index.js]' should only have name '*Todo*.js'\n\n`,
            );
            expect(errorMessage).toContain(`- '${rootDir}/main/index.js'`);
          }
        }
      }
    });
  });

  describe('Scenario 3: ALL match in the selection (PASS)', () => {
    test("['main/index.js'] should only have name 'index.js' - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
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
            .onlyHaveName('index.js')
            .check();
        }
      }
    });

    test("['use-cases/CreateTodo.js','use-cases/GetAllTodos.js'] should only have name '*Todo*.js' - PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inFiles(['**/use-cases/CreateTodo.js', '**/use-cases/GetAllTodos.js'])
            .should()
            .onlyHaveName('*Todo*.js')
            .check();
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty pattern should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
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
              .onlyHaveName('')
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/use-cases/CreateTodo.js]' should only have name ''\n\n`,
            );
            expect(errorMessage).toContain(`No pattern was provided for checking`);
          }
        }
      }
    });

    test('incorrect extension types should FAIL with mismatch details', async () => {
      for (const includeMatcher of includeMatchers) {
        for (const { webpack } of webpacks) {
          const options: Options = {
            extensionTypes: ['**/*.ts'], // expect TypeScript pattern in JS sample
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
            webpack,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          try {
            await appInstance
              .projectFiles()
              .inFiles(['**/domain/Todo.js'])
              .should()
              .onlyHaveName('*Todo.js')
              .check();

            expect(1).toBe(2);
          } catch (error) {
            const errorMessage = (error as Error).message;

            expect(errorMessage).toContain(
              `Violation - Rule: project files in files '[**/domain/Todo.js]' should only have name '*Todo.js'\n\n`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/domain/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/infra/InMemoryTodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/main/index.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/use-cases/CreateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
            expect(errorMessage).toContain(
              `- '${rootDir}/use-cases/Service.js' - mismatch in 'extensionTypes': [**/*.ts]`,
            );
          }
        }
      }
    });
  });
});
