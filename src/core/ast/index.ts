import fs from 'fs';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';

export type DirectoryTree = Directory | File;

export type File = {
    name: string;
    path: string;
    type: 'file';
    dependencies: string[];
}

export type Directory = {
    name: string;
    path: string;
    type: 'directory';
    children: DirectoryTree[];
}

export type Root = {
  rootDir: string;
  roots: Directory[];
}

function isDirectory(path: string): boolean {
  const stats = fs.statSync(path);
  return stats.isDirectory();
}

function isFile(path: string): boolean {
  const stats = fs.statSync(path);
  return stats.isFile();
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

function createRoot(rootDir: string, projectDirs: string[]): Root {
  
  if (!isDirectory(rootDir)) {
    throw new Error(`rootDir: ${rootDir} - is not a directory`);
  }

  if (!fileOrDirectoryExists(rootDir)) {
    throw new Error(`rootDir: ${rootDir} - directory does not exists`);
  }

  const root: Root = {
    rootDir,
    roots: []
  }

  for (const projectDir of projectDirs) {
    const projectDirPath = path.join(rootDir, projectDir);
    if (!isDirectory(projectDirPath)) {
      throw new Error(`projectDir: ${projectDirPath} - is not a directory`);
    }
  
    if (!fileOrDirectoryExists(projectDirPath)) {
      throw new Error(`projectDir: ${projectDirPath} - directory does not exists`);
    }
    const projectTree = buildDirectoryTree(projectDirPath) as Directory;
    root.roots.push(projectTree);
  }

  return root;
}

export const ast = {
    tree: {
        generate: (rootDir: string, projectDirs: string[]): Root => {
          const tree = createRoot(rootDir, projectDirs);
          return tree;
        }
    }
}
