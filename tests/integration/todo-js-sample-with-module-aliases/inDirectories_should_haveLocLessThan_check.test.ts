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

describe('inDirectories.should.haveLocLessThan scenarios (module-alias sample)', () => {
  describe('Scenario 1: All files have lines of code LESS than the threshold', () => {
    test('domain and use-cases should have LOC < 50 - should PASS', async () => {
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
          .haveLocLessThan(50)
          .check();
      }
    });

    test('infra should have LOC < 16 - should PASS (InMemoryTodoRepository.js has 15 LOC)', async () => {
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
          .haveLocLessThan(16)
          .check();
      }
    });

    test('main should have LOC < 25 - should PASS (app.js has 21 LOC)', async () => {
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
          .haveLocLessThan(25)
          .check();
      }
    });

    test('entire project should have LOC < 30 - should PASS (all files < 30)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        await appInstance.projectFiles().inDirectories(['**']).should().haveLocLessThan(30).check();
      }
    });
  });

  describe('Scenario 2: ANY files have lines of code GREATER than or EQUAL to the threshold', () => {
    test('domain and use-cases should have LOC < 12 - should FAIL (CreateTodo.js has exactly 12 LOC)', async () => {
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
            .haveLocLessThan(12)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**, **/use-cases/**]' should have L.O.C. less than: 12`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).not.toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).not.toContain(`- '${rootDir}/domain/entities/Todo.js'`);
        }
      }
    });

    test('infra should have LOC < 15 - should FAIL (InMemoryTodoRepository.js has exactly 15 LOC)', async () => {
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
            .inDirectories(['**/infra/**'])
            .should()
            .haveLocLessThan(15)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/infra/**]' should have L.O.C. less than: 15`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });

    test('main should have LOC < 21 - should FAIL (app.js has exactly 21 LOC)', async () => {
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
            .haveLocLessThan(21)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/main/**]' should have L.O.C. less than: 21`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
        }
      }
    });

    test('entire project should have LOC < 14 - should FAIL (app.js and InMemoryTodoRepository.js violate)', async () => {
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
            .inDirectories(['**'])
            .should()
            .haveLocLessThan(14)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**]' should have L.O.C. less than: 14`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
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
            .haveLocLessThan(10)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/nonexistent/**]' should have L.O.C. less than: 10`,
          );
          expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
        }
      }
    });

    test('threshold of 0 should throw error (invalid threshold)', async () => {
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
            .inDirectories(['**/domain/**'])
            .should()
            .haveLocLessThan(0)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**]' should have L.O.C. less than: 0`,
          );
          expect(errorMessage).toContain(`Threshold value must be greater than 0`);
        }
      }
    });

    test('incorrect extension type should show mismatch entries', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.ts'], // Looking for TS in JS project
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**'])
            .should()
            .haveLocLessThan(50)
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**]' should have L.O.C. less than: 50`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/main/app.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });
  });
});
