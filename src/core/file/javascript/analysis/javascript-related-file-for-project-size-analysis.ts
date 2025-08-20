import fsPromises from 'fs/promises';

import {
  JavascriptRelatedBuildableProps,
  JavascriptRelatedFile,
} from '@/core/file/javascript/common';

export class JavascriptRelatedFileForProjectSizeAnalysis extends JavascriptRelatedFile {
  public constructor(
    protected readonly fileName: string,
    protected readonly filePath: string,
  ) {
    super(fileName, filePath);
  }

  public override async build(_: JavascriptRelatedBuildableProps): Promise<JavascriptRelatedFile> {
    this.props.size = (await fsPromises.stat(this.filePath)).size;
    return this;
  }
}
