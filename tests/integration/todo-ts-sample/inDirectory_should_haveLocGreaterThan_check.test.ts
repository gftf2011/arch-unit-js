import path from 'path';
import { Options } from '../../../src/fluent-api/common/types';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample');

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

const excludeMatchers = ['!<rootDir>/**/package.json', '!<rootDir>/**/tsconfig.json'];

describe('should.haveLocGreaterThan scenarios', () => {
    describe('Scenario 1: All files have lines of code GREATER than the threshold', () => {
        test('"use-cases" should have LOC greater than 6 excluding index.ts - should PASS (all files > 6)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**', ['!**/use-cases/index.ts'])
                    .should()
                    .haveLocGreaterThan(6)
                    .check();
            }
        });

        test('"infra" should have LOC greater than 31 - should PASS (InMemoryTodoRepository.ts has 32 LOC)', async () => {
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
                    .haveLocGreaterThan(31)
                    .check();
            }
        });

        test('"main" should have LOC greater than 39 - should PASS (app.ts has 40 LOC)', async () => {
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
                    .haveLocGreaterThan(39)
                    .check();
            }
        });

        test('"entities" excluding index.ts should have LOC greater than 27 - should PASS (Todo.ts has 28 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**', ['!**/entities/index.ts'])
                    .should()
                    .haveLocGreaterThan(27)
                    .check();
            }
        });
    });

    describe('Scenario 2: ANY files have lines of code LESS than or EQUAL to the threshold', () => {
        test('"use-cases" should have LOC greater than 8 excluding index.ts - should FAIL (GetAllTodos.ts has exactly 8 LOC)', async () => {
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
                        .inDirectory('**/use-cases/**', ['!**/use-cases/index.ts'])
                        .should()
                        .haveLocGreaterThan(8)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' - excluding files [!**/use-cases/index.ts] , should have L.O.C. greater than: 8\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
                }
            }
        });

        test('"use-cases" should have LOC greater than 15 - should FAIL (multiple files <= 15)', async () => {
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
                        .haveLocGreaterThan(15)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should have L.O.C. greater than: 15\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
                }
            }
        });

        test('"entities" should have LOC greater than 28 - should FAIL (index.ts has 1 LOC, Todo.ts has exactly 28 LOC)', async () => {
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
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterThan(28)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater than: 28\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
                }
            }
        });

        test('"domain" should have LOC greater than 25 - should FAIL (multiple files <= 25)', async () => {
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
                        .inDirectory('**/domain/**')
                        .should()
                        .haveLocGreaterThan(25)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should have L.O.C. greater than: 25\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
                }
            }
        });

        test('entire project should have LOC greater than 45 - should FAIL (multiple files <= 45)', async () => {
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
                        .inDirectory('**')
                        .should()
                        .haveLocGreaterThan(45)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**' should have L.O.C. greater than: 45\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
                }
            }
        });

        test('"main" should have LOC greater than 40 - should FAIL (app.ts has exactly 40 LOC - boundary case)', async () => {
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
                        .haveLocGreaterThan(40)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/main/**' should have L.O.C. greater than: 40\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
                }
            }
        });

        test('"infra" should have LOC greater than 32 - should FAIL (InMemoryTodoRepository.ts has exactly 32 LOC - boundary case)', async () => {
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
                        .inDirectory('**/infra/**')
                        .should()
                        .haveLocGreaterThan(32)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/infra/**' should have L.O.C. greater than: 32\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`);
                }
            }
        });

        test('"entities" should have LOC greater than 1 - should FAIL (index.ts has exactly 1 LOC - boundary case)', async () => {
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
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterThan(1)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater than: 1\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
                }
            }
        });

        test('"use-cases" should have LOC greater than 7 - should FAIL (index.ts has exactly 7 LOC - boundary case)', async () => {
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
                        .haveLocGreaterThan(7)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should have L.O.C. greater than: 7\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
                }
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/nonexistent/**").should().haveLocGreaterThan(10).check() - should throw error (no files exist)', async () => {
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
                        .inDirectory('**/nonexistent/**')
                        .should()
                        .haveLocGreaterThan(10)
                        .check();

                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/nonexistent/**' should have L.O.C. greater than: 10\n`);
                    expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
                }
            }
        });

        test('threshold of 0 should always throw error (invalid threshold)', async () => {
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
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterThan(0)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater than: 0\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('threshold of -1 should always throw error (invalid threshold)', async () => {
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
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterThan(-1)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater than: -1\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('very low threshold (1) should mostly PASS except for index.ts files', async () => {
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
                        .inDirectory('**')
                        .should()
                        .haveLocGreaterThan(1)
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**' should have L.O.C. greater than: 1\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
                }
            }
        });

        test('incorrect extension', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.js'], // Looking for JavaScript in TypeScript project
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocGreaterThan(10)
                        .check();
                    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. greater than: 10\n\n`);
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
    });
});
