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

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample');

describe('Positive scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('beImportedOrRequiredBy', () => {
                test(`check - domain should be imported by infra - must be thruthy`, async () => {
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
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });

                test(`check - domain should be imported by use-cases - must be thruthy`, async () => {
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
                            .beImportedOrRequiredBy('**/use-cases/**')
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });

                test(`check - use-cases should not be imported by infra - must be thruthy`, async () => {
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
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
            
                        expect(answer).toBeTruthy();
                    }
                });

                test(`check - infra should not be imported by use-cases - must be thruthy`, async () => {
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
                            .beImportedOrRequiredBy('**/use-cases/**')
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
            describe('beImportedOrRequiredBy', () => {
                test(`check - domain should not be imported by infra - must be falsy`, async () => {
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
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();
            
                        expect(answer).toBeFalsy();
                    }
                });

                test(`check - domain should not be imported by use-cases - must be falsy`, async () => {
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
                            .beImportedOrRequiredBy('**/use-cases/**')
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
            describe('beImportedOrRequiredBy', () => {
                test(`check - domain should be imported by "" - must throw error`, async () => {
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
                            .beImportedOrRequiredBy('')
                            .check();
                
                        await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should be imported or required by ''\nNo pattern was provided for checking`));
                    }
                });

                test(`check - incorrect 'mimeTypes' - must throw error`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                        try {
                            await  appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .should()
                            .beImportedOrRequiredBy('**/infra/**')
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

        describe('shouldNot', () => {
            describe('beImportedOrRequiredBy', () => {
                test(`check - domain should not be imported by "" - must throw error`, async () => {
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
                            .beImportedOrRequiredBy('')
                            .check();
                
                        await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**'${excludeFilesPattern.length > 0 ? ` - excluding files [${excludeFilesPattern.join(', ')}] ,` : ''} should not be imported or required by ''\nNo pattern was provided for checking`));
                    }
                });

                test(`check - incorrect 'mimeTypes' - must throw error`, async () => {
                    for (const [includeMatcher, excludeFilesPattern] of includeAndExcludeScenarios) {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: [...includeMatcher],
                            ignoreMatcher: ['<rootDir>/app.ts', '<rootDir>/example.ts', '<rootDir>/package.json', '<rootDir>/tsconfig.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                        try {
                            await  appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .beImportedOrRequiredBy('**/infra/**')
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