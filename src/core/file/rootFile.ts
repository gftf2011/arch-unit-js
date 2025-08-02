import { Dependency } from "../dependency";

export abstract class RootFile {
    protected constructor(
        readonly name: string,
        readonly path: string,
        readonly type: 'file' | 'javascript-typescript-file',
        readonly loc: number,
        readonly totalLines: number,
        readonly dependencies: Dependency[] = [],
    ) {}

    public abstract build(rootDir: string, extensions: string[]): Promise<RootFile>;
}