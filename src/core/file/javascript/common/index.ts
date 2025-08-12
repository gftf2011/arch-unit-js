import { RootFile } from '../../common';

export type JavascriptRelatedFileProps = RootFile.BaseProps & {
  totalRequiredDependencies: number;
  totalImportedDependencies: number;
  totalDinamicImportedDependencies: number;
};
