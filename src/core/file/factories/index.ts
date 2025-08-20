import { RootFile } from '@/core/file/common';
import {
  JavascriptRelatedFileForDependenciesAnalysis,
  JavascriptRelatedFileForLocAnalysis,
  JavascriptRelatedFileForNameAnalysis,
  JavascriptRelatedFileForProjectSizeAnalysis,
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
      if (fileAnalysisType === RootFile.AnalysisType.LOC) {
        return new JavascriptRelatedFileForLocAnalysis(fileName, filePath);
      } else if (fileAnalysisType === RootFile.AnalysisType.DEPENDENCIES) {
        return new JavascriptRelatedFileForDependenciesAnalysis(fileName, filePath);
      } else if (fileAnalysisType === RootFile.AnalysisType.NAME_ANALYSIS) {
        return new JavascriptRelatedFileForNameAnalysis(fileName, filePath);
      } else if (fileAnalysisType === RootFile.AnalysisType.PROJECT_SIZE) {
        return new JavascriptRelatedFileForProjectSizeAnalysis(fileName, filePath);
      }
    }
    throw new Error(`Unsupported file type: ${fileName}`);
  }
}
