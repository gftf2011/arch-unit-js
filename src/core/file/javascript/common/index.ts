import { RootFile } from '@/core/file/common';

export type JavascriptRelatedFileProps = RootFile.BaseProps & {
  totalRequiredDependencies: number;
  totalImportedDependencies: number;
  totalDinamicImportedDependencies: number;
};
