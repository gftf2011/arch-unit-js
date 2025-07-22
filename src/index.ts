import path from 'path';
import { ast } from './core/ast';

/**
 * Returns the root directory of the project where the package was installed
 */
function getProjectRoot(): string {
  return path.resolve(__dirname, '..', '..', '..');
}

/**
 * Builds the AST - (Abstract Syntax Tree) for the project
 * @param projectDirs - The directories to build the AST for
 */
export const build = (projectDirs: string[]): void => {
  const rootDir = getProjectRoot();
  const rootTree = ast.tree.generate(rootDir, projectDirs);
  console.log(JSON.stringify(rootTree, null, 2));
};
