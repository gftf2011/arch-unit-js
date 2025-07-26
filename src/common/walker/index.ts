import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import micromatch from 'micromatch';
import { File, Dependency } from '../fluent-api';
import { extractExtensionFromGlobPattern, resolveRootDirPattern, isBuiltinModule, isPackageJsonDependency, isPackageJsonDevDependency } from '../utils';

function resolveImportPath(rootDir: string,currentPath: string, dependency: string, extensions: string[]): Dependency {
    if (isBuiltinModule(dependency)) {
        return { name: dependency, type: 'node-builtin-module' };
    }

    if (isPackageJsonDependency(rootDir, dependency)) {
        return { name: dependency, type: 'node-package' };
    }

    if (isPackageJsonDevDependency(rootDir, dependency)) {
        return { name: dependency, type: 'node-dev-package' };
    }
  
    const fullPath = path.resolve(currentPath, dependency);
  
    const candidates = [
        ...extensions.map(ext => `${fullPath}${ext}`),
        ...extensions.map(ext => path.join(fullPath, `index${ext}`)),
    ];
  
    for (const candidate of candidates) {
      try {
        const stat = fs.statSync(candidate);
        if (stat.isFile()) return { name: candidate, type: 'valid-path' };
      } catch {
        // do nothing
      }
    }

    return { name: dependency, type: 'invalid' };
}

async function getDependenciesFromFilePath (rootDir: string, filePath: string, extensions: string[]): Promise<Dependency[]> {
    const code = await fsPromises.readFile(filePath, 'utf-8');

    const ast = parse(code, {
      sourceType: 'unambiguous', // supports both ESM & CJS
      plugins: ['typescript']    // allows parsing TypeScript syntax
    });
  
    const dependencies: Dependency[] = [];
  
    traverse(ast, {
      ImportDeclaration({ node }) {
        dependencies.push(
            resolveImportPath(rootDir, path.dirname(filePath), node.source.value, extensions)
        );
      },
      CallExpression({ node }) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'StringLiteral'
        ) {
            dependencies.push(
                resolveImportPath(rootDir, path.dirname(filePath), node.arguments[0].value, extensions)
            );
        }
      }
    });
  
    return dependencies;
}

export async function walkThrough(
    startPath: string,
    filesOrFoldersToInclude: string[],
    filesOrFoldersToIgnore: string[],
    mimeTypes: string[]
  ): Promise<Map<string, File>> {
    const files: Map<string, File> = new Map();

    const extensions = mimeTypes.map(mimeType => extractExtensionFromGlobPattern(mimeType)) as string[];
  
    const includePatterns = resolveRootDirPattern(filesOrFoldersToInclude, startPath);
    const ignorePatterns = resolveRootDirPattern(filesOrFoldersToIgnore, startPath);

    async function walk(currentPath: string, extensions: string[]) {
      const entries = await fsPromises.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
  
        if (micromatch([fullPath], ignorePatterns).length === 0) {
            if (entry.isDirectory()) {
                await walk(fullPath, extensions);
            } else if (entry.isFile()) {
                const dependencies = await getDependenciesFromFilePath(startPath, fullPath, extensions);
    
                const file: File = {
                    name: entry.name,
                    path: fullPath,
                    dependencies,
                    type: 'file',
                };

                files.set(file.path, file);
            }
        }
      }
    }

    for (const includedPath of includePatterns) {
      await walk(includedPath, extensions);
    }

    return files;
}