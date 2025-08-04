import { fileURLToPath } from 'url';
import path from 'path';
import { ComponentSelectorBuilder } from './fluent-api';
import { Options } from './fluent-api/common/types';
/**
 * Returns the root directory of the project where the package was installed
 */
function getProjectRoot(): string {
  // Check if import.meta is available (ES modules)
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.posix.dirname(__filename.split(path.sep).join(path.posix.sep));
    return path.posix.resolve(__dirname, '..', '..', '..');
  } else {
    return path.posix.resolve(__dirname, '..', '..', '..');
  }
}

export const app = (options: Options = {
  extensionTypes: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'],
  includeMatcher: ['<rootDir>/.'],
  ignoreMatcher: ['!<rootDir>/node_modules/**']
}) => {
  const rootDir = getProjectRoot();
  return ComponentSelectorBuilder.create(rootDir, options);
};
