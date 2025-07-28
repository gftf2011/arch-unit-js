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
    [['<rootDir>']],
    [['<rootDir>/']],
    [['<rootDir>/.']],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra']],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra']],
    [['domain', 'use-cases', 'infra']],
    [['domain/', 'use-cases/', 'infra/']],
    [['^domain', '^use-cases', '^infra']],
    [['^domain/', '^use-cases/', '^infra/']],
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
    [['<rootDir>/infra'], ['**/index.ts']]
];

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample');

describe('Positive scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('onlyDependsOn', () => {
                test(`check - infra should only depends on domain`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
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
                            .onlyDependsOn(['**/domain/**'])
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });

                test(`check - use-cases should only depends on domain - excluding index.ts`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of onlyIncludeWithExcludedFilesScenarios) {
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
                            .onlyDependsOn(['**/domain/**'])
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });
            });
        });

        describe('shouldNot', () => {
            describe('onlyDependsOn', () => {
                test(`check - domain should not only depends on infra`, async () => {
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
                            .onlyDependsOn(['**/infra/**'])
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });

                test(`check - use-cases should not only depends on domain - including index.ts`, async () => {
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
                            .onlyDependsOn(['**/domain/**'])
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
        describe('shouldNot', () => {
            describe('onlyDependsOn', () => {
                test(`check - infra should not only depends on domain`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/infra/**', excludeFilesPattern)
                            .shouldNot()
                            .onlyDependsOn(['**/domain/**'])
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
            describe('onlyDependsOn', () => {
                test(`check - domain should only depends on ""`, async () => {
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
                            .onlyDependsOn([''])
                            .check();
                
                        await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should only depends on '[]'\nNo pattern was provided for checking`));
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
                                .onlyDependsOn(['**/infra/**'])
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toBe(`Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - could not be resolved\n- '${rootDir}/domain/repositories/TodoRepository.ts' - file path was not found\n- '${rootDir}/domain/entities/index.ts' - file path was not found\nCheck if path is being reached by the 'includeMatcher'`);
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
                                .inDirectory('**/infra/**', excludeFilesPattern)
                                .should()
                                .onlyDependsOn(['**/domain/**'])
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            if (excludeFilesPattern.includes('**/index.ts')) {
                                expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/index.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            }
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
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
            describe('onlyDependsOn', () => {
                test(`check - domain should not only depends on ""`, async () => {
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
                            .onlyDependsOn([''])
                            .check();
                
                        await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should not only depends on '[]'\nNo pattern was provided for checking`));
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
                                .onlyDependsOn(['**/infra/**'])
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toBe(`Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - could not be resolved\n- '${rootDir}/domain/repositories/TodoRepository.ts' - file path was not found\n- '${rootDir}/domain/entities/index.ts' - file path was not found\nCheck if path is being reached by the 'includeMatcher'`);
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
                                .inDirectory('**/infra/**', excludeFilesPattern)
                                .shouldNot()
                                .onlyDependsOn(['**/domain/**'])
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/index.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
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