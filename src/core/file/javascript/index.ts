import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import fsPromises from 'fs/promises';
import * as path from 'pathe';

import { Dependency, DependencyFactory } from '../../dependency';
import { RootFile, RootFileBuildableProps, RootFileProps } from '../common';
import {
  CallExpressionInfo,
  DefaultExportInfo,
  ImportDeclarationInfo,
  createCallExpressionVisitor,
  createDefaultExportVisitor,
  createImportDeclarationVisitor,
} from './visitors';

export type JavascriptRelatedFileProps = RootFileProps & {
  totalRequiredDependencies: number;
  totalImportedDependencies: number;
  totalDinamicImportedDependencies: number;
  hasDefaultExport: boolean;
};

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
      totalDinamicImportedDependencies: 0,
      hasDefaultExport: false,
    });
  }

  public override async build(
    buildableProps: RootFileBuildableProps
  ): Promise<JavascriptRelatedFile> {
    const filePath = this.props.path;

    const code = await fsPromises.readFile(filePath, 'utf-8');

    const ast = parse(code, {
      sourceType: 'unambiguous', // supports both ESM & CJS
      plugins: [
        'decorators-legacy',
        'typescript',
        'jsx',
      ], // allows parsing TypeScript & JSX syntax incl. parameter decorators
    });

    const countLogicalCodeLines = (code: string): number => {
      const lines = code.split('\n');
      return lines.filter((line) => {
        const trimmed = line.trim();
        return (
          trimmed.length > 0 &&
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('/*') &&
          !trimmed.startsWith('*')
        );
      }).length;
    };

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
          }),
        );
      },
    };
    const callExpressionInfo: CallExpressionInfo = {
      totalRequiredDependencies: 0,
      totalDinamicImportedDependencies: 0,
      addDependency: (dependencyName: string) => {
        dependencies.push(
          DependencyFactory.create({
            name: dependencyName,
            resolvedWith: 'require',
            comesFrom: 'javascript',
          }),
        );
      },
    };

    traverse(ast, {
      ...createDefaultExportVisitor(defaultExportInfo),
      ...createImportDeclarationVisitor(importDeclarationInfo),
      ...createCallExpressionVisitor(callExpressionInfo),
    });

    dependencies.forEach((dependency) =>
      dependency.resolve({
        rootDir: buildableProps.rootDir,
        fileDir: path.dirname(filePath),
        availableFiles: buildableProps.availableFiles,
        extensions: buildableProps.extensions,
        ...(buildableProps.typescriptPath ? { typescriptPath: buildableProps.typescriptPath } : {}),
      }),
    );

    this.props.loc = countLogicalCodeLines(code);
    this.props.totalLines = code.split('\n').length;
    this.props.dependencies = dependencies;
    this.props.totalRequiredDependencies = callExpressionInfo.totalRequiredDependencies;
    this.props.totalImportedDependencies = importDeclarationInfo.totalImportedDependencies;
    this.props.totalDinamicImportedDependencies =
      callExpressionInfo.totalDinamicImportedDependencies;
    this.props.hasDefaultExport = defaultExportInfo.hasDefaultExport;

    return this;
  }
}
