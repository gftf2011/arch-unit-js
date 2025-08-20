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

describe('inDirectories.should.haveTotalProjectCodeLessThan scenarios (module-alias sample)', () => {
  describe('Scenario 1: UNION SUM of directories bytes < allowed percentage (PASS)', () => {
    test('domain + use-cases should have total project code less than 100% - PASS', async () => {
      for (const includeMatcher of includeMatchers) {
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
          .haveTotalProjectCodeLessThan(1)
          .check();
      }
    });

    test('infra should have total project code less than 90% - PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance
          .projectFiles()
          .inDirectories(['**/infra/**'])
          .should()
          .haveTotalProjectCodeLessThan(0.9)
          .check();
      }
    });

    test('main should have total project code less than 100% - PASS', async () => {
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
          .haveTotalProjectCodeLessThan(1)
          .check();
      }
    });
  });

  describe('Scenario 2: UNION SUM of directories bytes >= allowed percentage (FAIL)', () => {
    test('main should have total project code less than 1% - FAIL', async () => {
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
            .inDirectories(['**/main/**'])
            .should()
            .haveTotalProjectCodeLessThan(0.01)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/main/**]' should have total project code less than: 0.01`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
        }
      }
    });

    test('domain + use-cases should have total project code less than 0.01% - FAIL', async () => {
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
            .inDirectories(['**/domain/**', '**/use-cases/**'])
            .should()
            .haveTotalProjectCodeLessThan(0.0001)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**, **/use-cases/**]' should have total project code less than: 0.0001`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('non-existent directories should throw error (no files found)', async () => {
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
            .inDirectories(['**/nonexistent/**'])
            .should()
            .haveTotalProjectCodeLessThan(0.5)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/nonexistent/**]' should have total project code less than: 0.5`,
          );
          expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
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
            .inDirectories(['**'])
            .should()
            .haveTotalProjectCodeLessThan(0.5)
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**]' should have total project code less than: 0.5`,
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
            `- '${rootDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });

    test('invalid percentage: 0 - should FAIL (invalid input)', async () => {
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
            .inDirectories(['**/domain/**', '**/use-cases/**'])
            .should()
            .haveTotalProjectCodeLessThan(0)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**, **/use-cases/**]' should have total project code less than: 0`,
          );
          expect(errorMessage).toContain(
            `Percentage value must be greater than 0 and less or equal than 1`,
          );
        }
      }
    });

    test('invalid percentage: > 1 - should FAIL (invalid input)', async () => {
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
            .inDirectories(['**/infra/**', '**/main/**'])
            .should()
            .haveTotalProjectCodeLessThan(1.2)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/infra/**, **/main/**]' should have total project code less than: 1.2`,
          );
          expect(errorMessage).toContain(
            `Percentage value must be greater than 0 and less or equal than 1`,
          );
        }
      }
    });
  });
});
