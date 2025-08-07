import { Dependency } from "../../dependency";

export type JavascriptOrTypescriptRelatedFileType = 'javascript-file' | 'typescript-file';
export type FileType = 'file' | JavascriptOrTypescriptRelatedFileType;

export abstract class RootFile {
    protected constructor(
        readonly name: string,
        readonly path: string,
        readonly type: FileType,
        readonly loc: number,
        readonly totalLines: number,
        readonly dependencies: Dependency[] = [],
    ) {}

    public abstract build(rootDir: string, extensions: string[], availableFiles: string[]): Promise<RootFile>;
}