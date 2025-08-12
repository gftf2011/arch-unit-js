import { RootFile } from '../../common';
import { JavascriptRelatedFileProps } from '../common';

export class JavascriptRelatedFileForNameAnalysis extends RootFile.Base {
  public constructor(public props: JavascriptRelatedFileProps) {
    super(props);
  }

  public override async build(_: RootFile.BaseBuildableProps): Promise<RootFile.Base> {
    return this;
  }
}
