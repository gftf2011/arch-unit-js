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

export type RootFileBuildableProps = {
    rootDir: string,
    availableFiles: string[],
    extensions: string[],
    typescriptPath?: string,
}

export abstract class RootFile {
    protected constructor(public props: RootFileProps) {}

    public abstract build(buildableProps: RootFileBuildableProps): Promise<RootFile>;
}