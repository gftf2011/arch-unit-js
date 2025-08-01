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

    private static resolveImportPath(
        rootDir: string,
        currentPath: string,
        dependency: string,
        extensions: string[],
        resolvedWith: 'require' | 'import'
    ): Dependency {
        if (isBuiltinModule(dependency)) {
            return {
              name: dependency,
              fullName: dependency,
              type: 'node-builtin-module',
              resolvedWith,
            };
        }
    
        if (isPackageJsonDependency(rootDir, dependency)) {
            return {
              name: dependency,
              fullName: dependency,
              type: 'node-package',
              resolvedWith,
            };
        }
    
        if (isPackageJsonDevDependency(rootDir, dependency)) {
            return {
              name: dependency,
              fullName: dependency,
              type: 'node-dev-package',
              resolvedWith,
            };
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
                if (stat.isFile()) return {
                  name: path.relative(rootDir, candidate),
                  fullName: candidate,
                  // name: replacePath(rootDir, candidate),
                  // name: candidate,
                  type: 'valid-path',
                  resolvedWith,
                };
            } catch {
                // do nothing
            }
        }
    
        return {
          name: dependency,
          fullName: dependency,
          type: 'invalid',
          resolvedWith,
        };
    }

    private static async createFile (rootDir: string, fileName: string, filePath: string, extensions: string[]): Promise<File> {
        const code = await fsPromises.readFile(filePath, 'utf-8');
    
        const ast = parse(code, {
          sourceType: 'unambiguous', // supports both ESM & CJS
          plugins: ['typescript', 'jsx']    // allows parsing TypeScript & JSX syntax
        });

        const codeLines = new Set<number>();

        const countLogicalCodeLines = (code: string): number => {
            const lines = code.split('\n');
            return lines.filter(line => {
                const trimmed = line.trim();
                return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
            }).length;
        }

        let totalRequiredDependencies = 0;
        let totalImportedDependencies = 0;

        let hasDefaultExport = false;
      
        const dependencies: Dependency[] = [];
      
        traverse(ast, {
          enter({ node }) {
            const loc = node.loc;
            if (loc) {
                for (let i = loc.start.line; i <= loc.end.line; i++) {
                    codeLines.add(i);
                }
            }
          },
          ImportDeclaration({ node }) {
            totalImportedDependencies++;
            dependencies.push(
                Node.resolveImportPath(
                    rootDir,
                    path.dirname(filePath),
                    node.source.value,
                    extensions, 'import'
                )
            );
          },
          CallExpression({ node }) {
            if (
              node.callee.type === 'Identifier' &&
              node.callee.name === 'require' &&
              node.arguments.length === 1 &&
              node.arguments[0].type === 'StringLiteral'
            ) {
                totalRequiredDependencies++;
                dependencies.push(
                    Node.resolveImportPath(
                        rootDir,
                        path.dirname(filePath),
                        node.arguments[0].value,
                        extensions, 'require'
                    )
                );
            }
          },
          ExportDefaultDeclaration() {
            hasDefaultExport = true;
          },
        });

        const file: File = {
            name: fileName,
            path: filePath,
            dependencies,
            type: 'file',
            loc: countLogicalCodeLines(code),
            totalLines: code.split('\n').length,
            totalRequiredDependencies,
            totalImportedDependencies,
            hasDefaultExport,
        };
      
        return file;
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

            if (micromatch([fullPath], [...includePatterns, ...ignorePatterns]).length > 0) {
              if (entry.isDirectory()) {
                await walk(fullPath, extensions);
              } else if (entry.isFile()) {
                const file = await Node.createFile(startPath, entry.name, fullPath, extensions);
                files.set(file.path, file);
              }
            }
          }
        }

        // for (const includedPath of includePatterns) {
        //   await walk(includedPath, extensions);
        // }

        await walk(startPath, extensions);
    
        return files;
    }
}
