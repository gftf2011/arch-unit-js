import { RootFile } from '@/core/file/common';
import { JavascriptRelatedFileProps } from '@/core/file/javascript/common';

export class JavascriptRelatedFileForNameAnalysis extends RootFile.Base {
  public constructor(public props: JavascriptRelatedFileProps) {
    super(props);
  }

  public override async build(_: RootFile.BaseBuildableProps): Promise<RootFile.Base> {
    return this;
  }
}
