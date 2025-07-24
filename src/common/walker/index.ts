import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import micromatch from 'micromatch';
import { File } from '../fluent-api';

function resolvePatterns(patterns: string[], rootDir: string): string[] {
    return patterns.map(p =>
      p.replace('<rootDir>', rootDir).replace(/\\/g, '/')
    );
}

function extractExtension(pattern: string): string | null {
    const match = pattern.match(/\.[^.\\/:*?"<>|\r\n]+$/);
    return match ? match[0] : null;
}

function resolveImportPath(currentPath: string, importPath: string, extensions: string[]): string {
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      // Node package (e.g., 'pg')
      return importPath;
    }
  
    const fullPath = path.resolve(currentPath, importPath);
  
    const candidates = [
        ...extensions.map(ext => `${fullPath}${ext}`),
        ...extensions.map(ext => path.join(fullPath, `index${ext}`)),
    ];
  
    for (const candidate of candidates) {
      try {
        const stat = fs.statSync(candidate);
        if (stat.isFile()) return candidate;
      } catch {
        // do nothing
      }
    }
  
    // fallback to original path if nothing found
    return importPath;
  }

async function getDependenciesFromFilePath (filePath: string, extensions: string[]): Promise<string[]> {
    const code = await fsPromises.readFile(filePath, 'utf-8');
  
    const ast = parse(code, {
      sourceType: 'unambiguous', // supports both ESM & CJS
      plugins: ['typescript']    // allows parsing TypeScript syntax
    });
  
    const dependencies: string[] = [];
  
    traverse(ast, {
      ImportDeclaration({ node }) {
        dependencies.push(
            resolveImportPath(path.dirname(filePath), node.source.value, extensions)
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
                resolveImportPath(path.dirname(filePath), node.arguments[0].value, extensions)
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
  ): Promise<File[]> {
    const files: File[] = [];

    const extensions = mimeTypes.map(mimeType => extractExtension(mimeType)) as string[];
  
    const includePatterns = resolvePatterns(filesOrFoldersToInclude, startPath);
    const ignorePatterns = resolvePatterns(filesOrFoldersToIgnore, startPath);
  
    async function walk(currentPath: string, extensions: string[]) {
      const entries = await fsPromises.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
  
        if (micromatch([fullPath], ignorePatterns).length === 0) {
            if (entry.isDirectory()) {
                await walk(fullPath, extensions);
            } else if (entry.isFile()) {
                const dependencies = await getDependenciesFromFilePath(fullPath, extensions);
    
                files.push({
                    name: entry.name,
                    path: fullPath,
                    dependencies,
                    type: 'file',
                });
            }
        }
      }
    }
  
    for (const includedPath of includePatterns) {
      await walk(includedPath, extensions);
    }

    return files;
}