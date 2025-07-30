import path from 'path';
import { Options } from '../../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample');

const includeMatchers = [
    [['<rootDir>']],
    [['<rootDir>/']],
    [['<rootDir>/.']],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra', '<rootDir>/main']],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra', '^<rootDir>/main']],
    [['domain', 'use-cases', 'infra', 'main']],
    [['domain/', 'use-cases/', 'infra/', 'main/']],
    [['^domain', '^use-cases', '^infra', '^main']],
    [['^domain/', '^use-cases/', '^infra/', '^main/']]
];

const excludeMatchers = ['<rootDir>/package.json'];

describe('shouldNot.onlyDependsOn scenarios', () => {
    describe('Scenario 1: File has NO dependencies', () => {
        test('"domain/entities" should not only depend on "domain" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .shouldNot()
                    .onlyDependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
    });

    describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
        test('"use-cases" should not only depend on "infra" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .onlyDependsOn(['**/infra/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
    });

    describe('Scenario 3: File has mixed dependencies', () => {
        test('"main" should not only depend on "domain" - should PASS (has mixed dependencies)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .shouldNot()
                    .onlyDependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"main" should not only depend on "domain" and "use-cases" - should PASS (has mixed dependencies)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .shouldNot()
                    .onlyDependsOn(['**/domain/**', '**/use-cases/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
    });

    describe('Scenario 4: File has exclusive dependencies to specified patterns', () => {
        test('"infra" should not only depend on "domain" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/**')
                    .shouldNot()
                    .onlyDependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should not only depend on "domain" and "use-cases" and "infra" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .shouldNot()
                    .onlyDependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").should().onlyDependsOn([]).check() - should FAIL (empty array)', async () => {
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
                        .onlyDependsOn([])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files inDirectory '**/domain/**' should not only depends on '[]'\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
            }
        });

        test('projectFiles.inDirectory("**/domain/**").should().onlyDependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
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
                        .onlyDependsOn(["uuid", ""])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files inDirectory '**/domain/**' should not only depends on '[uuid, ]'\n`);
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
                        .inDirectory('**/infra/**')
                        .shouldNot()
                        .onlyDependsOn(['**/domain/**'])
                        .check();
                    
                    // If we get here, the test should fail
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

        test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
            const options: Options = {
                mimeTypes: ['**/*.js'],
                includeMatcher: ['<rootDir>/infra'],
                ignoreMatcher: excludeMatchers
            };
            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
            const promise = appInstance
                .projectFiles()
                .inDirectory('**/domain/**')
                .shouldNot()
                .onlyDependsOn(['**/infra/**'])
                .check();
            
            const errorsMessage = [
                `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '${rootDir}/domain/repositories/TodoRepository.js' - file path was not found\nCheck if path is being reached by the 'includeMatcher'`,
            ];

            await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
        });
    });
});
