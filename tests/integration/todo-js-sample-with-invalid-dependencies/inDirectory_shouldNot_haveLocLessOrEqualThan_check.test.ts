import * as path from 'pathe';

import { ComponentSelectorBuilder } from '../../../src/fluent-api';
import { Options } from '../../../src/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-sample-with-invalid-dependencies',
);

const includeMatchers = ['<rootDir>/**'];

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('shouldNot.haveLocLessOrEqualThan scenarios', () => {
  it('should PASS - dependencies are not being analyzed', async () => {
    const options: Options = {
      extensionTypes: ['**/*.js'],
      includeMatcher: [...includeMatchers],
      ignoreMatcher: excludeMatchers,
    };
    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    await appInstance
      .projectFiles()
      .inDirectory('**')
      .shouldNot()
      .haveLocLessOrEqualThan(1)
      .check();
  });
});
