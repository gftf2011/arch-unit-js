import path from 'path';
import { Options } from '../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../src/fluent-api';

describe('Project with right structure', () => {
    const includeMatchers = [
        ['<rootDir>'],
        ['<rootDir>/'],
        ['<rootDir>/.'],
        ['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'],
        ['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'],
        // ['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**'] // TODO: add glob pattern validation
    ];

    const excludeIndexFiles = [
        true,
        false
    ];

    excludeIndexFiles.forEach((excludeIndexFile) => {
        describe(`excluding index files: ${excludeIndexFile}`, () => {
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
                                .inDirectory('**/domain/**', excludeIndexFile)
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
                                .inDirectory('**/domain/**', excludeIndexFile)
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
                                .inDirectory('**/infra/**', excludeIndexFile)
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
                                .inDirectory('**/domain/**', excludeIndexFile)
                                .shouldNot()
                                .onlyDependsOn(['**/infra/**'])
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
                                .inDirectory('**/domain/**', excludeIndexFile)
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
                                .inDirectory('**/domain/**', excludeIndexFile)
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
                                .inDirectory('**/infra/**', excludeIndexFile)
                                .shouldNot()
                                .onlyDependsOn(['**/domain/**'])
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
                });
            });
        });
    });
});
