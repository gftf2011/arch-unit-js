import path from 'path';
import { Options } from '../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../src/fluent-api';

describe('Project with right structure', () => {
    const includeMatchers = [
        ['<rootDir>'],
        ['<rootDir>/'],
        ['<rootDir>/.'],
        ['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'],
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
                });
            });
        });
    });
});
