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

describe('shouldNot.dependsOn scenarios', () => {
    describe('Scenario 1: File has NO dependencies', () => {
        test('"domain/entities" should not depend on "domain" - should PASS', async () => {
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
                    .dependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"domain/entities" should not depend on "infra" - should PASS', async () => {
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
                    .dependsOn(['**/infra/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
    });

    describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
        test('"use-cases" should not depend on "infra" - should PASS (use-cases imports from domain, not infra)', async () => {
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
                    .dependsOn(['**/infra/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"infra" should not depend on "use-cases" - should PASS (infra imports from domain, not use-cases)', async () => {
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
                    .dependsOn(['**/use-cases/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"use-cases" should not depend on "inexistent-dependency" - should PASS', async () => {
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
                    .dependsOn(['inexistent-dependency'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
    });

    describe('Scenario 3: File has dependencies and ANY patterns are present', () => {
        test('"use-cases" should not depend on "domain" - should FAIL (use-cases imports from domain)', async () => {
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
                    .dependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"infra" should not depend on "domain" - should FAIL (infra imports from domain)', async () => {
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
                    .dependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should not depend on "domain" - should FAIL (main imports from domain)', async () => {
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
                    .dependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should not depend on "use-cases" - should FAIL (main imports from use-cases)', async () => {
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
                    .dependsOn(['**/use-cases/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should not depend on "infra" - should FAIL (main imports from infra)', async () => {
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
                    .dependsOn(['**/infra/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should not depend on "domain" and "use-cases" - should FAIL (main imports from both)', async () => {
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
                    .dependsOn(['**/domain/**', '**/use-cases/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should not depend on "domain", "use-cases" and "infra" - should FAIL (main imports from all)', async () => {
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
                    .dependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").shouldNot().dependsOn([]).check() - should FAIL (empty array)', async () => {
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
                        .dependsOn([])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files inDirectory '**/domain/**' should not depends on '[]'\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
            }
        });

        test('projectFiles.inDirectory("**/domain/**").shouldNot().dependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
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
                        .dependsOn(["uuid", ""])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files inDirectory '**/domain/**' should not depends on '[uuid, ]'\n`);
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
                        .dependsOn(['**/domain/**'])
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
                .dependsOn(['**/infra/**'])
                .check();
            
            const errorsMessage = [
                `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '${rootDir}/domain/repositories/TodoRepository.js' - file path was not found\nCheck if path is being reached by the 'includeMatcher'`,
            ];

            await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
        });
    });
});
