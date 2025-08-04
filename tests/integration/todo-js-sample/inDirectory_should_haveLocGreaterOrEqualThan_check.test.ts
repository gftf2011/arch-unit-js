import path from 'path';
import { Options } from '../../../src/fluent-api/common/types';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample');

const includeMatchers = [
    [['<rootDir>/**']],
    [['<rootDir>/**/']],
    [['./**']],
    [['./**/']],
    [['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**', '<rootDir>/main/**']],
    [['<rootDir>/domain/**/', '<rootDir>/use-cases/**/', '<rootDir>/infra/**/', '<rootDir>/main/**/']],
    [['./domain/**', './use-cases/**', './infra/**', './main/**']],
    [['./domain/**/', './use-cases/**', './infra/**', './main/**/']],
];

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('should.haveLocGreaterOrEqualThan scenarios', () => {
    describe('Scenario 1: All files have lines of code GREATER than or EQUAL to the threshold', () => {
        test('"use-cases" should have LOC greater or equal than 8 - should PASS (all files >= 8)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .should()
                    .haveLocGreaterOrEqualThan(8)
                    .check();
            }
        });

        test('"entities" should have LOC greater or equal than 22 - should PASS (Todo.js has exactly 22 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .should()
                    .haveLocGreaterOrEqualThan(22)
                    .check();
            }
        });

        test('"domain" should have LOC greater or equal than 18 - should PASS (all files >= 18)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/**')
                    .should()
                    .haveLocGreaterOrEqualThan(18)
                    .check();
            }
        });

        test('"infra" should have LOC greater or equal than 34 - should PASS (InMemoryTodoRepository.js has exactly 34 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/**')
                    .should()
                    .haveLocGreaterOrEqualThan(34)
                    .check();
            }
        });

        test('"main" should have LOC greater or equal than 33 - should PASS (app.js has exactly 33 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .should()
                    .haveLocGreaterOrEqualThan(33)
                    .check();
            }
        });

        test('entire project should have LOC greater or equal than 8 - should PASS (all files >= 8)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .should()
                    .haveLocGreaterOrEqualThan(8)
                    .check();
            }
        });
    });

    describe('Scenario 2: ANY files have lines of code LESS than the threshold', () => {
        test('"use-cases" should have LOC greater or equal than 10 - should FAIL (GetAllTodos.js has only 8 LOC)', async () => {
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
                        .inDirectory('**/use-cases/**')
                        .should()
                        .haveLocGreaterOrEqualThan(10)
                        .check();
                    
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should have L.O.C. greater or equal than: 10\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
                }
            }
        });

        test('"use-cases" should have LOC greater or equal than 20 - should FAIL (multiple files below threshold)', async () => {
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
                        .inDirectory('**/use-cases/**')
                        .should()
                        .haveLocGreaterOrEqualThan(20)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should have L.O.C. greater or equal than: 20\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
                }
            }
        });

        test('"domain" should have LOC greater or equal than 25 - should FAIL (Todo.js has only 22 LOC)', async () => {
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
                        .inDirectory('**/domain/**')
                        .should()
                        .haveLocGreaterOrEqualThan(25)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should have L.O.C. greater or equal than: 25\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
                }
            }
        });

        test('entire project should have LOC greater or equal than 40 - should FAIL (multiple files below threshold)', async () => {
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
                        .inDirectory('**')
                        .should()
                        .haveLocGreaterOrEqualThan(40)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**' should have L.O.C. greater or equal than: 40\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('"entities" should have LOC greater or equal than 23 - should FAIL (Todo.js has exactly 22 LOC - boundary case)', async () => {
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
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterOrEqualThan(23)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater or equal than: 23\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                }
            }
        });

        test('"main" should have LOC greater or equal than 39 - should FAIL (app.js has exactly 33 LOC - boundary case)', async () => {
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
                    .inDirectory('**/main/**')
                    .should()
                    .haveLocGreaterOrEqualThan(39)
                    .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/main/**' should have L.O.C. greater or equal than: 39\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
                }
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/nonexistent/**").should().haveLocGreaterOrEqualThan(10).check() - should throw error (no files exist)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        extensionTypes: ['**/*.js'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/nonexistent/**')
                        .should()
                        .haveLocGreaterOrEqualThan(10)
                        .check();

                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;
                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/nonexistent/**' should have L.O.C. greater or equal than: 10\n\n`);
                    expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
                }
            }
        });

        test('threshold of 0 should always throw error (invalid threshold)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        extensionTypes: ['**/*.js'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterOrEqualThan(0)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater or equal than: 0\n\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('threshold of -1 should always throw error (invalid threshold)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        extensionTypes: ['**/*.js'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterOrEqualThan(-1)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater or equal than: -1\n\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('very low threshold (1) should always PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .should()
                    .haveLocGreaterOrEqualThan(1)
                    .check();
            }
        });

        test('boundary case: threshold equal to smallest file LOC should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .should()
                    .haveLocGreaterOrEqualThan(8)
                    .check();
            }
        });

        test('incorrect extension', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'], // Looking for TypeScript in JavaScript project
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterOrEqualThan(10)
                        .check();
                    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater or equal than: 10\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js' - mismatch in 'extensionTypes': [**/*.ts]`);
                }
            }
        });
    });
});
