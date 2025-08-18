import fsPromises from 'fs/promises';

import { RootFile } from '@/core/file/common';

export type JavascriptRelatedFileProps = RootFile.BaseProps & {
  totalRequiredDependencies: number;
  totalImportedDependencies: number;
  totalDinamicImportedDependencies: number;
};

export type JavascriptRelatedBuildableProps = RootFile.BaseBuildableProps;

export abstract class JavascriptRelatedFile extends RootFile.Base {
  public override props: JavascriptRelatedFileProps;

  public constructor(
    protected readonly fileName: string,
    protected readonly filePath: string,
  ) {
    super();

    this.props = {
      name: this.fileName,
      path: this.filePath,
      type: 'javascript-file',
      loc: 0,
      size: 0,
      totalLines: 0,
      dependencies: [],
      totalRequiredDependencies: 0,
      totalImportedDependencies: 0,
      totalDinamicImportedDependencies: 0,
    };
  }

  public abstract buildByProps(
    props: JavascriptRelatedBuildableProps,
  ): Promise<JavascriptRelatedFile>;

  public override async build(
    buildableProps: JavascriptRelatedBuildableProps,
  ): Promise<JavascriptRelatedFile> {
    this.props.size = (await fsPromises.stat(this.filePath)).size;
    return this.buildByProps(buildableProps);
  }
}
