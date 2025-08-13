import { spawn } from 'child_process';
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

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
];

describe('inDirectories.should.dependsOn scenarios (module-alias sample)', () => {
  beforeAll(async () => {
    const resolveSpawn = async () => {
      return new Promise((resolve, reject) => {
        const child = spawn('node', [path.resolve(rootDir, 'setup-aliases.js')], {
          stdio: 'inherit',
        });
        child.on('close', (code) => {
          if (code === 0)
            resolve(true); // success
          else reject(new Error(`Process exited with code ${code}`));
        });

        child.on('error', (err) => reject(err));
      });
    };
    await resolveSpawn();
  });
  describe('Scenario 1: Files with NO dependencies', () => {
    test('"infra" should depend on "domain" - should FAIL (no deps in infra)', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
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
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });

    test('"infra" and "use-cases" should depend on "inexistent-dependency" - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/infra/**', '**/use-cases/**'])
            .should()
            .dependsOn(['inexistent-dependency'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/infra/**, **/use-cases/**]' should depends on '[inexistent-dependency]'\n\n`,
          );
          expect(errorMessage).toContain(
            `- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`,
          );
        }
      }
    });
  });

  describe('Scenario 2: Files have dependencies but NONE match the patterns', () => {
    test('"use-cases" and "main" should depend on "inexistent" - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
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
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
        }
      }
    });
  });

  describe('Scenario 3: Files have dependencies and SOME match the patterns', () => {
    test('"use-cases" and "main" should depend on "domain" and "infra" - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
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
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
          expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
        }
      }
    });

    test('with exclusion on use-cases, still missing patterns - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        try {
          await appInstance
            .projectFiles()
            .inDirectories(['**/use-cases/**', '**/main/**'], ['!**/use-cases/GetAllTodos.js'])
            .should()
            .dependsOn(['**/domain/**', '**/infra/**'])
            .check();
          expect(1).toBe(2);
        } catch (error) {
          const errorMessage = (error as Error).message;
          expect(errorMessage).toContain(
            `Violation - Rule: project files in directories '[**/use-cases/**, **/main/**]' - excluding [!**/use-cases/GetAllTodos.js] , should depends on '[**/domain/**, **/infra/**]'\n\n`,
          );
          expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
        }
      }
    });
  });

  describe('Scenario 4: Files have dependencies and ALL patterns are present', () => {
    test('"main" should depend on "use-cases" and "infra" - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
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
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
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

    test('dependsOn accepts a single string - should PASS', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance
          .projectFiles()
          .inDirectories(['**/use-cases/**'])
          .should()
          .dependsOn('**/domain/**')
          .check();
      }
    });
  });

  describe('Edge scenarios', () => {
    test('empty array - should FAIL', async () => {
      for (const includeMatcher of includeMatchers) {
        const options: Options = {
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
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
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
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
          extensionTypes: ['**/*.ts'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: excludeMatchers,
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
            `- '${rootDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`,
          );
        }
      }
    });
  });
});
