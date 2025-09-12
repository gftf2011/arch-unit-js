import * as path from 'pathe';
import { fileURLToPath } from 'url';

import { ProjectBuilder } from '@/fluent-api';
import { Options } from './fluent-api/common/options';

type AppOptions = Omit<Options, 'rootDir'>;

/**
 * Returns the root directory of the project where the package was installed
 */
function getProjectRoot(): string {
  // Check if import.meta is available (ES modules)
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, '..', '..', '..');
  } else {
    return path.resolve(__dirname, '..', '..', '..');
  }
}

const app = (
  options: AppOptions = {
    extensions: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'],
    matchers: ['<rootDir>/.'],
  },
) => {
  const rootDir = getProjectRoot();
  const projectOptions: Options = {
    ...options,
    rootDir,
  };
  return ProjectBuilder.create(projectOptions);
};

export { app, AppOptions };
