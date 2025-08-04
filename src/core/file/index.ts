import fsPromises from 'fs/promises';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import { DependencyFactory, Dependency } from '../dependency';
import { isJavascriptRelatedFile, isTypeScriptRelatedFile } from '../../utils';

export abstract class RootFile {
    protected constructor(
        readonly name: string,
        readonly path: string,
        readonly type: 'file' | 'javascript-typescript-file',
        readonly loc: number,
        readonly totalLines: number,
        readonly dependencies: Dependency[] = [],
    ) {}

    public abstract build(rootDir: string, extensions: string[]): Promise<RootFile>;
}

class JavascriptOrTypescriptRelatedFile extends RootFile {
    private constructor(
        readonly name: string,
        readonly path: string,
        readonly type: 'javascript-typescript-file',
        readonly loc: number,
        readonly totalLines: number,
        readonly dependencies: Dependency[] = [],
        readonly totalRequiredDependencies: number,
        readonly totalImportedDependencies: number,
        readonly hasDefaultExport: boolean,
    ) {
        super(name, path, type, loc, totalLines);
    }

    public static create(fileName: string, filePath: string): JavascriptOrTypescriptRelatedFile {
        return new JavascriptOrTypescriptRelatedFile(fileName, filePath, 'javascript-typescript-file', 0, 0, [], 0, 0, false);
    }

    public override async build(rootDir: string, extensions: string[]): Promise<JavascriptOrTypescriptRelatedFile> {
        const fileName = this.name;
        const filePath = this.path;
        
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
            dependencies.push(DependencyFactory.create(
                rootDir,
                path.dirname(filePath),
                node.source.value,
                extensions,
                'import',
                'javascript-or-typescript'
            ));
          },
          CallExpression({ node }) {
            if (
              node.callee.type === 'Identifier' &&
              node.callee.name === 'require' &&
              node.arguments.length === 1 &&
              node.arguments[0].type === 'StringLiteral'
            ) {
                totalRequiredDependencies++;
                dependencies.push(DependencyFactory.create(
                    rootDir,
                    path.dirname(filePath),
                    node.arguments[0].value,
                    extensions,
                    'require',
                    'javascript-or-typescript'
                ));
            }
          },
          ExportDefaultDeclaration() {
            hasDefaultExport = true;
          },
        });

        return new JavascriptOrTypescriptRelatedFile(
            fileName,
            filePath,
            'javascript-typescript-file',
            countLogicalCodeLines(code),
            code.split('\n').length,
            dependencies,
            totalRequiredDependencies,
            totalImportedDependencies,
            hasDefaultExport,
        );
    }
}

export class FileFactory {
    public static async create(fileName: string, filePath: string, rootDir: string, extensions: string[]): Promise<RootFile> {
        if (isJavascriptRelatedFile(fileName) || isTypeScriptRelatedFile(fileName)) {
            return await JavascriptOrTypescriptRelatedFile.create(fileName, filePath).build(rootDir, extensions);
        }
        throw new Error(`Unsupported file type: ${fileName}`);
    }
}