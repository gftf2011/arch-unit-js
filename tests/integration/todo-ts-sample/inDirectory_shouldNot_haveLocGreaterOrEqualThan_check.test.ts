import path from 'path';
import { Options } from '../../../src/fluent-api/common/types';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-ts-sample');

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

const excludeMatchers = ['!<rootDir>/**/package.json', '!<rootDir>/**/tsconfig.json'];

describe('shouldNot.haveLocGreaterOrEqualThan scenarios', () => {
    describe('Scenario 1: All files have lines of code LESS than the threshold', () => {
        test('"entities" should not have LOC greater or equal than 50 - should PASS (all files < 50)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(50)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"use-cases" should not have LOC greater or equal than 50 - should PASS (all files < 50)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(50)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"domain" should not have LOC greater or equal than 35 - should PASS (all files < 35)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(35)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"use-cases" excluding UpdateTodo.ts should not have LOC greater or equal than 20 - should PASS (all remaining files < 20)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**', ['!**/use-cases/UpdateTodo.ts'])
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(20)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('entire project should not have LOC greater or equal than 100 - should PASS (all files < 100)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(100)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('"entities" excluding Todo.ts should not have LOC greater or equal than 10 - should PASS (index.ts has only 1 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**', ['!**/entities/Todo.ts'])
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(10)
                    .check();

                expect(result).toBe(true);
            }
        });
    });

    describe('Scenario 2: ANY files have lines of code GREATER than or EQUAL to the threshold', () => {
        test('"main" should not have LOC greater or equal than 40 - should FAIL (app.ts has exactly 40 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(40)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"infra" should not have LOC greater or equal than 32 - should FAIL (InMemoryTodoRepository.ts has exactly 32 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(32)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"entities" should not have LOC greater or equal than 28 - should FAIL (Todo.ts has exactly 28 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(28)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"use-cases" should not have LOC greater or equal than 43 - should FAIL (UpdateTodo.ts has exactly 43 LOC)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(43)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"domain" should not have LOC greater or equal than 20 - should FAIL (multiple files >= 20)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(20)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('entire project should not have LOC greater or equal than 30 - should FAIL (multiple files >= 30)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(30)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"use-cases" should not have LOC greater or equal than 15 - should FAIL (multiple files >= 15)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(15)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"entities" should not have LOC greater or equal than 1 - should FAIL (both files >= 1)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/entities/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(1)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"main" should not have LOC greater or equal than 39 - should FAIL (app.ts has 40 LOC - boundary case)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(39)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('"infra" should not have LOC greater or equal than 31 - should FAIL (InMemoryTodoRepository.ts has 32 LOC - boundary case)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(31)
                    .check();

                expect(result).toBe(false);
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/nonexistent/**").shouldNot().haveLocGreaterOrEqualThan(10).check() - should throw error (no files exist)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        mimeTypes: ['**/*.ts'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/nonexistent/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(10)
                        .check();

                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/nonexistent/**' should not have L.O.C. greater or equal than: 10\n`);
                    expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
                }
            }
        });

        test('threshold of 0 should always throw error (invalid threshold)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        mimeTypes: ['**/*.ts'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(0)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. greater or equal than: 0\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('threshold of -1 should always throw error (invalid threshold)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                try {
                    const options: Options = {
                        mimeTypes: ['**/*.ts'],
                        includeMatcher: [...includeMatcher],
                        ignoreMatcher: excludeMatchers
                    };
                    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(-1)
                        .check();
    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/entities/**' should not have L.O.C. greater or equal than: -1\n`);
                    expect(errorMessage).toContain(`Threshold value must be greater than 0`);
                }
            }
        });

        test('very high threshold (1000) should always PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(1000)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('boundary case: threshold one more than largest file LOC should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(44)
                    .check();

                expect(result).toBe(true);
            }
        });

        test('boundary case: threshold equal to largest file LOC should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                const result = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .shouldNot()
                    .haveLocGreaterOrEqualThan(43)
                    .check();

                expect(result).toBe(false);
            }
        });

        test('incorrect extension', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);

                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/entities/**')
                        .shouldNot()
                        .haveLocGreaterOrEqualThan(10)
                        .check();
                    
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/Todo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/domain/entities/index.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/domain/repositories/TodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/main/app.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/CreateTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/DeleteTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetAllTodos.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/GetTodoById.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/UpdateTodo.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                    expect(errorMessage).toContain(`File: '${rootDir}/use-cases/index.ts' - mismatch\nFile does not is in 'mimeTypes': [**/*.js] - add desired file extension`);
                }
            }
        });
    });
});