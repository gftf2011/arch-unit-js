import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  '..',
  'sample',
  'todo-workspaces',
);

const workspaceDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  '..',
  'sample',
  'todo-workspaces',
  'packages',
  'd',
);

const includeMatchers: string[][] = [
  ['<workspaceDir>/**'],
  ['<workspaceDir>/**/'],
  ['./packages/d/**'],
  ['./packages/d/**/'],
  [
    '<workspaceDir>/domain/**',
    '<workspaceDir>/use-cases/**',
    '<workspaceDir>/infra/**',
    '<workspaceDir>/main/**',
    '<workspaceDir>/setup-aliases.js',
  ],
  [
    '<workspaceDir>/domain/**/',
    '<workspaceDir>/use-cases/**/',
    '<workspaceDir>/infra/**/',
    '<workspaceDir>/main/**/',
    '<workspaceDir>/setup-aliases.js',
  ],
  [
    './packages/d/domain/**',
    './packages/d/use-cases/**',
    './packages/d/infra/**',
    './packages/d/main/**',
    './packages/d/setup-aliases.js',
  ],
  [
    './packages/d/domain/**/',
    './packages/d/use-cases/**/',
    './packages/d/infra/**/',
    './packages/d/main/**/',
    './packages/d/setup-aliases.js',
  ],
];

const ignoreMatchers = [
  '!<workspaceDir>/**/package.json',
  '!<workspaceDir>/**/node_modules/**',
  '!<workspaceDir>/**/package-lock.json',
];

describe('inDirectories.should.dependsOn scenarios (module-alias sample)', () => {
  describe('Scenario 1: Files with NO dependencies', () => {
    test('"infra" should depend on "domain" - should FAIL (no deps in infra)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
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
            .dependsOn(['**/domain/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/infra/**]' should depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });
  });

  describe('Scenario 2: Files have dependencies but NONE match the patterns', () => {
    test('"use-cases" and "main" should depend on "inexistent" - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
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
            .dependsOn(['inexistent'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/main/**]' should depends on '[inexistent]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });
  });

  describe('Scenario 3: Files have dependencies and SOME match the patterns', () => {
    test('"main" should depend on "domain" and "infra" - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
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
            .dependsOn(['**/domain/**', '**/infra/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/main/**]' should depends on '[**/domain/**, **/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });
  });

  describe('Scenario 4: Files have dependencies and ALL patterns are present', () => {
    test('"main" should depend on "use-cases" and "infra" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectories(['**/main/**'])
          .should()
          .dependsOn(['**/use-cases/**', '**/infra/**'])
          .check();
      }
    });

    test('"use-cases" should depend on "domain" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectories(['**/use-cases/**'])
          .should()
          .dependsOn(['**/domain/**'])
          .check();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('"use-cases" and "main" should depend on "domain" and "infra" - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
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
            .dependsOn(['**/domain/**', '**/infra/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/main/**]' should depends on '[**/domain/**, **/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });

    test('"use-cases" and "main" should depend on "domain" - should FAIL (no "domain" deps in "main")', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
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
            .dependsOn(['**/domain/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/main/**]' should depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).not.toContain(`- '${workspaceDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).not.toContain(`- '${workspaceDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });

    test('empty array - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
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
            .dependsOn([])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**]' should depends on '[]'\n\n`,
          );
          expect(errorMessage).toContain('No pattern was provided for checking');
        }
      }
    });

    test('array with empty string - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
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
            .dependsOn(['uuid', ''])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**]' should depends on '[uuid, ]'\n\n`,
          );
          expect(errorMessage).toContain('No pattern was provided for checking');
        }
      }
    });

    test('incorrect extension - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/d',
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/infra/**'])
            .should()
            .dependsOn(['**/domain/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/infra/**]' should depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });
  });
});
