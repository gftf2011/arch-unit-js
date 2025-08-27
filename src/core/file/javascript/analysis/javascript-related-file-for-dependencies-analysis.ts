import { parse, ParserPlugin } from '@babel/parser';
import traverse from '@babel/traverse';
import fsPromises from 'fs/promises';

import { Dependency, DependencyFactory, DependencyResolvedWith } from '@/core/dependency';
import { Visitors, VisitorsInfo } from '@/core/file/javascript/analysis/visitors';
import {
  JavascriptRelatedBuildableProps,
  JavascriptRelatedFile,
} from '@/core/file/javascript/common';

export class JavascriptRelatedFileForDependenciesAnalysis extends JavascriptRelatedFile {
  public constructor(
    protected readonly fileName: string,
    protected readonly filePath: string,
  ) {
    super(fileName, filePath);
  }

  private parseBabelPlugins(code: string) {
    const decoratorsPlugins: ParserPlugin[] = [
      ['decorators', { decoratorsBeforeExport: true, allowCallParenthesized: true }],
      ['decorators', { decoratorsBeforeExport: true, allowCallParenthesized: false }],
      'decorators-legacy',
    ];

    for (const decoratorPlugin of decoratorsPlugins) {
      try {
        const ast = parse(code, {
          sourceType: 'unambiguous', // supports both ESM & CJS
          plugins: [
            'jsx',
            'typescript',
            'dynamicImport',
            'importMeta',
            decoratorPlugin,
            'classProperties',
            'classPrivateProperties',
            'classPrivateMethods',
            'topLevelAwait',
          ], // allows parsing TypeScript & JSX syntax incl. parameter decorators
        });
        return ast;
      } catch (_error) {
        continue;
      }
    }

    throw new Error('Failed to parse code with any of the decorators plugins');
  }

  public override async build(
    buildableProps: JavascriptRelatedBuildableProps,
  ): Promise<JavascriptRelatedFile> {
    const filePath = this.filePath;

    const code = await fsPromises.readFile(filePath, 'utf-8');

    const ast = this.parseBabelPlugins(code);

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
        ...(buildableProps.webpack ? { webpack: buildableProps.webpack } : {}),
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
