import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import fsPromises from 'fs/promises';

import { Dependency, DependencyFactory, DependencyResolvedWith } from '@/core/dependency';
import { RootFile } from '@/core/file/common';
import { Visitors, VisitorsInfo } from '@/core/file/javascript/analysis/visitors';
import { JavascriptRelatedFileProps } from '@/core/file/javascript/common';

export class JavascriptRelatedFileForDependenciesAnalysis extends RootFile.Base {
  public constructor(public props: JavascriptRelatedFileProps) {
    super(props);
  }

  public override async build(buildableProps: RootFile.BaseBuildableProps): Promise<RootFile.Base> {
    const filePath = this.props.path;

    const code = await fsPromises.readFile(filePath, 'utf-8');

    const ast = parse(code, {
      sourceType: 'unambiguous', // supports both ESM & CJS
      plugins: [
        'jsx',
        'typescript',
        'dynamicImport',
        'importMeta',
        'decorators-legacy', // ["decorators", { version: isTC39 ? "2023-05" : "legacy", decoratorsBeforeExport: true }],
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'topLevelAwait',
      ], // allows parsing TypeScript & JSX syntax incl. parameter decorators
    });

    const dependencies: Dependency[] = [];

    const resolveDependenciesVisitorInfo: VisitorsInfo.ResolveDependenciesVisitorInfo = {
      totalImportedDependencies: 0,
      totalRequiredDependencies: 0,
      totalDinamicImportedDependencies: 0,
      addDependency: (dependencyName: string, type: DependencyResolvedWith) => {
        dependencies.push(
          DependencyFactory.create({
            name: dependencyName,
            resolvedWith: type,
            comesFrom: 'javascript',
          }),
        );
      },
    };

    const resolveDependenciesVisitor = new Visitors.ResolveDependenciesVisitor();

    traverse(ast, {
      ...resolveDependenciesVisitor.visit(resolveDependenciesVisitorInfo),
    });

    dependencies.forEach((dependency) =>
      dependency.resolve({
        rootDir: buildableProps.rootDir,
        filePath,
        availableFiles: buildableProps.availableFiles,
        extensions: buildableProps.extensions,
        ...(buildableProps.typescriptPath ? { typescriptPath: buildableProps.typescriptPath } : {}),
      }),
    );

    this.props.dependencies = dependencies;
    this.props.totalRequiredDependencies = resolveDependenciesVisitorInfo.totalRequiredDependencies;
    this.props.totalImportedDependencies = resolveDependenciesVisitorInfo.totalImportedDependencies;
    this.props.totalDinamicImportedDependencies =
      resolveDependenciesVisitorInfo.totalDinamicImportedDependencies;

    return this;
  }
}
