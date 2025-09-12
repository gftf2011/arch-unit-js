import * as path from 'pathe';

import { ComponentSelectorBuilder } from '@/fluent-api';
import { Options } from '@/fluent-api/common/types';

const rootDir = path.resolve(
  path.dirname(__filename),
  '..',
  '..',
  '..',
  'sample',
  'todo-workspaces',
);

const includeMatchers: string[][] = [
  ['<workspaceDir>/**'],
  ['<workspaceDir>/**/'],
  ['./packages/a/**'],
  ['./packages/a/**/'],
  [
    '<workspaceDir>/domain/**',
    '<workspaceDir>/use-cases/**',
    '<workspaceDir>/infra/**',
    '<workspaceDir>/main/**',
  ],
  [
    '<workspaceDir>/domain/**/',
    '<workspaceDir>/use-cases/**/',
    '<workspaceDir>/infra/**/',
    '<workspaceDir>/main/**/',
  ],
  [
    './packages/a/domain/**',
    './packages/a/use-cases/**',
    './packages/a/infra/**',
    './packages/a/main/**',
  ],
  [
    './packages/a/domain/**/',
    './packages/a/use-cases/**/',
    './packages/a/infra/**/',
    './packages/a/main/**/',
  ],
];

const ignoreMatchers = [
  '!<workspaceDir>/**/package.json',
  '!<workspaceDir>/**/package-lock.json',
  '!<workspaceDir>/**/node_modules/**',
  '!<workspaceDir>/**/webpack.config.js',
  '!<workspaceDir>/**/webpack2.config.js',
  '!<workspaceDir>/**/babel.config.json',
  '!<workspaceDir>/**/index.html',
];

const webpacks = [
  {
    webpack: {
      path: '<workspaceDir>/webpack.config.js',
    },
  },
  {
    webpack: {
      path: '<workspaceDir>/webpack2.config.js',
      names: ['app'],
    },
  },
];

describe('inFiles.shouldNot.haveCycles scenarios (vanilla JS decorators sample)', () => {
  test('entire project should NOT have cycles - PASS', async () => {
    for (const includeMatcher of includeMatchers) {
      for (const { webpack } of webpacks) {
        const options: Options = {
          workspaceDir: '<rootDir>/packages/a',
          extensionTypes: ['**/*.js'],
          includeMatcher: [...includeMatcher],
          ignoreMatcher: ignoreMatchers,
          webpack,
        };
        const appInstance = ComponentSelectorBuilder.create(rootDir, options);
        await appInstance.projectFiles().inFiles(['**']).shouldNot().haveCycles().check();
      }
    }
  });
});
