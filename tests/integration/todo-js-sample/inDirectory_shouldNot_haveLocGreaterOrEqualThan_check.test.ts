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

describe('shouldNot.haveLocGreaterOrEqualThan scenarios', () => {
    describe('Scenario 1: All files have lines of code LESS than the threshold', () => {
        test('"use-cases" should not have LOC greater or equal than 40 - should PASS (all files < 40)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(40)
                    .check();
            }
        });

        test('"entities" should not have LOC greater or equal than 25 - should PASS (Todo.js has 22 LOC < 25)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(25)
                    .check();
            }
        });

        test('"domain" should not have LOC greater or equal than 25 - should PASS (all files < 25)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(25)
                    .check();
            }
        });

        test('"infra" should not have LOC greater or equal than 40 - should PASS (InMemoryTodoRepository.js has 34 LOC < 40)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(40)
                    .check();
            }
        });

        test('"main" should not have LOC greater or equal than 40 - should PASS (app.js has 33 LOC < 40)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(40)
                    .check();
            }
        });

        test('entire project should not have LOC greater or equal than 40 - should PASS (all files < 40)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(40)
                    .check();
            }
        });
    });

    describe('Scenario 2: ANY files have lines of code GREATER than or EQUAL to the threshold', () => {
        test('"use-cases" should not have LOC greater or equal than 8 - should FAIL (GetAllTodos.js has exactly 8 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/use-cases/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(8)
                        .check();
                    
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/use-cases/**' should not have L.O.C. greater or equal than: 8\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('"use-cases" should not have LOC greater or equal than 15 - should FAIL (multiple files >= 15)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/use-cases/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(15)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/use-cases/**' should not have L.O.C. greater or equal than: 15\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('"entities" should not have LOC greater or equal than 22 - should FAIL (Todo.js has exactly 22 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(22)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/entities/**' should not have L.O.C. greater or equal than: 22\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                }
            }
        });

        test('"domain" should not have LOC greater or equal than 20 - should FAIL (multiple files >= 20)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/domain/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(20)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/domain/**' should not have L.O.C. greater or equal than: 20\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                }
            }
        });

        test('"infra" should not have LOC greater or equal than 34 - should FAIL (InMemoryTodoRepository.js has exactly 34 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/infra/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(34)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/infra/**' should not have L.O.C. greater or equal than: 34\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`);
                }
            }
        });

        test('"main" should not have LOC greater or equal than 33 - should FAIL (app.js has exactly 33 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/main/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(33)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/main/**' should not have L.O.C. greater or equal than: 33\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
                }
            }
        });

        test('entire project should not have LOC greater or equal than 30 - should FAIL (multiple files >= 30)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(30)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**' should not have L.O.C. greater or equal than: 30\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('"entities" should not have LOC greater or equal than 21 - should FAIL (Todo.js has 22 LOC > 21 - boundary case)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(21)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/entities/**' should not have L.O.C. greater or equal than: 21\n\n`);   
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                }
            }
        });

        test('"main" should not have LOC greater or equal than 32 - should FAIL (app.js has 33 LOC > 32 - boundary case)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/main/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(32)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/main/**' should not have L.O.C. greater or equal than: 32\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.js'`);
                }
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/nonexistent/**").shouldNot().haveLocGreaterOrEqualThan(10).check() - should throw error (no files exist)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        mimeTypes: ['**/*.js'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/nonexistent/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(10)
                        .check();

                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/nonexistent/**' should not have L.O.C. greater or equal than: 10\n`);
                    expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
                }
            }
        });

        test('threshold of 0 should always throw error (invalid threshold)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        mimeTypes: ['**/*.js'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(0)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. greater or equal than: 0\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('threshold of -1 should always throw error (invalid threshold)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        mimeTypes: ['**/*.js'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(-1)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. greater or equal than: -1\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('very high threshold (1000) should always PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(1000)
                    .check();
            }
        });

        test('boundary case: threshold one less than largest file LOC should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(36)
                    .check();
            }
        });

        test('boundary case: threshold equal to largest file LOC should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/use-cases/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(32)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Rule: project files in directory '**/use-cases/**' should not have L.O.C. greater or equal than: 32\n\n`);
                    expect(errorMessage).toContain(`Violating files:\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('incorrect extension', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'], // Looking for TypeScript in JavaScript project
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(10)
                        .check();
                    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/main/app.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                }
            }
        });
    });
});
