import { parse, ParserPlugin } from '@babel/parser';
import traverse from '@babel/traverse';
import fsPromises from 'fs/promises';

import { RootFile } from '@/core/file/common';
import {
  JavascriptRelatedBuildableProps,
  JavascriptRelatedFile,
} from '@/core/file/javascript/common';

export class JavascriptRelatedFileForClassComponentAnalysis extends JavascriptRelatedFile {
  public constructor(
    protected readonly fileName: string,
    protected readonly filePath: string,
    protected readonly fileType: RootFile.JavascriptOrTypescriptRelatedFileType,
  ) {
    super(fileName, filePath, fileType);
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

    traverse(ast, {});

    return this;
  }
}
