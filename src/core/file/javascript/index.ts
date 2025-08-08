import fsPromises from 'fs/promises';
import * as path from 'pathe';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import { Dependency, DependencyFactory } from "../../dependency";
import { RootFile, RootFileBuildableProps, RootFileProps } from "../common";
import {
    CallExpressionInfo,
    DefaultExportInfo,
    ImportDeclarationInfo,
    createCallExpressionVisitor,
    createDefaultExportVisitor,
    createImportDeclarationVisitor,
} from './visitors';

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

        const defaultExportInfo: DefaultExportInfo = { hasDefaultExport: false };
        const importDeclarationInfo: ImportDeclarationInfo = {
            totalImportedDependencies: 0,
            addDependency: (dependencyName: string) => {
                dependencies.push(
                    DependencyFactory.create({
                        name: dependencyName,
                        resolvedWith: 'import',
                        comesFrom: 'javascript',
                    })
                );
            },
        };
        const callExpressionInfo: CallExpressionInfo = {
            totalRequiredDependencies: 0,
            addDependency: (dependencyName: string) => {
                dependencies.push(
                    DependencyFactory.create({
                        name: dependencyName,
                        resolvedWith: 'require',
                        comesFrom: 'javascript',
                    })
                );
            },
        };

        traverse(ast, {
          ...createDefaultExportVisitor(defaultExportInfo),
          ...createImportDeclarationVisitor(importDeclarationInfo),
          ...createCallExpressionVisitor(callExpressionInfo),
        });

        hasDefaultExport = defaultExportInfo.hasDefaultExport;
        totalImportedDependencies = importDeclarationInfo.totalImportedDependencies;
        totalRequiredDependencies = callExpressionInfo.totalRequiredDependencies;

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