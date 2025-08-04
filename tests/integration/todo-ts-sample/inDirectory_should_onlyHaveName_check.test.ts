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

describe('should.onlyHaveName scenarios', () => {
    describe('Scenario 1: Directory has files but NONE match the pattern', () => {
        test('"entities" should only have name "*UseCase.ts" - should FAIL', async () => {
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
                        .onlyHaveName('*UseCase.ts')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should only have name '*UseCase.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
                }
            }
        });

        test('"infra repositories" should only have name "*Entity.ts" - should FAIL', async () => {
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
                        .inDirectory('**/infra/repositories/**')
                        .should()
                        .onlyHaveName('*Entity.ts')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/infra/repositories/**' should only have name '*Entity.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`);
                }
            }
        });

        test('"use-cases" should only have name "*Service.ts" - should FAIL', async () => {
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
                        .onlyHaveName('*Service.ts')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should only have name '*Service.ts'\n\n`);
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

    describe('Scenario 2: Directory has files and SOME match the pattern', () => {
        test('"use-cases" should only have name "*Todo.ts" - should FAIL', async () => {
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
                        .onlyHaveName('*Todo.ts')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should only have name '*Todo.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
                }
            }
        });

        test('"use-cases" should only have name "Get*.ts" - should FAIL', async () => {
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
                        .onlyHaveName('Get*.ts')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' should only have name 'Get*.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/index.ts'`);
                }
            }
        });
    });

    describe('Scenario 3: Directory has files and ALL files match the pattern', () => {
        test('"entities" excluding "index.ts" should only have name "*Todo.ts" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**', ['!**/index.ts'])
                    .should()
                    .onlyHaveName('*Todo.ts')
                    .check();
            }
        });

        test('"entities" should only have name "*.ts" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
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
                    .onlyHaveName('*.ts')
                    .check();
            }
        });

        test('"infra repositories" should only have name "*Repository.ts" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/repositories/**')
                    .should()
                    .onlyHaveName('*Repository.ts')
                    .check();
            }
        });

        test('"main" should only have name "app.ts" - should PASS', async () => {
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
                    .onlyHaveName('app.ts')
                    .check();
            }
        });

        test('"use-cases" excluding "index.ts" should only have name "*Todo*" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**', ['!**/index.ts'])
                    .should()
                    .onlyHaveName('*Todo*')
                    .check();
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").should().onlyHaveName("").check() - should FAIL (empty pattern)', async () => {
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
                        .onlyHaveName('')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should only have name ''\n\n`);
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
                        .inDirectory('**/entities/**')
                        .should()
                        .onlyHaveName('*Todo.ts')
                        .check();
                    
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should only have name '*Todo.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                }
            }
        });
    });
});
