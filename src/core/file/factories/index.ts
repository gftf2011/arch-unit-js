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
    if (javascript.isJavascriptRelatedFile(fileName)) {
      if (fileAnalysisType === RootFile.AnalysisType.LOC) {
        return new JavascriptRelatedFileForLocAnalysis(fileName, filePath, 'javascript-file');
      } else if (fileAnalysisType === RootFile.AnalysisType.DEPENDENCIES) {
        return new JavascriptRelatedFileForDependenciesAnalysis(
          fileName,
          filePath,
          'javascript-file',
        );
      } else if (fileAnalysisType === RootFile.AnalysisType.NAME_ANALYSIS) {
        return new JavascriptRelatedFileForNameAnalysis(fileName, filePath, 'javascript-file');
      } else if (fileAnalysisType === RootFile.AnalysisType.PROJECT_SIZE) {
        return new JavascriptRelatedFileForProjectSizeAnalysis(
          fileName,
          filePath,
          'javascript-file',
        );
      }
    } else if (javascript.isTypeScriptRelatedFile(fileName)) {
      if (fileAnalysisType === RootFile.AnalysisType.LOC) {
        return new JavascriptRelatedFileForLocAnalysis(fileName, filePath, 'typescript-file');
      } else if (fileAnalysisType === RootFile.AnalysisType.DEPENDENCIES) {
        return new JavascriptRelatedFileForDependenciesAnalysis(
          fileName,
          filePath,
          'typescript-file',
        );
      } else if (fileAnalysisType === RootFile.AnalysisType.NAME_ANALYSIS) {
        return new JavascriptRelatedFileForNameAnalysis(fileName, filePath, 'typescript-file');
      } else if (fileAnalysisType === RootFile.AnalysisType.PROJECT_SIZE) {
        return new JavascriptRelatedFileForProjectSizeAnalysis(
          fileName,
          filePath,
          'typescript-file',
        );
      }
    }
    throw new Error(`Unsupported file type: ${fileName}`);
  }
}
