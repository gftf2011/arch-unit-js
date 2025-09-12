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
  'b',
);

const includeMatchers = [
  ['<rootDir>/packages/b/**'],
  ['<rootDir>/packages/b/**/'],
  ['./packages/b/**'],
  ['./packages/b/**/'],
  [
    '<rootDir>/packages/b/domain/**',
    '<rootDir>/packages/b/use-cases/**',
    '<rootDir>/packages/b/infra/**',
    '<rootDir>/packages/b/main/**',
  ],
  [
    '<rootDir>/packages/b/domain/**/',
    '<rootDir>/packages/b/use-cases/**/',
    '<rootDir>/packages/b/infra/**/',
    '<rootDir>/packages/b/main/**/',
  ],
  [
    './packages/b/domain/**',
    './packages/b/use-cases/**',
    './packages/b/infra/**',
    './packages/b/main/**',
  ],
  [
    './packages/b/domain/**/',
    './packages/b/use-cases/**/',
    './packages/b/infra/**/',
    './packages/b/main/**/',
  ],
];

const ignoreMatchers = [
  '!<rootDir>/packages/b/**/package.json',
  '!<rootDir>/packages/b/**/node_modules/**',
  '!<rootDir>/packages/b/**/package-lock.json',
];

describe('shouldNot.dependsOn scenarios', () => {
  describe('Scenario 1: File has NO dependencies', () => {
    test('"domain/entities" should not depend on "domain" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/entities/**')
          .shouldNot()
          .dependsOn(['**/domain/**'])
          .check();
      }
    });

    test('"domain/entities" should not depend on "infra" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/entities/**')
          .shouldNot()
          .dependsOn(['**/infra/**'])
          .check();
      }
    });
  });

  describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
    test('"use-cases" should not depend on "infra" - should PASS (use-cases imports from domain, not infra)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**')
          .shouldNot()
          .dependsOn(['**/infra/**'])
          .check();
      }
    });

    test('"infra" should not depend on "use-cases" - should PASS (infra imports from domain, not use-cases)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/infra/**')
          .shouldNot()
          .dependsOn(['**/use-cases/**'])
          .check();
      }
    });

    test('"use-cases" should not depend on "inexistent-dependency" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectory('**/use-cases/**')
          .shouldNot()
          .dependsOn(['inexistent-dependency'])
          .check();
      }
    });
  });

  describe('Scenario 3: File has dependencies and ANY patterns are present', () => {
    test('"use-cases" should not depend on "domain" - should FAIL (use-cases imports from domain)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/use-cases/**')
            .shouldNot()
            .dependsOn(['**/domain/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/use-cases/**' should not depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/use-cases/CreateTodo.js'`);
        }
      }
    });

    test('"infra" should not depend on "domain" - should FAIL (infra imports from domain)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .shouldNot()
            .dependsOn(['**/domain/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should not depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });

    test('"main" should not depend on "domain" - should FAIL (main imports from domain)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/main/**')
            .shouldNot()
            .dependsOn(['**/domain/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });

    test('"main" should not depend on "use-cases" - should FAIL (main imports from use-cases)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/main/**')
            .shouldNot()
            .dependsOn(['**/use-cases/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not depends on '[**/use-cases/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });

    test('"main" should not depend on "infra" - should FAIL (main imports from infra)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/main/**')
            .shouldNot()
            .dependsOn(['**/infra/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not depends on '[**/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });

    test('"main" should not depend on "domain" and "use-cases" - should FAIL (main imports from both)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/main/**')
            .shouldNot()
            .dependsOn(['**/domain/**', '**/use-cases/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not depends on '[**/domain/**, **/use-cases/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });

    test('"main" should not depend on "domain", "use-cases" and "infra" - should FAIL (main imports from all)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/main/**')
            .shouldNot()
            .dependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/main/**' should not depends on '[**/domain/**, **/use-cases/**, **/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${workspaceDir}/main/app.js'`);
        }
      }
    });
  });

  describe('Edge scenarios', () => {
    test('projectFiles.inDirectory("**/domain/**").shouldNot().dependsOn([]).check() - should FAIL (empty array)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            workspaceDir: './packages/b',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .dependsOn([])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should not depends on '[]'\n`,
          );
          expect(errorMessage).toContain(`No pattern was provided for checking`);
        }
      }
    });

    test('projectFiles.inDirectory("**/domain/**").shouldNot().dependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
      for (const includeMatcher of includeMatchers) {
        try {
          const options: Options = {
            workspaceDir: './packages/b',
            extensionTypes: ['**/*.js'],
            includeMatcher: [...includeMatcher],
            ignoreMatcher: ignoreMatchers,
          };
          const appInstance = ComponentSelectorBuilder.create(rootDir, options);
          await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .dependsOn(['uuid', ''])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/domain/**' should not depends on '[uuid, ]'\n`,
          );
          expect(errorMessage).toContain(`No pattern was provided for checking`);
        }
      }
    });

    test('incorrect extension', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          workspaceDir: './packages/b',
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .shouldNot()
            .dependsOn(['**/domain/**'])
            .check();

          // If we get here, the test should fail
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;

          expect(errorMessage).toContain(
            `Violation - Rule: project files in directory '**/infra/**' should not depends on '[**/domain/**]'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/domain/repositories/TodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/main/app.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/CreateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/DeleteTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/GetTodoById.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
          expect(errorMessage).toContain(
            `- '${workspaceDir}/use-cases/UpdateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });

    test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
      const options: Options = {
        workspaceDir: './packages/b',
        extensionTypes: ['**/*.js'],
        includeMatcher: ['<rootDir>/packages/b/infra/**'],
        ignoreMatcher: ignoreMatchers,
      };
      const appInstance = ComponentSelectorBuilder.create(rootDir, options);
      try {
        await appInstance
          .projectFiles()
          .inDirectory('**/domain/**')
          .shouldNot()
          .dependsOn(['**/infra/**'])
          .check();

        // If we get here, the test should fail
        expect(1).toBe(2);
      } catch (error) {
        const errorMessage = (error as Error).message;

        expect(errorMessage).toContain(
          `Violation - Rule: project files in directory '**/domain/**' should not depends on '[**/infra/**]'\n\n`,
        );
        expect(errorMessage).toContain(
          `Check if dependencies in file: '${workspaceDir}/infra/repositories/InMemoryTodoRepository.js' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'`,
        );
        expect(errorMessage).toContain(`- '../../domain/repositories/TodoRepository'`);
      }
    });
  });
});
