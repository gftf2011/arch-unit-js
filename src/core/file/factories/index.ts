import { RootFile } from '@/core/file/common';
import {
  JavascriptRelatedFileForDependenciesAnalysis,
  JavascriptRelatedFileForLocAnalysis,
  JavascriptRelatedFileForNameAnalysis,
  JavascriptRelatedFileProps,
} from '@/core/file/javascript';
import { javascript } from '@/utils';

export class FileFactory {
  public static create(
    fileName: string,
    filePath: string,
    fileAnalysisType: RootFile.AnalysisType,
  ): RootFile.Base {
    if (
      javascript.isJavascriptRelatedFile(fileName) ||
      javascript.isTypeScriptRelatedFile(fileName)
    ) {
      const props: JavascriptRelatedFileProps = {
        name: fileName,
        path: filePath,
        type: 'javascript-file',
        loc: 0,
        totalLines: 0,
        dependencies: [],
        totalRequiredDependencies: 0,
        totalImportedDependencies: 0,
        totalDinamicImportedDependencies: 0,
      };
      if (fileAnalysisType === RootFile.AnalysisType.LOC) {
        return new JavascriptRelatedFileForLocAnalysis(props);
      } else if (fileAnalysisType === RootFile.AnalysisType.DEPENDENCIES) {
        return new JavascriptRelatedFileForDependenciesAnalysis(props);
      } else if (fileAnalysisType === RootFile.AnalysisType.NAME_ANALYSIS) {
        return new JavascriptRelatedFileForNameAnalysis(props);
      }
    }
    throw new Error(`Unsupported file type: ${fileName}`);
  }
}
