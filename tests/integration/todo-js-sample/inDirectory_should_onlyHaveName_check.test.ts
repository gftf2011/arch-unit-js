import path from 'path';
import { Options } from '../../../src/fluent-api/common/types';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample');

const includeMatchers = [
    [['<rootDir>/**']],
    [['<rootDir>/**/']],
    [['./**']],
    [['./**/']],
    [['<rootDir>/domain/**', '<rootDir>/use-cases/**', '<rootDir>/infra/**', '<rootDir>/main/**']],
    [['<rootDir>/domain/**/', '<rootDir>/use-cases/**/', '<rootDir>/infra/**/', '<rootDir>/main/**/']],
    [['./domain/**', './use-cases/**', './infra/**', './main/**']],
    [['./domain/**/', './use-cases/**/', './infra/**/', './main/**/']],
];

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('should.onlyHaveName scenarios', () => {
    describe('Scenario 1: Directory has files but NONE match the pattern', () => {
        test('"entities" should only have name "*UseCase.js" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .should()
                    .onlyHaveName('*UseCase.js')
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"infra repositories" should only have name "*Entity.js" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/repositories/**')
                    .should()
                    .onlyHaveName('*Entity.js')
                    .check();

                expect(result).toBe(false);
            }
        });
    });

    describe('Scenario 2: Directory has files and SOME match the pattern', () => {
        test('"use-cases" should only have name "*Todo.js" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .should()
                    .onlyHaveName('*Todo.js')
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"use-cases" should only have name "Get*.js" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .should()
                    .onlyHaveName('Get*.js')
                    .check();

                expect(result).toBe(false);
            }
        });
    });

    describe('Scenario 3: Directory has files and ALL files match the pattern', () => {
        test('"entities" should only have name "*Todo.js" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .should()
                    .onlyHaveName('*Todo.js')
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"entities" should only have name "*.js" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .should()
                    .onlyHaveName('*.js')
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"infra repositories" should only have name "*Repository.js" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/repositories/**')
                    .should()
                    .onlyHaveName('*Repository.js')
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"main" should only have name "app.js" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .should()
                    .onlyHaveName('app.js')
                    .check();

                expect(result).toBe(true);
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").should().onlyHaveName("").check() - should FAIL (empty pattern)', async () => {
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
                        .should()
                        .onlyHaveName('')
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should only have name ''\n`);
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
                        .inDirectory('**/entities/**')
                        .should()
                        .onlyHaveName('*Todo.js')
                        .check();
                    
                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.js' - mismatch\nFile does not is in 'mimeTypes': [**/*.ts] - add desired file extension`);
                }
            }
        });
    });
});
