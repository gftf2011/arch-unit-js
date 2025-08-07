import { Dependency } from "../../dependency";

export type JavascriptOrTypescriptRelatedFileType = 'javascript-file' | 'typescript-file';
export type FileType = 'file' | JavascriptOrTypescriptRelatedFileType;

export type RootFileProps = {
    name: string,
    path: string,
    type: FileType,
    loc: number,
    totalLines: number,
    dependencies: Dependency[],
}

export abstract class RootFile {
    protected constructor(public props: RootFileProps) {}

    public abstract build(rootDir: string, extensions: string[], availableFiles: string[]): Promise<RootFile>;
}