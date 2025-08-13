import { spawn } from 'child_process';
import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  'sample',
  'todo-js-sample-with-module-aliases',
);

const includeMatchers = ['<rootDir>/**'];

const excludeMatchers = [
  '!<rootDir>/**/package.json',
  '!<rootDir>/**/node_modules/**',
  '!<rootDir>/**/package-lock.json',
];

describe('shouldNot.dependsOn scenarios', () => {
  beforeAll(async () => {
    const resolveSpawn = async () => {
      return new Promise((resolve, reject) => {
        const child = spawn('node', [path.resolve(rootDir, 'setup-aliases.js')], {
          stdio: 'inherit',
        });
        child.on('close', (code) => {
          if (code === 0)
            resolve(true); // success
          else reject(new Error(`Process exited with code ${code}`));
        });

        child.on('error', (err) => reject(err));
      });
    };
    await resolveSpawn();
  });

  it('test 1', async () => {
    const options: Options = {
      extensionTypes: ['**/*.js'],
      includeMatcher: includeMatchers,
      ignoreMatcher: excludeMatchers,
    };
    const appInstance = ComponentSelectorBuilder.create(rootDir, options);
    await appInstance
      .projectFiles()
      .inDirectory('**/use-cases/**')
      .should()
      .dependsOn('**/domain/**')
      .check();
  });
});
