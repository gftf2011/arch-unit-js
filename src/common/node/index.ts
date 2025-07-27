import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import micromatch from 'micromatch';
import { File, Dependency } from '../fluent-api';
import {
    extractExtensionFromGlobPattern,
    resolveRootDirPatternToGlobPattern,
    isBuiltinModule,
    isPackageJsonDependency,
    isPackageJsonDevDependency,
    isTypescriptAtPathDependency,
    resolveIfTypescriptAtPathDependency
} from '../utils';

export class Node {
    private constructor(readonly rootDir: string) {}

    private static resolveImportPath(rootDir: string,currentPath: string, dependency: string, extensions: string[]): Dependency {
        if (isBuiltinModule(dependency)) {
            return { name: dependency, type: 'node-builtin-module' };
        }
    
        if (isPackageJsonDependency(rootDir, dependency)) {
            return { name: dependency, type: 'node-package' };
        }
    
        if (isPackageJsonDevDependency(rootDir, dependency)) {
            return { name: dependency, type: 'node-dev-package' };
        }
    
        const fullPath = (rootDir: string, currentPath: string, dependency: string) => {
            if (isTypescriptAtPathDependency(dependency)) {
                return resolveIfTypescriptAtPathDependency(rootDir, dependency);
            } else {
                return path.resolve(currentPath, dependency);
            }
        };
    
        const resolvedPathForCandidates = fullPath(rootDir, currentPath, dependency);
    
        const candidates = [
            ...extensions.map(ext => `${resolvedPathForCandidates}${ext}`),
            ...extensions.map(ext => path.join(resolvedPathForCandidates, `index${ext}`)),
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
    
    private static async getDependenciesFromFilePath (rootDir: string, filePath: string, extensions: string[]): Promise<Dependency[]> {
        const code = await fsPromises.readFile(filePath, 'utf-8');
    
        const ast = parse(code, {
          sourceType: 'unambiguous', // supports both ESM & CJS
          plugins: ['typescript']    // allows parsing TypeScript syntax
        });
      
        const dependencies: Dependency[] = [];
      
        traverse(ast, {
          ImportDeclaration({ node }) {
            dependencies.push(
                Node.resolveImportPath(rootDir, path.dirname(filePath), node.source.value, extensions)
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
                    Node.resolveImportPath(rootDir, path.dirname(filePath), node.arguments[0].value, extensions)
                );
            }
          }
        });
      
        return dependencies;
    }
    
    public static async buildProjectGraph(
        startPath: string,
        filesOrFoldersToInclude: string[],
        filesOrFoldersToIgnore: string[],
        mimeTypes: string[]
      ): Promise<Map<string, File>> {
        const files: Map<string, File> = new Map();
    
        const extensions = mimeTypes.map(mimeType => extractExtensionFromGlobPattern(mimeType)) as string[];
      
        const includePatterns = resolveRootDirPatternToGlobPattern(filesOrFoldersToInclude, startPath);
        const ignorePatterns = resolveRootDirPatternToGlobPattern(filesOrFoldersToIgnore, startPath);
    
        async function walk(currentPath: string, extensions: string[]) {
          const entries = await fsPromises.readdir(currentPath, { withFileTypes: true });
    
          for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
      
            if (micromatch([fullPath], ignorePatterns).length === 0) {
                if (entry.isDirectory()) {
                    await walk(fullPath, extensions);
                } else if (entry.isFile()) {
                    const dependencies = await Node.getDependenciesFromFilePath(startPath, fullPath, extensions);
        
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
}
