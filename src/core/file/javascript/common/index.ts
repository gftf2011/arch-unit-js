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
    protected readonly fileType: RootFile.JavascriptOrTypescriptRelatedFileType,
  ) {
    super();

    this.props = {
      name: this.fileName,
      path: this.filePath,
      type: fileType,
      loc: 0,
      size: 0,
      totalLines: 0,
      dependencies: [],
      totalRequiredDependencies: 0,
      totalImportedDependencies: 0,
      totalDinamicImportedDependencies: 0,
    };
  }
}
