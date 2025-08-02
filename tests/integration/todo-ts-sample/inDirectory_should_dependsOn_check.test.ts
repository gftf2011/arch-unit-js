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

describe('should.dependsOn scenarios', () => {
    describe('Scenario 1: File has NO dependencies', () => {
        test('"domain/entities" should depend on "inexistent-dependency" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/entities/**')
                    .should()
                    .dependsOn(['inexistent-dependency'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });
    });

    describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
        test('"use-cases" should depend on "inexistent-dependency" - should FAIL', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .should()
                    .dependsOn(['inexistent-dependency'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"use-cases" should depend on "infra" - should FAIL (use-cases imports from domain and "node packages", not infra)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**')
                    .should()
                    .dependsOn(['**/infra/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });
    });

    describe('Scenario 3: File has dependencies and SOME match the patterns', () => {
        test('"use-cases" should depend on "domain" and "uuid" - should FAIL (not all files have "uuid")', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**', ['!**/index.ts'])
                    .should()
                    .dependsOn(['**/domain/**', 'uuid'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should depend on "domain", "use-cases" and "infra" and "inexistent" - should FAIL (missing "inexistent")', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .should()
                    .dependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**', 'inexistent'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });
    });

    describe('Scenario 4: File has dependencies and ALL patterns are present', () => {
        test('"infra" should depend on "domain" - should PASS', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/infra/**')
                    .should()
                    .dependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"use-cases/CreateTodo.ts" should depend on "domain" and "uuid" - should PASS (file have "domain" and "uuid")', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**', ['!**/use-cases/DeleteTodo.ts', '!**/use-cases/GetTodoById.ts', '!**/use-cases/GetAllTodos.ts', '!**/use-cases/UpdateTodo.ts', '!**/index.ts'])
                    .should()
                    .dependsOn(['**/domain/**', 'uuid'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"main" should depend on "domain" and "use-cases" - should PASS (has both + infra and extra)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .should()
                    .dependsOn(['**/domain/**', '**/use-cases/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"main" should depend on "domain", "use-cases" and "infra" and "uuid" - should PASS (has all patterns)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/main/**')
                    .should()
                    .dependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**', 'uuid'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").should().dependsOn([]).check() - should FAIL (empty array)', async () => {
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
                        .inDirectory('**/domain/**')
                        .should()
                        .dependsOn([])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should depends on '[]'\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
            }
        });

        test('projectFiles.inDirectory("**/domain/**").should().dependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
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
                        .inDirectory('**/domain/**')
                        .should()
                        .dependsOn(["uuid", ""])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should depends on '[uuid, ]'\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
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
                        .inDirectory('**/infra/**')
                        .should()
                        .dependsOn(['**/domain/**'])
                        .check();
                    
                    // If we get here, the test should fail
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

        test(`must throw error if file path is not being reached by the 'includeMatcher'`, async () => {
            const options: Options = {
                mimeTypes: ['**/*.ts'],
                includeMatcher: ['<rootDir>/infra/**'],
                ignoreMatcher: excludeMatchers
            };
            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
            const promise = appInstance
                .projectFiles()
                .inDirectory('**/domain/**')
                .should()
                .dependsOn(['**/infra/**'])
                .check();

            const errorsMessage = [
                `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - could not be resolved\n- '${rootDir}/domain/repositories/TodoRepository.ts' - file path was not found\n- '${rootDir}/domain/entities/index.ts' - file path was not found\nCheck if path is being reached by the 'includeMatcher'`,
            ];

            await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
        });
    });
});
