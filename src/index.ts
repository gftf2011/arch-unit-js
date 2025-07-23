import { fileURLToPath } from 'url';
import path from 'path';
import { ast } from './core/ast';

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

/**
 * Builds the AST - (Abstract Syntax Tree) for the project
 * @param projectDirs - The directories to build the AST for
 */
export const build = (projectDirs: string[], options: { mimeTypes: string[] } = { mimeTypes: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'] }): void => {
  const rootDir = getProjectRoot();
  const rootTree = ast.tree.generate(rootDir, projectDirs, options.mimeTypes);
  console.log(JSON.stringify(rootTree, null, 2));
};
