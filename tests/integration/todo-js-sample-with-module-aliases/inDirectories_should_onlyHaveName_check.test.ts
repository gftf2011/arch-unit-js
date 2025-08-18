import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-sample-with-module-aliases',
);

const includeMatchers: string[][] = [
  ['<rootDir>/**'],
  ['<rootDir>/**/'],
  ['./**'],
  ['./**/'],
  [
    '<rootDir>/domain/**',
    '<rootDir>/use-cases/**',
    '<rootDir>/infra/**',
    '<rootDir>/main/**',
    '<rootDir>/setup-aliases.js',
  ],
  [
    '<rootDir>/domain/**/',
    '<rootDir>/use-cases/**/',
    '<rootDir>/infra/**/',
    '<rootDir>/main/**/',
    '<rootDir>/setup-aliases.js',
  ],
  ['./domain/**', './use-cases/**', './infra/**', './main/**', './setup-aliases.js'],
  ['./domain/**/', './use-cases/**/', './infra/**/', './main/**/', './setup-aliases.js'],
];

const ignoreMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
];

describe('inDirectories.should.onlyHaveName scenarios (module-alias sample)', () => {
  describe('Scenario 1: Union has files but NONE match the pattern (FAIL)', () => {
    test("use-cases + infra should only have name '*UseCase.js' - should FAIL (none match)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/use-cases/**', '**/infra/repositories/**'])
            .should()
            .onlyHaveName('*UseCase.js')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/infra/repositories/**]' should only have name '*UseCase.js'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });
  });

  describe('Scenario 2: Union has files and SOME match the pattern (FAIL)', () => {
    test("use-cases + main should only have name '*Todo*.js' - should FAIL (some match)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/use-cases/**', '**/main/**'])
            .should()
            .onlyHaveName('*Todo*.js')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/main/**]' should only have name '*Todo*.js'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
          expect(errorMessage).not.toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).not.toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
        }
      }
    });

    test("infra + main should only have name '*Repository.js' - should FAIL (some match)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/infra/repositories/**', '**/main/**'])
            .should()
            .onlyHaveName('*Repository.js')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/infra/repositories/**, **/main/**]' should only have name '*Repository.js'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
          expect(errorMessage).not.toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });
  });

  describe('Scenario 3: Union has files and ALL files match the pattern (PASS)', () => {
    test("use-cases + domain entities should only have name '*Todo*.js' - should PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectories(['**/use-cases/**', '**/domain/entities/**'])
          .should()
          .onlyHaveName('*Todo*.js')
          .check();
      }
    });

    test("use-cases + infra + domain entities should only have name '*.js' - should PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectories(['**/use-cases/**', '**/domain/entities/**', '**/infra/**'])
          .should()
          .onlyHaveName('*.js')
          .check();
      }
    });

    test("main should only have name 'app.js' - should PASS", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectories(['**/main/**'])
          .should()
          .onlyHaveName('app.js')
          .check();
      }
    });
  });

  describe('Edge scenarios', () => {
    test("domain + use-cases should only have name '' - should FAIL (empty pattern)", async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inDirectories(['**/domain/**', '**/use-cases/**'])
            .should()
            .onlyHaveName('')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**, **/use-cases/**]' should only have name ''`,
          );
          expect(errorMessage).toContain('No pattern was provided for checking');
        }
      }
    });

    test('incorrect extension', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/use-cases/**', '**/domain/entities/**'])
            .should()
            .onlyHaveName('*Todo*.js')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/domain/entities/**]' should only have name '*Todo*.js'`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/CreateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });

    test("use-cases should only have name 'Create*.js' - should FAIL (some match)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/use-cases/**'])
            .should()
            .onlyHaveName('Create*.js')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**]' should only have name 'Create*.js'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).not.toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
        }
      }
    });
  });
});
