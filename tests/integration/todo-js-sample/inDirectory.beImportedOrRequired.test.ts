import path from 'path';
import { Options } from '../../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const includeAndExcludeScenarios = [
    [['<rootDir>'], []],
    [['<rootDir>'], ['!**/index.js']],
    [['<rootDir>/'], []],
    [['<rootDir>/'], ['!**/index.js']],
    [['<rootDir>/.'], []],
    [['<rootDir>/.'], ['!**/index.js']],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], []],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], ['!**/index.js']],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], []],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], ['!**/index.js']],
    [['domain', 'use-cases', 'infra'], []],
    [['domain', 'use-cases', 'infra'], ['!**/index.js']],
    [['domain/', 'use-cases/', 'infra/'], []],
    [['domain/', 'use-cases/', 'infra/'], ['!**/index.js']],
    [['^domain', '^use-cases', '^infra'], []],
    [['^domain', '^use-cases', '^infra'], ['!**/index.js']],
    [['^domain/', '^use-cases/', '^infra/'], []],
    [['^domain/', '^use-cases/', '^infra/'], ['!**/index.js']],
];

const invalidIncludeAndExcludeScenarios = [
    [['<rootDir>/infra'], []],
    [['<rootDir>/infra'], ['**/index.js']]
];

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample');

describe('Positive scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('beImportedOrRequiredBy', () => {
                test(`check - domain should be imported by infra`, () => {
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
                            .should()
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
            
                        expect(answer).toBeTruthy();
                    });
                });

                test(`check - domain should be imported by use-cases`, () => {
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
                            .should()
                            .beImportedOrRequiredBy('**/use-cases/**')
                            .check();
            
                        expect(answer).toBeTruthy();
                    });
                });

                test(`check - use-cases should not be imported by infra`, () => {
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
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
            
                        expect(answer).toBeTruthy();
                    });
                });

                test(`check - infra should not be imported by infra`, () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/infra/**', excludeFilesPattern)
                            .shouldNot()
                            .beImportedOrRequiredBy('**/use-cases/**')
                            .check();
            
                        expect(answer).toBeTruthy();
                    });
                });
            });
        });

        describe('shouldNot', () => {
            describe('beImportedOrRequiredBy', () => {
                test(`check - use-cases should not be imported by infra`, () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const answer = await appInstance
                            .projectFiles()
                            .inDirectory('**/infra/**', excludeFilesPattern)
                            .shouldNot()
                            .beImportedOrRequiredBy('**/use-cases/**')
                            .check();
            
                        expect(answer).toBeTruthy();
                    });
                });
            });
        });
    });
});

describe('Negative scenarios', () => {
    describe('inDirectory', () => {
        describe('shouldNot', () => {
            describe('beImportedOrRequiredBy', () => {
                test(`check - domain should not be imported by infra`, () => {
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
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
            
                        expect(answer).toBeFalsy();
                    });
                });

                test(`check - domain should not be imported by use-cases`, () => {
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
                            .beImportedOrRequiredBy('**/use-cases/**')
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
            describe('beImportedOrRequiredBy', () => {
                test(`check - domain should be imported by ""`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .should()
                            .beImportedOrRequiredBy('')
                            .check();
                
                        await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should be imported or required by ''\nNo pattern was provided for checking`));
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
                                .inDirectory('**/domain/**', excludeFilesPattern)
                                .should()
                                .beImportedOrRequiredBy('**/infra/**')
                                .check();       
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                        }
                    });
                });

                test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
                    invalidIncludeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .should()
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
                        
                        const errorsMessage = [
                            `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '${rootDir}/domain/repositories/TodoRepository.js' - file path was not found\nCheck if path is being reached by the 'includeMatcher'`,
                        ];
    
                        await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
                    });
                });
            });
        });

        describe('shouldNot', () => {
            describe('beImportedOrRequiredBy', () => {
                test(`check - domain should not be imported by ""`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .beImportedOrRequiredBy('')
                            .check();
                
                        await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should not be imported or required by ''\nNo pattern was provided for checking`));
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
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
                        } catch (error) {
                            const errorMessage = (error as Error).message;

                            expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                            expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                        }
                    });
                });

                test(`must throw error if file path is not being reached by the 'includeMatcher'`, () => {
                    invalidIncludeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
                        
                        const errorsMessage = [
                            `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '${rootDir}/domain/repositories/TodoRepository.js' - file path was not found\nCheck if path is being reached by the 'includeMatcher'`,
                        ];
    
                        await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
                    });
                });
            });
        });
    });
});