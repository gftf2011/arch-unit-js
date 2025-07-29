import path from 'path';
import { Options } from '../../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const includeAndExcludeScenarios = [
    [['<rootDir>'], []],
    [['<rootDir>'], ['!**/index.ts']],
    [['<rootDir>/'], []],
    [['<rootDir>/'], ['!**/index.ts']],
    [['<rootDir>/.'], []],
    [['<rootDir>/.'], ['!**/index.ts']],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], []],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], ['!**/index.ts']],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], []],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], ['!**/index.ts']],
    [['domain', 'use-cases', 'infra'], []],
    [['domain', 'use-cases', 'infra'], ['!**/index.ts']],
    [['domain/', 'use-cases/', 'infra/'], []],
    [['domain/', 'use-cases/', 'infra/'], ['!**/index.ts']],
    [['^domain', '^use-cases', '^infra'], []],
    [['^domain', '^use-cases', '^infra'], ['!**/index.ts']],
    [['^domain/', '^use-cases/', '^infra/'], []],
    [['^domain/', '^use-cases/', '^infra/'], ['!**/index.ts']],
];

const onlyIncludeScenarios = [
    [['<rootDir>'], []],
    [['<rootDir>/'], []],
    [['<rootDir>/.'], []],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], []],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], []],
    [['domain', 'use-cases', 'infra'], []],
    [['domain/', 'use-cases/', 'infra/'], []],
    [['^domain', '^use-cases', '^infra'], []],
    [['^domain/', '^use-cases/', '^infra/'], []],
];

const onlyIncludeWithExcludedFilesScenarios = [
    [['<rootDir>'], ['!**/index.ts']],
    [['<rootDir>/'], ['!**/index.ts']],
    [['<rootDir>/.'], ['!**/index.ts']],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], ['!**/index.ts']],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], ['!**/index.ts']],
    [['domain', 'use-cases', 'infra'], ['!**/index.ts']],
    [['domain/', 'use-cases/', 'infra/'], ['!**/index.ts']],
    [['^domain', '^use-cases', '^infra'], ['!**/index.ts']],
    [['^domain/', '^use-cases/', '^infra/'], ['!**/index.ts']],
];

const invalidIncludeAndExcludeScenarios = [
    [['<rootDir>/infra'], []],
    [['<rootDir>/infra'], ['!**/index.ts']]
];

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample');

describe('Positive scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('haveName', () => {
                test(`check - domain files should have name containing 'Todo'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .should()
                            .haveName('*Todo*')
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });

                test(`check - use-cases files should have name containing 'Todo'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/use-cases/**', excludeFilesPattern)
                            .should()
                            .haveName('*Todo*')
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });

                test(`check - infra files should have name containing 'InMemory'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of onlyIncludeWithExcludedFilesScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/infra/**', excludeFilesPattern)
                            .should()
                            .haveName('*InMemory*')
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });

                test(`check - repositories should have name containing 'Repository'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/repositories/**', excludeFilesPattern)
                            .should()
                            .haveName('*Repository*')
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });
            });
        });

        describe('shouldNot', () => {
            describe('haveName', () => {
                test(`check - use-cases files should not have name containing 'Repository' - including index.ts`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of onlyIncludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/use-cases/**', excludeFilesPattern)
                            .shouldNot()
                            .haveName('*Repository*')
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });
            });
        });
    });
});

describe('Negative scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('haveName', () => {
                test(`check - domain files should have name containing 'MamaMia'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .should()
                            .haveName('*MamaMia*')
                            .check();
            
                        expect(answer).toBeFalsy();
                    }
                });
            });
        });

        describe('shouldNot', () => {
            describe('haveName', () => {
                test(`check - domain files should not have name containing 'Repository'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .haveName('*Repository*')
                            .check();
        
                        expect(answer).toBeFalsy();
                    }
                });

                test(`check - domain files should not have name containing 'Todo'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .haveName('*Todo*')
                            .check();
            
                        expect(answer).toBeFalsy();
                    }
                });

                test(`check - use-cases files should not have name containing 'Todo'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/use-cases/**', excludeFilesPattern)
                            .shouldNot()
                            .haveName('*Todo*')
                            .check();
            
                        expect(answer).toBeFalsy();
                    }
                });
            });
        });
    });
});

describe('Edge scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('haveName', () => {
                test(`check - domain should have name "" - must throw error`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .should()
                            .haveName('')
                            .check();
                
                        await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should have name ''\nNo pattern was provided for checking`));
                    }
                });

                test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of invalidIncludeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        try {
                            await appInstance
                                .projectFiles()
                                .inDirectory('**/domain/**', excludeFilesPattern)
                                .should()
                                .haveName('*Todo*')
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toBe(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should have name '*Todo*'\nNo files found in '[**/domain/**]'`);
                        }
                    }
                });

                test(`check - incorrect 'mimeTypes'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        try {
                            await appInstance
                                .projectFiles()
                                .inDirectory('**/domain/**', excludeFilesPattern)
                                .should()
                                .haveName('*Todo*')
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/index.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/index.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/CreateTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/DeleteTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetAllTodos.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetTodoById.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/UpdateTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                        }
                    }
                });
            });
        });

        describe('shouldNot', () => {
            describe('haveName', () => {
                test(`check - domain should not have name "" - must throw error`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .haveName('')
                            .check();
                
                        await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should not have name ''\nNo pattern was provided for checking`));
                    }
                });

                test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of invalidIncludeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        try {
                            await appInstance
                                .projectFiles()
                                .inDirectory('**/domain/**', excludeFilesPattern)
                                .shouldNot()
                                .haveName('*Todo*')
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toBe(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should not have name '*Todo*'\nNo files found in '[**/domain/**]'`);
                        }
                    }
                });

                test(`check - incorrect 'mimeTypes'`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        try {
                            await appInstance
                                .projectFiles()
                                .inDirectory('**/domain/**', excludeFilesPattern)
                                .shouldNot()
                                .haveName('*Todo*')
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/index.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/index.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/CreateTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/DeleteTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetAllTodos.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetTodoById.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/UpdateTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                        }
                    }
                });
            });
        });
    });
});
