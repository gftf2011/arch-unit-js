import fs from 'fs';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';

type FolderTree = Dirctory | File;

type File = {
    name: string;
    path: string;
    type: 'file';
    dependencies: string[];
}

type Dirctory = {
    name: string;
    path: string;
    type: 'directory';
    children: FolderTree[];
}

function getDependenciesFromFilePath (filePath: string, normalizePath = false) {
    const code = fs.readFileSync(filePath, 'utf-8');
  
    const ast = parse(code, {
      sourceType: 'unambiguous', // supports both ESM & CJS
      plugins: ['typescript']    // allows parsing TypeScript syntax
    });
  
    const dependencies: string[] = [];
  
    traverse(ast, {
      ImportDeclaration({ node }) {
        if (normalizePath) {
            dependencies.push(path.resolve(filePath, node.source.value));
        } else {
            dependencies.push(node.source.value);
        }
      },
      CallExpression({ node }) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'StringLiteral'
        ) {
          if (normalizePath) {
            dependencies.push(path.resolve(filePath, node.arguments[0].value));
          } else {
            dependencies.push(node.arguments[0].value);
          }
        }
      }
    });
  
    return dependencies;
}

function buildFolderTree(projectPath: string, normalized: boolean): FolderTree {
    const name = path.basename(projectPath);

    const stats = fs.statSync(projectPath);
    if (stats.isDirectory()) {
        const item: Dirctory = {
            name,
            path: projectPath,
            type: 'directory',
            children: []
        };
    
        const entries = fs.readdirSync(projectPath, { withFileTypes: true });
        for (const entry of entries) {
            const newFullPath = path.join(projectPath, entry.name);
            item.children.push(buildFolderTree(newFullPath, normalized));
        }

        return item;
    } else {
        const item: File = {
            name,
            path: projectPath,
            type: 'file',
            dependencies: getDependenciesFromFilePath(projectPath, normalized)
        }

        return item;
    }
}

export const ast = {
    tree: {
        generate: (projectPath: string, normalized: boolean) => {
            const tree = buildFolderTree(projectPath, normalized);

            return tree;
        }
    }
}
