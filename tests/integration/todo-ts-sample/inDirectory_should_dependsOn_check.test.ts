import path from 'path';
import { Options } from '../../../src/fluent-api/common/types';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';
import { normalizeWindowsPath } from '../../../src/utils/windows';

const rootDir = normalizeWindowsPath(path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample'));

const includeMatchers = [
    [['<rootDir>/**']],
    [['<rootDir>/**/']],
    [['./**']],
    [['./**/']],
    [['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**', '<rootDir>/main/**']],
    [['<rootDir>/domain/**/', '<rootDir>/use-cases/**/', '<rootDir>/infra/**/', '<rootDir>/main/**/']],
    [['./domain/**', './use-cases/**', './infra/**', './main/**']],
    [['./domain/**/', './use-cases/**/', './infra/**/', './main/**/']],
];

const excludeMatchers = ['!<rootDir>/**/package.json', '!<rootDir>/**/tsconfig.json'];

describe('should.dependsOn scenarios', () => {
    describe('Scenario 1: File has NO dependencies', () => {
        test('"domain/entities" should depend on "inexistent-dependency" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/domain/entities/**')
                        .should()
                        .dependsOn(['inexistent-dependency'])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/entities/**' should depends on '[inexistent-dependency]'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
                }
            }
        });
    });

    describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
        test('"use-cases" should depend on "inexistent-dependency" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/use-cases/**')
                        .should()
                        .dependsOn(['inexistent-dependency'])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should depends on '[inexistent-dependency]'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
                }
            }
        });

        test('"use-cases" should depend on "infra" - should FAIL (use-cases imports from domain and "node packages", not infra)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/use-cases/**')
                        .should()
                        .dependsOn(['**/infra/**'])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should depends on '[**/infra/**]'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
                }
            }
        });
    });

    describe('Scenario 3: File has dependencies and SOME match the patterns', () => {
        test('"use-cases" should depend on "domain" and "uuid" - should FAIL (not all files have "uuid")', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/use-cases/**', ['!**/index.ts'])
                        .should()
                        .dependsOn(['**/domain/**', 'uuid'])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' - excluding files [!**/index.ts] , should depends on '[**/domain/**, uuid]'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
                }
            }
        });

        test('"main" should depend on "domain", "use-cases" and "infra" and "inexistent" - should FAIL (missing "inexistent")', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/main/**')
                        .should()
                        .dependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**', 'inexistent'])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/main/**' should depends on '[**/domain/**, **/use-cases/**, **/infra/**, inexistent]'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
                }
            }
        });
    });

    describe('Scenario 4: File has dependencies and ALL patterns are present', () => {
        test('"infra" should depend on "domain" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/**')
                    .should()
                    .dependsOn(['**/domain/**'])
                    .check();
            }
        });

        test('"use-cases/CreateTodo.ts" should depend on "domain" and "uuid" - should PASS (file have "domain" and "uuid")', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**', ['!**/use-cases/DeleteTodo.ts', '!**/use-cases/GetTodoById.ts', '!**/use-cases/GetAllTodos.ts', '!**/use-cases/UpdateTodo.ts', '!**/index.ts'])
                    .should()
                    .dependsOn(['**/domain/**', 'uuid'])
                    .check();
            }
        });

        test('"main" should depend on "domain" and "use-cases" - should PASS (has both + infra and extra)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .should()
                    .dependsOn(['**/domain/**', '**/use-cases/**'])
                    .check();
            }
        });

        test('"main" should depend on "domain", "use-cases" and "infra" and "uuid" - should PASS (has all patterns)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .should()
                    .dependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**', 'uuid'])
                    .check();
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").should().dependsOn([]).check() - should FAIL (empty array)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        extensionTypes: ['**/*.ts'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/domain/**')
                        .should()
                        .dependsOn([])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should depends on '[]'\n\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
            }
        });

        test('projectFiles.inDirectory("**/domain/**").should().dependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        extensionTypes: ['**/*.ts'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/domain/**')
                        .should()
                        .dependsOn(["uuid", ""])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should depends on '[uuid, ]'\n\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
            }
        });

        test('incorrect extension', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/infra/**')
                        .should()
                        .dependsOn(['**/domain/**'])
                        .check();
                    
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/infra/**' should depends on '[**/domain/**]'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                }
            }
        });

        test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
            const options: Options = {
                extensionTypes: ['**/*.ts'],
                includeMatcher: ['<rootDir>/infra/**'],
                ignoreMatcher: excludeMatchers
            };
            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
            try {
                await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/**')
                    .should()
                    .dependsOn(['**/infra/**'])
                    .check();

                // If we get here, the test should fail
                expect(1).toBe(2);
            } catch (error) {
                const errorMessage = (error as Error).message;

                expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should depends on '[**/infra/**]'\n\n`);
                expect(errorMessage).toContain(`Check if dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - are being reached by the 'includeMatcher'`);
                expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
                expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
            }
        });
    });
});
