import path from 'path';
import { Options } from '../../../src/fluent-api/common/types';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';
import { normalizeWindowsPath } from '../../../src/utils/windows';

const rootDir = normalizeWindowsPath(path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample'));

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

describe.skip('should.haveLocLessOrEqualThan scenarios', () => {
    describe('Scenario 1: All files have lines of code LESS than or EQUAL to the threshold', () => {
        test('"use-cases" should have LOC less or equal than 50 - should PASS', async () => {
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
                    .haveLocLessOrEqualThan(50)
                    .check();
            }
        });

        test('"entities" should have LOC less or equal than 30 - should PASS', async () => {
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
                    .haveLocLessOrEqualThan(30)
                    .check();
            }
        });

        test('"domain" should have LOC less or equal than 40 - should PASS', async () => {
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
                    .haveLocLessOrEqualThan(40)
                    .check();
            }
        });

        test('"use-cases" should have LOC less or equal than exact UpdateTodo.js LOC count - should PASS (boundary case)', async () => {
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
                    .haveLocLessOrEqualThan(32)
                    .check();
            }
        });
    });

    describe('Scenario 2: ANY files have lines of code GREATER than the threshold', () => {
        test('"use-cases" should have LOC less or equal than 25 - should FAIL (UpdateTodo.js exceeds threshold)', async () => {
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
                        .haveLocLessOrEqualThan(25)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should have L.O.C. less or equal than: 25\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('"domain" should have LOC less or equal than 15 - should FAIL (multiple files exceed threshold)', async () => {
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
                        .haveLocLessOrEqualThan(15)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should have L.O.C. less or equal than: 15\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
                }
            }
        });

        test('entire project should have LOC less or equal than 8 - should FAIL (all files exceed threshold)', async () => {
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
                        .haveLocLessOrEqualThan(8)
                        .check();
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**' should have L.O.C. less or equal than: 8\n\n`);
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

        test('"infra" should have LOC less or equal than 20 - should FAIL (InMemoryTodoRepository.js exceeds threshold)', async () => {
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
                        .haveLocLessOrEqualThan(20)
                        .check();
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/infra/**' should have L.O.C. less or equal than: 20\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`);
                }
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/nonexistent/**").should().haveLocLessOrEqualThan(10).check() - should throw error (no files exist)', async () => {
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
                        .haveLocLessOrEqualThan(10)
                        .check();

                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/nonexistent/**' should have L.O.C. less or equal than: 10\n\n`);
                    expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
                }
            }
        });

        test('threshold of 0 should always FAIL (no files can have less or equal than 0 LOC)', async () => {
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
                        .haveLocLessOrEqualThan(0)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. less or equal than: 0\n\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('threshold of -1 should always FAIL (impossible scenario)', async () => {
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
                        .haveLocLessOrEqualThan(-1)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. less or equal than: -1\n\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('very high threshold should always PASS', async () => {
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
                    .haveLocLessOrEqualThan(1000)
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
                        .haveLocLessOrEqualThan(50)
                        .check();
                    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. less or equal than: 50\n\n`);
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
