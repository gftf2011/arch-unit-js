import path from 'path';
import { Options } from '../../../src/common/fluent-api';
import { ComponentSelectorBuilder } from '../../../src/fluent-api';

const includeAndExcludeScenarios = [
    [['<rootDir>'], []],
    [['<rootDir>'], ['**/index.js']],
    [['<rootDir>/'], []],
    [['<rootDir>/'], ['**/index.js']],
    [['<rootDir>/.'], []],
    [['<rootDir>/.'], ['**/index.js']],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], []],
    [['<rootDir>/domain', '<rootDir>/use-cases', '<rootDir>/infra'], ['**/index.js']],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], []],
    [['^<rootDir>/domain', '^<rootDir>/use-cases', '^<rootDir>/infra'], ['**/index.js']],
    [['domain', 'use-cases', 'infra'], []],
    [['domain', 'use-cases', 'infra'], ['**/index.js']],
    [['domain/', 'use-cases/', 'infra/'], []],
    [['domain/', 'use-cases/', 'infra/'], ['**/index.js']],
    [['^domain', '^use-cases', '^infra'], []],
    [['^domain', '^use-cases', '^infra'], ['**/index.js']],
    [['^domain/', '^use-cases/', '^infra/'], []],
    [['^domain/', '^use-cases/', '^infra/'], ['**/index.js']],
];


const rootDir = path.resolve(path.dirname(__filename), '..', '..', 'sample', 'todo-js-sample-with-invalid-dependencies');

describe('Edge scenarios', () => {
    describe('inDirectory', () => {
        describe('should', () => {
            describe('beImportedOrRequiredBy', () => {
                test(`check - incorrect path dependencies`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
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

                            expect(errorMessage).toContain(`Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '../../../domain/repositories/TodoRepository'\nCheck if dependency is listed in packge.json OR if dependency path is valid`);
                            expect(errorMessage).toContain(`Dependencies in file: '${rootDir}/use-cases/CreateTodo.js' - could not be resolved\n- '../../domain/entities/Todo'\nCheck if dependency is listed in packge.json OR if dependency path is valid`);
                        }
                    });
                });
            });
        });

        describe('shouldNot', () => {
            describe('beImportedOrRequiredBy', () => {
                test(`check - incorrect path dependencies`, async () => {
                    includeAndExcludeScenarios.forEach(async ([includeMatcher, excludeFilesPattern]) => {
                        const options: Options = {
                            mimeTypes: ['**/*.js'],
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

                            expect(errorMessage).toContain(`Dependencies in file: '${rootDir}/infra/repositories/InMemoryTodoRepository.js' - could not be resolved\n- '../../../domain/repositories/TodoRepository'\nCheck if dependency is listed in packge.json OR if dependency path is valid`);
                            expect(errorMessage).toContain(`Dependencies in file: '${rootDir}/use-cases/CreateTodo.js' - could not be resolved\n- '../../domain/entities/Todo'\nCheck if dependency is listed in packge.json OR if dependency path is valid`);
                        }
                    });
                });
            });
        });
    });
});