import fsPromises from 'fs/promises';

import { RootFile } from '../../common';
import { JavascriptRelatedFileProps } from '../common';

export class JavascriptRelatedFileForLocAnalysis extends RootFile.Base {
  public constructor(public props: JavascriptRelatedFileProps) {
    super(props);
  }

  public override async build(
    _: RootFile.BaseBuildableProps,
  ): Promise<JavascriptRelatedFileForLocAnalysis> {
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
