import fs from 'fs';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import { Directory, File, DirectoryTree } from '../../utils/types';
import { Notification } from '../../utils/notification';

function isDirectory(path: string): boolean {
  const stats = fs.statSync(path);
  return stats.isDirectory();
}

function fileOrDirectoryExists(path: string): boolean {
  return fs.existsSync(path);
}

function getDependenciesFromFilePath (filePath: string) {
    const code = fs.readFileSync(filePath, 'utf-8');
  
    const ast = parse(code, {
      sourceType: 'unambiguous', // supports both ESM & CJS
      plugins: ['typescript']    // allows parsing TypeScript syntax
    });
  
    const dependencies: string[] = [];
  
    traverse(ast, {
      ImportDeclaration({ node }) {
        // dependencies.push(path.resolve(filePath, node.source.value));
        dependencies.push(node.source.value);
      },
      CallExpression({ node }) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'StringLiteral'
        ) {
          // dependencies.push(path.resolve(filePath, node.arguments[0].value));
          dependencies.push(node.arguments[0].value);
        }
      }
    });
  
    return dependencies;
}


function createFile(filePath: string): File {
  const name = path.basename(filePath);
  return {
    name,
    path: filePath,
    type: 'file',
    dependencies: getDependenciesFromFilePath(filePath)
  }
}

function createDirectoryWithEmptyChildren(directoryPath: string): Directory {
  const name = path.basename(directoryPath);
  return {
    name,
    path: directoryPath,
    type: 'directory',
    children: []
  }
}

function buildDirectoryTree(projectPath: string): DirectoryTree {
    if (isDirectory(projectPath)) {
        const item: Directory = createDirectoryWithEmptyChildren(projectPath);
    
        const entries = fs.readdirSync(projectPath, { withFileTypes: true });
        for (const entry of entries) {
            const newFullPath = path.join(projectPath, entry.name);
            item.children.push(buildDirectoryTree(newFullPath));
        }

        return item;
    } else {
        const item: File = createFile(projectPath);

        return item;
    }
}

/**
 * Creates the root directory of the project which the package was installed in
 * 
 * The root directory `rootDir` is the directory where the package was installed in AND it must be a directory
 * The project directories `projectDirs` are the directories that are included in the root directory
 * 
 * Some examples of the project directories:
 * - `<rootDir>`/.
 * - `<rootDir>`/src
 * - `<rootDir>`/app/anything
 * 
 * @param rootDir - The root directory of the project
 * @param projectDirs - The project directories to be included in the root directory
 * @returns The root directory of the project
 */
function createRootDirectory(rootDir: string, projectDirs: string[]): Directory {

  const validateProjectDirs = (rootDir: string, projectDirs: string[]): void => {
    const notification = new Notification();
    for (const projectDir of projectDirs) {
      if (!projectDir) {
        notification.addError(new Error(`${projectDir}: must not be empty !`));
      } else if (!projectDir.includes('<rootDir>')) {
        notification.addError(new Error(`${projectDir}: projectDir must contain <rootDir> in the path !`));
      } else if (projectDir.split('<rootDir>/').join('') === '') {
        notification.addError(new Error(`${projectDir}: projectDir must contain at least one directory after <rootDir> !`));
      } else if (!fileOrDirectoryExists(path.join(rootDir, projectDir.split('<rootDir>/').join('')))) {
        notification.addError(new Error(`${projectDir}: projectDir must exist !`));
      } else if (!isDirectory(path.join(rootDir, projectDir.split('<rootDir>/').join('')))) {
        notification.addError(new Error(`${projectDir}: projectDir must be a directory !`));
      }
    }
    if (notification.hasErrors()) {
      throw new Error(notification.getErrors().map(error => error.message).join('\n'));
    }
  }

  const filterProjectDirs = (projectDirs: string[]): string[] => {
    return projectDirs.map(dir => dir.split('<rootDir>/').join(''));
  }

  validateProjectDirs(rootDir, projectDirs);
  const filteredProjectDirs = filterProjectDirs(projectDirs);
  
  if (!isDirectory(rootDir)) {
    throw new Error(`rootDir: ${rootDir} - is not a directory`);
  }

  if (!fileOrDirectoryExists(rootDir)) {
    throw new Error(`rootDir: ${rootDir} - directory does not exists`);
  }

  const root: Directory = createDirectoryWithEmptyChildren(rootDir);

  for (const projectDir of filteredProjectDirs) {
    const projectDirPath = path.join(rootDir, projectDir);
    const projectTree = buildDirectoryTree(projectDirPath);
    root.children.push(projectTree);
  }

  return root;
}

export const ast = {
    tree: {
        generate: (rootDir: string, projectDirs: string[]): Directory => {
          const tree = createRootDirectory(rootDir, projectDirs);
          return tree;
        }
    }
}
