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

describe('should.haveName scenarios', () => {
    describe('Scenario 1: Directory has files but NONE match the pattern', () => {
        test('"use-cases" should have name "*UseCase.js" - should FAIL (none match)', async () => {
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
                        .should()
                        .haveName('*UseCase.js')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should have name '*UseCase.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.js'`);

                }
            }
        });

        test('"domain/entities" should have name "*Repository.js" - should FAIL (none match)', async () => {
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
                        .should()
                        .haveName('*Repository.js')
                        .check();
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have name '*Repository.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js'`);
                }
            }
        });

        test('"infra/repositories" should have name "*Entity.js" - should FAIL (none match)', async () => {
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
                        .should()
                        .haveName('*Entity.js')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/infra/repositories/**' should have name '*Entity.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.js'`);
                }
            }
        });
    });

    describe('Scenario 2: Directory has files and SOME match the pattern', () => {
        test('"use-cases" should have name "*Todo.js" - should FAIL (only some match)', async () => {
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
                        .should()
                        .haveName('*Todo.js')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should have name '*Todo.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.js'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.js'`);
                }
            }
        });
    });

    describe('Scenario 3: Directory has files and ALL files match the pattern', () => {
        test('entire project as (**) should have name with "*.js" - should PASS (all match)', async () => {
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
                    .should()
                    .haveName('*.js')
                    .check();
            }
        });
        
        test('"domain/entities" should have name "*Todo.js" - should PASS (all match)', async () => {
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
                    .should()
                    .haveName('*Todo.js')
                    .check();
            }
        });

        test('"domain/entities" should have name "Todo.js" - should PASS (exact match)', async () => {
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
                    .should()
                    .haveName('Todo.js')
                    .check();
            }
        });

        test('"infra/repositories" should have name "*Repository.js" - should PASS (all match)', async () => {
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
                    .should()
                    .haveName('*Repository.js')
                    .check();
            }
        });

        test('"infra/repositories" should have name "InMemory*Repository.js" - should PASS (all match)', async () => {
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
                    .should()
                    .haveName('InMemory*Repository.js')
                    .check();
            }
        });

        test('"use-cases" should have name "*.js" - should PASS (all match wildcard)', async () => {
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
                    .should()
                    .haveName('*.js')
                    .check();
            }
        });

        test('"use-cases" should have name "*Todo*" - should PASS (all match)', async () => {
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
                    .should()
                    .haveName('*Todo*')
                    .check();
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").should().haveName("").check() - should FAIL (empty pattern)', async () => {
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
                        .should()
                        .haveName('')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should have name ''\n\n`);
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
                        .should()
                        .haveName('*Todo.js')
                        .check();
                    
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have name '*Todo.js'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.js' - mismatch in 'mimeTypes': [**/*.ts]`);
                }
            }
        });
    });
});
