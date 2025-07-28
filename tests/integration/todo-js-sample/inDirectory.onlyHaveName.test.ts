import path from 'path';
import { Options } from '../../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const includeAndExcludeScenarios = [
    [['<rootDir>'], []],
    [['<rootDir>'], ['**/index.js']],
    [['<rootDir>/'], []],
    [['<rootDir>/'], ['**/index.js']],
    [['<rootDir>/.'], []],
    [['<rootDir>/.'], ['**/index.js']],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], []],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], ['**/index.js']],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], []],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], ['**/index.js']],
    [['domain', 'use-cases', 'infra'], []],
    [['domain', 'use-cases', 'infra'], ['**/index.js']],
    [['domain/', 'use-cases/', 'infra/'], []],
    [['domain/', 'use-cases/', 'infra/'], ['**/index.js']],
    [['^domain', '^use-cases', '^infra'], []],
    [['^domain', '^use-cases', '^infra'], ['**/index.js']],
    [['^domain/', '^use-cases/', '^infra/'], []],
    [['^domain/', '^use-cases/', '^infra/'], ['**/index.js']],
];

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample');

describe('Positive scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('onlyHaveName', () => {
                test(`check - 'repositories' should only have name '*Repository*'`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/repositories/**', excludeFilesPattern)
                            .should()
                            .onlyHaveName('*Repository*')
                            .check();
            
                        expect(answer).toBeTruthy();
                    });
                });
            });
        });

        describe('shouldNot', () => {
            test(`check - 'domain' should not only have name '*Repository*'`, async () => {
                includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                    const options: Options = {
                        mimeTypes: ['**/*.js'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                    const answer = await appInstance
                        .projectFiles()
                        .inDirectory('**/domain/**', excludeFilesPattern)
                        .shouldNot()
                        .onlyHaveName('*Repository*')
                        .check();
        
                    expect(answer).toBeTruthy();
                });
            });

            test(`check - 'use-cases' should not only have name '*Repository*'`, async () => {
                includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                    const options: Options = {
                        mimeTypes: ['**/*.js'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                    const answer = await appInstance
                        .projectFiles()
                        .inDirectory('**/use-cases/**', excludeFilesPattern)
                        .shouldNot()
                        .onlyHaveName('*Repository.js')
                        .check();
        
                    expect(answer).toBeTruthy();
                });
            });
        });
    });
});

describe('Negative scenarios', () => {
    describe('inDirectory', () => {
        describe('shouldNot', () => {
            describe('onlyHaveName', () => {
                test(`check - 'repositories' should not only have name '*Repository*'`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/repositories/**', excludeFilesPattern)
                            .shouldNot()
                            .onlyHaveName('*Repository*')
                            .check();
            
                        expect(answer).toBeFalsy();
                    });
                });
            });
        });
    });
});

describe('Edge scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('onlyHaveName', () => {
                test(`check - domain should only have name ""`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .should()
                            .onlyHaveName('')
                            .check();
    
                        const errors = [
                            `Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should have name ''\nNo pattern was provided for checking`,
                        ];
    
                        await expect(promise).rejects.toThrow(new Error(errors.join('\n\n')));
                    });
                });

                test(`check - incorrect 'mimeTypes'`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        try {
                            await appInstance
                                .projectFiles()
                                .inDirectory('**/infra/**', excludeFilesPattern)
                                .should()
                                .onlyHaveName('*Repository*')
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                        }
                    });
                });
            });
        });

        describe('shouldNot', () => {
            describe('onlyHaveName', () => {
                test(`check - domain should not only have name ""`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .onlyHaveName('')
                            .check();
    
                            const errors = [
                                `Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should not have name ''\nNo pattern was provided for checking`,
                            ];
    
                        await expect(promise).rejects.toThrow(new Error(errors.join('\n\n')));
                    });
                });

                test(`check - incorrect 'mimeTypes'`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        try {
                            await appInstance
                                .projectFiles()
                                .inDirectory('**/infra/**', excludeFilesPattern)
                                .shouldNot()
                                .onlyHaveName('*Repository*')
                                .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                        }
                    });
                });
            });
        });
    });
});