export type Dependency = {
    name: string;
    type: 'valid-path' | 'invalid' | 'node-package' | 'node-dev-package' | 'node-builtin-module';
}

export type File = {
    name: string;
    path: string;
    type: 'file';
    dependencies: Dependency[];
}

export type Options = {
  mimeTypes: string[],
  includeMatcher: string[],
  ignoreMatcher: string[]
}

export interface Checkable {
    check(): Promise<boolean>;
}
