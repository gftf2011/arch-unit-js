import * as path from 'pathe';
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

const typescriptPath = '<rootDir>/tsconfig.json';

describe('shouldNot.haveCicles scenarios', () => {
    test('entire project should not have cicles - should PASS', async () => {
        for (const [includeMatcher] of includeMatchers) {
            const options: Options = {
                extensionTypes: ['**/*.ts'],
                includeMatcher: [...includeMatcher],
                ignoreMatcher: excludeMatchers,
                typescriptPath
            };
            const appInstance = ComponentSelectorBuilder.create(rootDir, options);
            await appInstance
                .projectFiles()
                .inDirectory('**')
                .shouldNot()
                .haveCicles()
                .check();
        }
    });
});