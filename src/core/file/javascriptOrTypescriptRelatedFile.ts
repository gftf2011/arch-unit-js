import fsPromises from 'fs/promises';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import { Dependency } from '../dependency';
import { RootFile } from "./rootFile";

export class JavascriptOrTypescriptRelatedFile extends RootFile {
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
            dependencies.push(Dependency.create(rootDir, path.dirname(filePath), node.source.value, extensions, 'import'));
          },
          CallExpression({ node }) {
            if (
              node.callee.type === 'Identifier' &&
              node.callee.name === 'require' &&
              node.arguments.length === 1 &&
              node.arguments[0].type === 'StringLiteral'
            ) {
                totalRequiredDependencies++;
                dependencies.push(Dependency.create(rootDir, path.dirname(filePath), node.arguments[0].value, extensions, 'require'));
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