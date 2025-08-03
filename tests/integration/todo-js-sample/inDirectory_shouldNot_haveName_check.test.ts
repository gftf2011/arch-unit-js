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
    [['./domain/**/', './use-cases/**/', './infra/**/', './main/**/']],
];

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('shouldNot.haveName scenarios', () => {
    describe('Scenario 1: Directory has files but NONE match the pattern', () => {
        test('"use-cases" should not have name "*UseCase.js" - should PASS (none match)', async () => {
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
                    .haveName('*UseCase.js')
                    .check();
            }
        });

        test('"domain/entities" should not have name "*Repository.js" - should PASS (none match)', async () => {
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
                    .haveName('*Repository.js')
                    .check();
            }
        });

        test('"infra/repositories" should not have name "*Entity.js" - should PASS (none match)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/repositories/**')
                    .shouldNot()
                    .haveName('*Entity.js')
                    .check();
            }
        });

        test('"use-cases" should not have name "*Service.js" - should PASS (none match)', async () => {
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
                    .haveName('*Service.js')
                    .check();
            }
        });

        test('"domain" should not have name "*Controller.js" - should PASS (none match)', async () => {
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
                    .haveName('*Controller.js')
                    .check();
            }
        });
    });

    describe('Scenario 2: Directory has files and ANY files match the pattern', () => {
        test('"domain/entities" should not have name "*Todo.js" - should FAIL (matches)', async () => {
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
                        .haveName('*Todo.js')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not have name '*Todo.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                }
            }
        });

        test('"domain/entities" should not have name "Todo.js" - should FAIL (exact match)', async () => {
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
                        .haveName('Todo.js')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not have name 'Todo.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                }
            }
        });

        test('"infra/repositories" should not have name "*Repository.js" - should FAIL (matches)', async () => {
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
                        .inDirectory('**/infra/repositories/**')
                        .shouldNot()
                        .haveName('*Repository.js')
                        .check();
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/infra/repositories/**' should not have name '*Repository.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`);
                }
            }
        });

        test('"infra/repositories" should not have name "InMemory*Repository.js" - should FAIL (matches)', async () => {
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
                        .inDirectory('**/infra/repositories/**')
                        .shouldNot()
                        .haveName('InMemory*Repository.js')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/infra/repositories/**' should not have name 'InMemory*Repository.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`);
                }
            }
        });

        test('"use-cases" should not have name "*.js" - should FAIL (all match wildcard)', async () => {
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
                        .haveName('*.js')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should not have name '*.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('"use-cases" should not have name "*Todo*" - should FAIL (some match)', async () => {
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
                        .haveName('*Todo*')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should not have name '*Todo*'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('"use-cases" should not have name "Create*" - should FAIL (some match)', async () => {
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
                        .haveName('Create*')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should not have name 'Create*'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                }
            }
        });

        test('"use-cases" should not have name "*Todo.js" - should FAIL (some match)', async () => {
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
                        .haveName('*Todo.js')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should not have name '*Todo.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);
                }
            }
        });

        test('"domain" should not have name "*Todo*" - should FAIL (some match)', async () => {
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
                        .haveName('*Todo*')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should not have name '*Todo*'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/repositories/TodoRepository.js'`);
                }
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").shouldNot().haveName("").check() - should FAIL (empty pattern)', async () => {
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
                        .inDirectory('**/domain/**')
                        .shouldNot()
                        .haveName('')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should not have name ''\n\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
            }
        });

        test('incorrect extension', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveName('*Todo.js')
                        .check();
                    
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not have name '*Todo.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js' - mismatch in 'mimeTypes': [**/*.ts]`);
                }
            }
        });
    });
});
