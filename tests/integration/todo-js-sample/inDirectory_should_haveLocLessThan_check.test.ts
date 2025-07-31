import path from 'path';
import { Options } from '../../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample');

const includeMatchers = [
    [['<rootDir>']],
    [['<rootDir>/']],
    [['<rootDir>/.']],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra', '<rootDir>/main']],
    [['domain', 'use-cases', 'infra', 'main']],
    [['domain/', 'use-cases/', 'infra/', 'main/']],
];

const excludeMatchers = ['<rootDir>/package.json'];

describe('should.haveLocLessThan scenarios', () => {
    describe('Scenario 1: All files have lines of code LESS than the threshold', () => {
        test('"use-cases" should have LOC less than 50 - should PASS', async () => {
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
                    .haveLocLessThan(50)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"entities" should have LOC less than 30 - should PASS', async () => {
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
                    .haveLocLessThan(30)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"domain" should have LOC less than 40 - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/**')
                    .should()
                    .haveLocLessThan(40)
                    .check();

                expect(result).toBe(true);
            }
        });
    });

    describe('Scenario 2: ANY files have lines of code GREATER than or EQUAL to the threshold', () => {
        test('"use-cases" should have LOC less than 30 - should FAIL (UpdateTodo.js exceeds threshold)', async () => {
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
                    .haveLocLessThan(30)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"domain" should have LOC less than 20 - should FAIL (multiple files exceed threshold)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/**')
                    .should()
                    .haveLocLessThan(20)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('entire project should have LOC less than 10 - should FAIL (all files exceed threshold)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .should()
                    .haveLocLessThan(10)
                    .check();

                expect(result).toBe(false);
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/nonexistent/**").should().haveLocLessThan(10).check() - should throw error (no files exist)', async () => {
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
                        .inDirectory('**/nonexistent/**')
                        .should()
                        .haveLocLessThan(10)
                        .check();

                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/nonexistent/**' should have L.O.C. less than: 10\n`);
                    expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
                }
            }
        });

        test('threshold of 0 should always FAIL (no files can have less than 0 LOC)', async () => {
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
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocLessThan(0)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. less than: 0\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('threshold of -1 should always FAIL (impossible scenario)', async () => {
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
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocLessThan(-1)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should have L.O.C. less than: -1\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('very high threshold should always PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .should()
                    .haveLocLessThan(1000)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('incorrect extension', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'], // Looking for TypeScript in JavaScript project
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .should()
                        .haveLocLessThan(50)
                        .check();
                    
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
    });
});
