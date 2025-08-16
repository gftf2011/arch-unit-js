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

describe('inDirectories.shouldNot.dependsOn scenarios (module-alias sample)', () => {
  // Scenario 1: Files have NO dependencies → PASS
  describe('Scenario 1: Files with NO dependencies', () => {
    test('"infra" should NOT depend on "domain" - PASS', async () => {
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
          .shouldNot()
          .dependsOn(['**/domain/**'])
          .check();
      }
    });
  });

  // Scenario 2: Files have dependencies but NONE match patterns → PASS
  describe('Scenario 2: Files have dependencies but NONE match the patterns', () => {
    test('"use-cases" and "main" should NOT depend on "inexistent" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectories(['**/use-cases/**', '**/main/**'])
          .shouldNot()
          .dependsOn(['inexistent'])
          .check();
      }
    });
  });

  // Scenario 3: Files have dependencies and ANY patterns present → FAIL
  describe('Scenario 3: Files have dependencies and ANY patterns are present', () => {
    test('"main" should NOT depend on "domain" and "infra" - FAIL', async () => {
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
            .shouldNot()
            .dependsOn(['**/domain/**', '**/infra/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/main/**]' should not depends on '[**/domain/**, **/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
        }
      }
    });
  });

  describe('Scenario 4: Files have dependencies and ALL patterns are present', () => {
    test('"main" should NOT depend on "use-cases" and "infra" - should FAIL', async () => {
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
            .shouldNot()
            .dependsOn(['**/use-cases/**', '**/infra/**'])
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/main/**]' should not depends on '[**/use-cases/**, **/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
        }
      }
    });

    test('"use-cases" should NOT depend on "domain" - should FAIL', async () => {
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
            .shouldNot()
            .dependsOn(['**/domain/**'])
            .check();

          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**]' should not depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
        }
      }
    });
  });

  // Edge scenarios
  describe('Edge scenarios', () => {
    test('"use-cases" and "main" should NOT depend on "domain" and "infra" - should FAIL', async () => {
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
            .shouldNot()
            .dependsOn(['**/domain/**', '**/infra/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/main/**]' should not depends on '[**/domain/**, **/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
        }
      }
    });

    test('"use-cases" and "main" should NOT depend on "domain" - should FAIL (no "domain" deps in "main")', async () => {
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
            .shouldNot()
            .dependsOn(['**/domain/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/main/**]' should not depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).not.toContain(`- '${rootDir}/main/app.js'`);
        }
      }
    });

    test('empty array - should FAIL', async () => {
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
            .shouldNot()
            .dependsOn([])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**]' should not depends on '[]'\n\n`,
          );
          expect(errorMessage).toContain('No pattern was provided for checking');
        }
      }
    });

    test('array with empty string - should FAIL', async () => {
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
            .shouldNot()
            .dependsOn(['uuid', ''])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**]' should not depends on '[uuid, ]'\n\n`,
          );
          expect(errorMessage).toContain('No pattern was provided for checking');
        }
      }
    });

    test('incorrect extension - should FAIL with mismatch details', async () => {
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
            .inDirectories(['**/use-cases/**'])
            .shouldNot()
            .dependsOn(['**/domain/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**]' should not depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });
  });
});
