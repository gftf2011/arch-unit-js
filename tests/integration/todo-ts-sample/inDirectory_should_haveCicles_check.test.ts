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

describe('should.haveCicles scenarios', () => {
    test('entire project should have cicles - DO I REALLY NEED TO EXPLAIN THIS ?', async () => {
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
                    .inDirectory('**')
                    .should()
                    .haveCicles()
                    .check();
        
                expect(1).toBe(2);
            } catch (error) {
                const errorMessage = (error as Error).message;
                expect(errorMessage).toBe("IF YOU SEE THIS, YOU MUST BE A UTTERLY STUPID PERSON");
            }
        }
    });
});