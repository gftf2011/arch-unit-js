import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-sample-with-invalid-dependencies',
);

const includeMatchers = ['<rootDir>/**'];

const excludeMatchers = ['!<rootDir>/**/package.json'];

describe('should.haveLocLessThan scenarios', () => {
  it('should PASS - dependencies are not being analyzed', async () => {
    const options: Options = {
      extensionTypes: ['**/*.js'],
      includeMatcher: [...includeMatchers],
      ignoreMatcher: excludeMatchers,
    };
    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    await appInstance.projectFiles().inDirectory('**').should().haveLocLessThan(10000).check();
  });
});
