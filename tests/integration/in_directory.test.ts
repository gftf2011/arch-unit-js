import path from 'path';
import { Options } from '../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../src/fluent-api';

const includeMatchers = [
    ['<rootDir>'],
    ['<rootDir>/'],
    ['<rootDir>/.'],
    ['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'],
    ['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'],
    ['domain', 'use-cases', 'infra'],
    ['domain/', 'use-cases/', 'infra/'],
    ['^domain', '^use-cases', '^infra'],
    ['^domain/', '^use-cases/', '^infra/'],
];

const excludeJsFilesPatterns = [
    [],
    ['**/index.js']
];

const excludeTsFilesPatterns = [
    [],
    ['**/index.ts']
];

describe('Project: todo-js-sample', () => {
    excludeJsFilesPatterns.forEach((excludeFilesPattern) => {
        describe(`excluding: [${excludeFilesPattern.join(', ')}]`, () => {
            describe('thruthy scenarios', () => {
                describe('inDirectory', () => {
                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.beImportedOrRequiredBy.check - domain should be imported by infra - must be thruthy - includeMatcher: "[${includeMatcher.join(', ')}]"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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
                
                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.beImportedOrRequiredBy.check - domain should be imported by use-cases - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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

                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.onlyDependsOn.check - infra should only depends on domain - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                            const options: Options = {
                                mimeTypes: ['**/*.js'],
                                includeMatcher: [...includeMatcher],
                                ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                            };
                            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                            const answer = await appInstance
                                .projectFiles()
                                .inDirectory('**/infra/**', excludeFilesPattern)
                                .should()
                                .onlyDependsOn(['**/domain/**'])
                                .check();
                
                            expect(answer).toBeTruthy();
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.onlyDependsOn.check - use-cases should only depends on domain - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                            const options: Options = {
                                mimeTypes: ['**/*.js'],
                                includeMatcher: [...includeMatcher],
                                ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                            };
                            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                            const answer = await appInstance
                                .projectFiles()
                                .inDirectory('**/use-cases/**', excludeFilesPattern)
                                .should()
                                .onlyDependsOn(['**/domain/**'])
                                .check();
                
                            expect(answer).toBeTruthy();
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.onlyDependsOn.check - domain should not only depends on infra - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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
                                .onlyDependsOn(['**/infra/**'])
                                .check();
                
                            expect(answer).toBeTruthy();
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.onlyHaveName.check - 'repositories' should only have name '*Repository*' - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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

                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.onlyHaveName.check - 'domain' should not only have name '*Repository*' - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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

                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.onlyHaveName.check - 'use-cases' should not only have name '*Repository*' - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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

            describe('falsy scenarios', () => {
                describe('inDirectory', () => {
                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.beImportedOrRequiredBy.check - domain should not be imported by infra - must be falsy - includeMatcher: "[${includeMatcher.join(', ')}]"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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

                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.beImportedOrRequiredBy.check - domain should not be imported by use-cases - must be falsy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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

                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.onlyDependsOn.check - infra should not only depends on domain - must be falsy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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
                                .onlyDependsOn(['**/domain/**'])
                                .check();
                
                            expect(answer).toBeFalsy();
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.onlyHaveName.check - 'repositories' should not only have name '*Repository*' - must be falsy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
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

            describe('edge cases', () => {
                describe('inDirectory', () => {
                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.onlyDependsOn.check - domain should only depends on "" - must throw error - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                            const options: Options = {
                                mimeTypes: ['**/*.js'],
                                includeMatcher: [...includeMatcher],
                                ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                            };
                            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                            const promise = appInstance
                                .projectFiles()
                                .inDirectory('**/domain/**')
                                .should()
                                .onlyDependsOn([''])
                                .check();
                    
                            await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**' should only depends on '[]'\nNo pattern was provided for checking`));
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.beImportedOrRequiredBy.check - domain should be imported by "" - must throw error - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                            const options: Options = {
                                mimeTypes: ['**/*.js'],
                                includeMatcher: [...includeMatcher],
                                ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                            };
                            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                            const promise = appInstance
                                .projectFiles()
                                .inDirectory('**/domain/**')
                                .should()
                                .beImportedOrRequiredBy('')
                                .check();
                    
                            await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**' should be imported or required by ''\nNo pattern was provided for checking`));
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.onlyDependsOn.check - domain should not only depends on "" - must throw error - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                            const options: Options = {
                                mimeTypes: ['**/*.js'],
                                includeMatcher: [...includeMatcher],
                                ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                            };
                            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                            const promise = appInstance
                                .projectFiles()
                                .inDirectory('**/domain/**')
                                .shouldNot()
                                .onlyDependsOn([''])
                                .check();
                    
                            await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**' should not only depends on '[]'\nNo pattern was provided for checking`));
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`shouldNot.beImportedOrRequiredBy.check - domain should not be imported by "" - must throw error - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                            const options: Options = {
                                mimeTypes: ['**/*.js'],
                                includeMatcher: [...includeMatcher],
                                ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                            };
                            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                            const promise = appInstance
                                .projectFiles()
                                .inDirectory('**/domain/**')
                                .shouldNot()
                                .beImportedOrRequiredBy('')
                                .check();
                    
                            await expect(promise).rejects.toThrow(new Error(`Violation - Rule: project files inDirectory '**/domain/**' should not be imported or required by ''\nNo pattern was provided for checking`));
                        });
                    });

                    test(`should.beImportedOrRequiredBy.check - incorrect 'mimeTypes' - must throw error - includeMatcher: "[<rootDir>]"`, async () => {
                        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: ['<rootDir>'],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .should()
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();

                        const errors = [
                            `File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                        ];

                        await expect(promise).rejects.toThrow(new Error(errors.join('\n\n')));
                    });

                    test(`shouldNot.beImportedOrRequiredBy.check - incorrect 'mimeTypes' - must throw error - includeMatcher: "[<rootDir>]"`, async () => {
                        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: ['<rootDir>'],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/domain/**', excludeFilesPattern)
                            .shouldNot()
                            .beImportedOrRequiredBy('**/infra/**')
                            .check();

                        const errors = [
                            `File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                        ];

                        await expect(promise).rejects.toThrow(new Error(errors.join('\n\n')));
                    });

                    test(`should.onlyDependsOn.check - incorrect 'mimeTypes' - must throw error - includeMatcher: "[<rootDir>]"`, async () => {
                        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: ['<rootDir>'],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/infra/**', excludeFilesPattern)
                            .should()
                            .onlyDependsOn(['**/domain/**'])
                            .check();

                        const errors = [
                            `File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                        ];

                        await expect(promise).rejects.toThrow(new Error(errors.join('\n\n')));
                    });

                    test(`shouldNot.onlyDependsOn.check - incorrect 'mimeTypes' - must throw error - includeMatcher: "[<rootDir>]"`, async () => {
                        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                        const options: Options = {
                            mimeTypes: ['**/*.ts'],
                            includeMatcher: ['<rootDir>'],
                            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
                        };
                        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                        const promise = appInstance
                            .projectFiles()
                            .inDirectory('**/infra/**', excludeFilesPattern)
                            .shouldNot()
                            .onlyDependsOn(['**/domain/**'])
                            .check();

                        const errors = [
                            `File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/domain/repositories/TodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/CreateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/DeleteTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/GetAllTodos.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/GetTodoById.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                            `File: '${rootDir}/use-cases/UpdateTodo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`,
                        ];

                        await expect(promise).rejects.toThrow(new Error(errors.join('\n\n')));
                    });

                    test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
                        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample');
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
                            includeMatcher: ['<rootDir>/infra'],
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
    });
});

describe('Project: todo-js-sample-with-invalid-dependencies', () => {
    test(`should.beImportedOrRequiredBy.check - incorrect path dependencies - must throw error`, async () => {
        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample-with-invalid-dependencies');
        const options: Options = {
            mimeTypes: ['**/*.js'],
            includeMatcher: ['<rootDir>'],
            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        const promise = appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .should()
            .beImportedOrRequiredBy('**/infra/**')
            .check();

        const errorsMessage = [
            `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '../../../domain/repositories/TodoRepository'\nCheck if dependency is listed in packge.json OR if dependency path is valid`,
            `Dependencies in file: '${rootDir}/use-cases/CreateTodo.js' - could not be resolved\n- '../../domain/entities/Todo'\nCheck if dependency is listed in packge.json OR if dependency path is valid`,
        ];

        await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
    });

    test(`shouldNot.beImportedOrRequiredBy.check - incorrect path dependencies - must throw error`, async () => {
        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample-with-invalid-dependencies');
        const options: Options = {
            mimeTypes: ['**/*.js'],
            includeMatcher: ['<rootDir>'],
            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        const promise = appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .beImportedOrRequiredBy('**/infra/**')
            .check();

        const errorsMessage = [
            `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '../../../domain/repositories/TodoRepository'\nCheck if dependency is listed in packge.json OR if dependency path is valid`,
            `Dependencies in file: '${rootDir}/use-cases/CreateTodo.js' - could not be resolved\n- '../../domain/entities/Todo'\nCheck if dependency is listed in packge.json OR if dependency path is valid`,
        ];

        await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
    });

    test(`should.onlyDependsOn.check - incorrect path dependencies - must throw error`, async () => {
        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample-with-invalid-dependencies');
        const options: Options = {
            mimeTypes: ['**/*.js'],
            includeMatcher: ['<rootDir>'],
            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        const promise = appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .should()
            .onlyDependsOn(['**/domain/**'])
            .check();

        const errorsMessage = [
            `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '../../../domain/repositories/TodoRepository'\nCheck if dependency is listed in packge.json OR if dependency path is valid`,
            `Dependencies in file: '${rootDir}/use-cases/CreateTodo.js' - could not be resolved\n- '../../domain/entities/Todo'\nCheck if dependency is listed in packge.json OR if dependency path is valid`,
        ];

        await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
    });

    test(`shouldNot.onlyDependsOn.check - incorrect path dependencies - must throw error`, async () => {
        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample-with-invalid-dependencies');
        const options: Options = {
            mimeTypes: ['**/*.js'],
            includeMatcher: ['<rootDir>'],
            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        const promise = appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .shouldNot()
            .onlyDependsOn(['**/domain/**'])
            .check();

        const errorsMessage = [
            `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '../../../domain/repositories/TodoRepository'\nCheck if dependency is listed in packge.json OR if dependency path is valid`,
            `Dependencies in file: '${rootDir}/use-cases/CreateTodo.js' - could not be resolved\n- '../../domain/entities/Todo'\nCheck if dependency is listed in packge.json OR if dependency path is valid`,
        ];

        await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
    });

    test(`should.onlyHaveName.check - incorrect path dependencies - must not throw error`, async () => {
        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample-with-invalid-dependencies');
        const options: Options = {
            mimeTypes: ['**/*.js'],
            includeMatcher: ['<rootDir>'],
            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        const answer = await appInstance
            .projectFiles()
            .inDirectory('**/infra/**')
            .should()
            .onlyHaveName('*Repository*')
            .check();

        expect(answer).toBeTruthy();
    });

    test(`shouldNot.onlyHaveName.check - incorrect path dependencies - must not throw error`, async () => {
        const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-js-sample-with-invalid-dependencies');
        const options: Options = {
            mimeTypes: ['**/*.js'],
            includeMatcher: ['<rootDir>'],
            ignoreMatcher: ['<rootDir>/app.js', '<rootDir>/example.js', '<rootDir>/package.json']
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        const answer = await appInstance
            .projectFiles()
            .inDirectory('**/domain/**')
            .shouldNot()
            .onlyHaveName('*Repository*')
            .check();

        expect(answer).toBeTruthy();
    });
});

describe('Project: todo-ts-sample', () => {
    excludeTsFilesPatterns.forEach((excludeFilesPattern) => {
        describe(`excluding: [${excludeFilesPattern.join(', ')}]`, () => {
            describe('thruthy scenarios', () => {
                describe('inDirectory', () => {
                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.beImportedOrRequiredBy.check - domain should be imported by infra - must be thruthy - includeMatcher: "[${includeMatcher.join(', ')}]"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-ts-sample');
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
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.beImportedOrRequiredBy.check - domain should be imported by use-cases - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-ts-sample');
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
                        });
                    });

                    includeMatchers.forEach((includeMatcher) => {
                        test(`should.onlyDependsOn.check - use-cases should only depends on domain - must be thruthy - includeMatcher: "${includeMatcher}"`, async () => {
                            const rootDir = path.resolve(path.dirname(__filename), '..', 'sample', 'todo-ts-sample');
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
                        });
                    });
                });
            });
        });
    });
});
