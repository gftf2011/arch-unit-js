import {
  JavascriptRelatedBuildableProps,
  JavascriptRelatedFile,
} from '@/core/file/javascript/common';

export class JavascriptRelatedFileForNameAnalysis extends JavascriptRelatedFile {
  public constructor(
    protected readonly fileName: string,
    protected readonly filePath: string,
  ) {
    super(fileName, filePath);
  }

  public override async buildByProps(
    _: JavascriptRelatedBuildableProps,
  ): Promise<JavascriptRelatedFile> {
    return this;
  }
}
