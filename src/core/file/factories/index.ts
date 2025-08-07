import { javascript } from "../../../utils";
import { RootFile } from "../common";
import { JavascriptRelatedFile } from "../javascript";

export class FileFactory {
    public static async create(
        fileName: string,
        filePath: string,
        rootDir: string,
        availableFiles: string[]
    ): Promise<RootFile> {
        if (javascript.isJavascriptRelatedFile(fileName)) {
            return await JavascriptRelatedFile.create(fileName, filePath).build(rootDir, availableFiles);
        }
        throw new Error(`Unsupported file type: ${fileName}`);
    }
}