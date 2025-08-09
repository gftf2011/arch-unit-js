import { javascript } from '../../../utils';
import { RootFile } from '../common';
import { JavascriptRelatedFile } from '../javascript';

export class FileFactory {
  public static create(fileName: string, filePath: string): RootFile {
    if (
      javascript.isJavascriptRelatedFile(fileName) ||
      javascript.isTypeScriptRelatedFile(fileName)
    ) {
      return JavascriptRelatedFile.create(fileName, filePath);
    }
    throw new Error(`Unsupported file type: ${fileName}`);
  }
}
