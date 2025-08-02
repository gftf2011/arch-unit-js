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

describe('shouldNot.dependsOn scenarios', () => {
    describe('Scenario 1: File has NO dependencies', () => {
        test('"domain/entities" should not depend on "inexistent-dependency" - should PASS (no dependencies)', async () => {
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
                    .shouldNot()
                    .dependsOn(['inexistent-dependency'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"domain/entities" should not depend on "infra" - should PASS (no dependencies)', async () => {
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
                    .shouldNot()
                    .dependsOn(['**/infra/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
    });

    describe('Scenario 2: File has dependencies but NONE match the patterns', () => {
        test('"use-cases" should not depend on "use-cases" excluding index.ts - should PASS (only index.ts uses use-cases)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/use-cases/**', ['!**/use-cases/index.ts'])
                    .shouldNot()
                    .dependsOn(['**/use-cases/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
        
        test('"use-cases" should not depend on "inexistent-dependency" - should PASS (no matching patterns)', async () => {
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
                    .shouldNot()
                    .dependsOn(['inexistent-dependency'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"use-cases" should not depend on "infra" - should PASS (use-cases imports from domain and npm packages, not infra)', async () => {
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
                    .shouldNot()
                    .dependsOn(['**/infra/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"domain" should not depend on "use-cases" and "infra" - should PASS (domain is independent layer)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**/domain/**')
                    .shouldNot()
                    .dependsOn(['**/use-cases/**', '**/infra/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });

        test('"infra" should not depend on "use-cases" - should PASS (infra only depends on domain)', async () => {
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
                    .shouldNot()
                    .dependsOn(['**/use-cases/**'])
                    .check();
        
                expect(answer).toBe(true);
            }
        });
    });

    describe('Scenario 3: File has dependencies and ANY patterns are present', () => {
        test('"use-cases" should not depend on "use-cases" - should FAIL (use-cases has index.ts)', async () => {
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
                    .shouldNot()
                    .dependsOn(['**/use-cases/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });
        
        test('"use-cases" should not depend on "domain" - should FAIL (use-cases imports from domain)', async () => {
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
                    .shouldNot()
                    .dependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"use-cases" should not depend on "domain" and "uuid" - should FAIL (some files have both patterns)', async () => {
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
                    .shouldNot()
                    .dependsOn(['**/domain/**', 'uuid'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"infra" should not depend on "domain" - should FAIL (infra imports from domain)', async () => {
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
                    .shouldNot()
                    .dependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should not depend on "domain", "use-cases" and "infra" - should FAIL (main imports from all layers)', async () => {
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
                    .shouldNot()
                    .dependsOn(['**/domain/**', '**/use-cases/**', '**/infra/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"main" should not depend on "uuid" - should FAIL (main uses uuid)', async () => {
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
                    .shouldNot()
                    .dependsOn(['uuid'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('"use-cases/CreateTodo.ts" should not depend on "uuid" - should FAIL (CreateTodo uses uuid)', async () => {
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
                    .shouldNot()
                    .dependsOn(['uuid'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });

        test('entire project should not depend on "domain" - should FAIL (multiple layers depend on domain)', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.ts'],
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                const answer = await appInstance
                    .projectFiles()
                    .inDirectory('**')
                    .shouldNot()
                    .dependsOn(['**/domain/**'])
                    .check();
        
                expect(answer).toBe(false);
            }
        });
    });

    describe('Edge scenarios', () => {
        test('projectFiles.inDirectory("**/domain/**").shouldNot().dependsOn([]).check() - should FAIL (empty array)', async () => {
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
                        .shouldNot()
                        .dependsOn([])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should not depends on '[]'\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
            }
        });

        test('projectFiles.inDirectory("**/domain/**").shouldNot().dependsOn(["uuid", ""]).check() - should FAIL (array with empty string)', async () => {
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
                        .shouldNot()
                        .dependsOn(["uuid", ""])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/domain/**' should not depends on '[uuid, ]'\n`);
                    expect(errorMessage).toContain(`No pattern was provided for checking`);
                }
            }
        });

        test('projectFiles.inDirectory("**/nonexistent/**").shouldNot().dependsOn(["uuid"]).check() - should throw error (no files exist)', async () => {
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
                        .dependsOn(['uuid'])
                        .check();

                    // If we get here, the test should fail
                    expect(1).toBe(2);
                } catch (error) {
                    const errorMessage = (error as Error).message;

                    expect(errorMessage).toContain(`Violation - Rule: project files in directory '**/nonexistent/**' should not depends on '[uuid]'\n`);
                    expect(errorMessage).toContain(`No files found in '[**/nonexistent/**]'`);
                }
            }
        });

        test('incorrect extension', async () => {
            for (const [includeMatcher] of includeMatchers) {
                const options: Options = {
                    mimeTypes: ['**/*.js'], // Looking for JavaScript in TypeScript project
                    includeMatcher: [...includeMatcher],
                    ignoreMatcher: excludeMatchers
                };
                const appInstance = ComponentSelectorBuilder.create(rootDir, options);
                try {
                    await appInstance
                        .projectFiles()
                        .inDirectory('**/infra/**')
                        .shouldNot()
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
                .shouldNot()
                .dependsOn(['**/infra/**'])
                .check();

            const errorsMessage = [
                `Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.ts' - could not be resolved\n- '${rootDir}/domain/repositories/TodoRepository.ts' - file path was not found\n- '${rootDir}/domain/entities/index.ts' - file path was not found\nCheck if path is being reached by the 'includeMatcher'`,
            ];

            await expect(promise).rejects.toThrow(new Error(errorsMessage.join('\n\n')));
        });
    });
});