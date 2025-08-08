import fsPromises from 'fs/promises';
import * as path from 'pathe';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import { Dependency, DependencyFactory } from "../../dependency";
import { RootFile, RootFileBuildableProps, RootFileProps } from "../common";

export type JavascriptRelatedFileProps = RootFileProps & {
    totalRequiredDependencies: number,
    totalImportedDependencies: number,
    hasDefaultExport: boolean,
}

export class JavascriptRelatedFile extends RootFile {
    private constructor(public props: JavascriptRelatedFileProps) {
        super(props);
    }

    public static create(fileName: string, filePath: string): JavascriptRelatedFile {
        return new JavascriptRelatedFile({
            name: fileName,
            path: filePath,
            type: 'javascript-file',
            loc: 0,
            totalLines: 0,
            dependencies: [],
            totalRequiredDependencies: 0,
            totalImportedDependencies: 0,
            hasDefaultExport: false,
        });
    }

    public override async build(buildableProps: RootFileBuildableProps): Promise<JavascriptRelatedFile> {
        const filePath = this.props.path;
        
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
            dependencies.push(DependencyFactory.create({
                name: node.source.value,
                resolvedWith: 'import',
                comesFrom: 'javascript'
            }));
          },
          CallExpression({ node }) {
            if (
              node.callee.type === 'Identifier' &&
              node.callee.name === 'require' &&
              node.arguments.length === 1 &&
              node.arguments[0].type === 'StringLiteral'
            ) {
                totalRequiredDependencies++;
                dependencies.push(DependencyFactory.create({
                    name: node.arguments[0].value,
                    resolvedWith: 'require',
                    comesFrom: 'javascript'
                }));
            }
          },
          ExportDefaultDeclaration() {
            hasDefaultExport = true;
          },
        });

        dependencies.forEach(dependency => dependency.resolve({
            rootDir: buildableProps.rootDir,
            fileDir: path.dirname(filePath),
            availableFiles: buildableProps.availableFiles
        }));

        this.props.loc = countLogicalCodeLines(code);
        this.props.totalLines = code.split('\n').length;
        this.props.dependencies = dependencies;
        this.props.totalRequiredDependencies = totalRequiredDependencies;
        this.props.totalImportedDependencies = totalImportedDependencies;
        this.props.hasDefaultExport = hasDefaultExport;

        return this;
    }
}