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
  //   ['<rootDir>/**/'],
  //   ['./**'],
  //   ['./**/'],
  //   [
  //     '<rootDir>/domain/**',
  //     '<rootDir>/use-cases/**',
  //     '<rootDir>/infra/**',
  //     '<rootDir>/main/**',
  //     '<rootDir>/setup-aliases.js',
  //   ],
  //   [
  //     '<rootDir>/domain/**/',
  //     '<rootDir>/use-cases/**/',
  //     '<rootDir>/infra/**/',
  //     '<rootDir>/main/**/',
  //     '<rootDir>/setup-aliases.js',
  //   ],
  //   ['./domain/**', './use-cases/**', './infra/**', './main/**', './setup-aliases.js'],
  //   ['./domain/**/', './use-cases/**/', './infra/**/', './main/**/', './setup-aliases.js'],
];

const ignoreMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
];

describe('inDirectories.should.haveName scenarios (module-alias sample)', () => {
  describe('Scenario 1: Directories have files but NONE match the pattern', () => {
    test("domain should have name '*UseCase.js' - should FAIL (none match)", async () => {
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
            .haveName('*UseCase.js')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**]' should have name '*UseCase.js'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
        }
      }
    });
  });

  describe('Scenario 2: Directories have files and SOME match the pattern', () => {
    test("use-cases + infra should have name '*Repository.js' - should FAIL (only infra matches)", async () => {
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
            .inDirectories(['**/use-cases/**', '**/infra/**'])
            .should()
            .haveName('*Repository.js')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/infra/**]' should have name '*Repository.js'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).not.toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
          // infra matches pattern, so not listed as mismatch
        }
      }
    });

    test("domain + use-cases should have name '*Todo.js' - should FAIL (domain repositories do not match & use-cases GetAllTodos.js do not match)", async () => {
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
            .haveName('*Todo.js')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**, **/use-cases/**]' should have name '*Todo.js'`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
        }
      }
    });
  });

  describe('Scenario 3: Directories have files and ALL files match the pattern', () => {
    test("domain/entities + use-cases should have name '*Todo*.js' - should PASS (all match)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectories(['**/domain/entities/**', '**/use-cases/**'])
          .should()
          .haveName('*Todo*.js')
          .check();
      }
    });

    test("domain/repositories + infra/repositories should have name '*Repository.js' - should PASS (all match)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectories(['**/domain/repositories/**', '**/infra/repositories/**'])
          .should()
          .haveName('*Repository.js')
          .check();
      }
    });

    test("main should have name 'app.js' - should PASS (exact match)", async () => {
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
          .haveName('app.js')
          .check();
      }
    });

    test("entire project should have name '*.js' - should PASS (all match)", async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance.projectFiles().inDirectories(['**']).should().haveName('*.js').check();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty pattern should throw error (no pattern provided)', async () => {
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
            .inDirectories(['**/domain/**'])
            .should()
            .haveName('')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/domain/**]' should have name ''`,
          );
          expect(errorMessage).toContain(`No pattern was provided for checking`);
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
            .inDirectories(['**/entities/**'])
            .should()
            .haveName('*Todo.ts')
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/entities/**]' should have name '*Todo.ts'`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });
  });
});
