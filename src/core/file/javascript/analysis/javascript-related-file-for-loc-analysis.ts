import fsPromises from 'fs/promises';

import { RootFile } from '@/core/file/common';
import {
  JavascriptRelatedBuildableProps,
  JavascriptRelatedFile,
} from '@/core/file/javascript/common';

export class JavascriptRelatedFileForLocAnalysis extends JavascriptRelatedFile {
  public constructor(
    protected readonly fileName: string,
    protected readonly filePath: string,
    protected readonly fileType: RootFile.JavascriptOrTypescriptRelatedFileType,
  ) {
    super(fileName, filePath, fileType);
  }

  public override async build(_: JavascriptRelatedBuildableProps): Promise<JavascriptRelatedFile> {
    const filePath = this.props.path;

    const code = await fsPromises.readFile(filePath, 'utf-8');

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

    this.props.loc = countLogicalCodeLines(code);

    return this;
  }
}
