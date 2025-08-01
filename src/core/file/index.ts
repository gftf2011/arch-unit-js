import fsPromises from 'fs/promises';
import path from 'path';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import { Dependency } from '../dependency';

export class File {
    private constructor(
        readonly name: string,
        readonly path: string,
        readonly dependencies: Dependency[],
        readonly type: 'file',
        readonly loc: number,
        readonly totalLines: number,
        readonly totalRequiredDependencies: number,
        readonly totalImportedDependencies: number,
        readonly hasDefaultExport: boolean,
    ) {}

    public static async create (rootDir: string, fileName: string, filePath: string, extensions: string[]): Promise<File> {
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

        return new File(
            fileName,
            filePath,
            dependencies,
            'file',
            countLogicalCodeLines(code),
            code.split('\n').length,
            totalRequiredDependencies,
            totalImportedDependencies,
            hasDefaultExport,
        );
    }
}