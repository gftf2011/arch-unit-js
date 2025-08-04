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

describe('shouldNot.onlyHaveName scenarios', () => {
    describe('Scenario 1: Directory has files but NONE match the pattern', () => {
        test('"entities" should not only have name "*UseCase.ts" - should PASS', async () => {
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
                    .shouldNot()
                    .onlyHaveName('*UseCase.ts')
                    .check();
            }
        });

        test('"infra repositories" should not only have name "*Entity.ts" - should PASS', async () => {
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
                    .shouldNot()
                    .onlyHaveName('*Entity.ts')
                    .check();
            }
        });

        test('"use-cases" should not only have name "*Service.ts" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .onlyHaveName('*Service.ts')
                    .check();
            }
        });

        test('"main" should not only have name "*Controller.ts" - should PASS', async () => {
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
                    .shouldNot()
                    .onlyHaveName('*Controller.ts')
                    .check();
            }
        });
    });

    describe('Scenario 2: Directory has files and SOME match the pattern', () => {
        test('"use-cases" should not only have name "*Todo.ts" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .onlyHaveName('*Todo.ts')
                    .check();
            }
        });

        test('"use-cases" should not only have name "Get*.ts" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    extensionTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .onlyHaveName('Get*.ts')
                    .check();
            }
        });
    });

    describe('Scenario 3: Directory has files and ALL files match the pattern', () => {
        test('"entities" should not only have name "*.ts" - should FAIL', async () => {
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
                        .shouldNot()
                        .onlyHaveName('*.ts')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not only have name '*.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts'`);
                }
            }
        });

        test('"infra repositories" should not only have name "*Repository.ts" - should FAIL', async () => {
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
                        .shouldNot()
                        .onlyHaveName('*Repository.ts')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/infra/repositories/**' should not only have name '*Repository.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/infra/repositories/InMemoryTodoRepository.ts'`);
                }
            }
        });

        test('"main" should not only have name "app.ts" - should FAIL', async () => {
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
                        .shouldNot()
                        .onlyHaveName('app.ts')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/main/**' should not only have name 'app.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/main/app.ts'`);
                }
            }
        });

        test('"use-cases" excluding "index.ts" should not only have name "*Todo*" - should FAIL', async () => {
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
                        .shouldNot()
                        .onlyHaveName('*Todo*')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/use-cases/**' - excluding files [!**/index.ts] , should not only have name '*Todo*'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/CreateTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/DeleteTodo.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetAllTodos.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/GetTodoById.ts'`);
                    expect(errorMessage).toContain(`- '${rootDir}/use-cases/UpdateTodo.ts'`);
                }
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").shouldNot().onlyHaveName("").check() - should FAIL (empty pattern)', async () => {
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
                        .shouldNot()
                        .onlyHaveName('')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should not only have name ''\n\n`);
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
                        .shouldNot()
                        .onlyHaveName('*Todo.ts')
                        .check();
                    
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not only have name '*Todo.ts'\n\n`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/Todo.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                    expect(errorMessage).toContain(`- '${rootDir}/domain/entities/index.ts' - mismatch in 'extensionTypes': [**/*.js]`);
                }
            }
        });
    });
});
