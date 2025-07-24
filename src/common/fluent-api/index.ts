export type File = {
    name: string;
    path: string;
    type: 'file';
    dependencies: string[];
}

export type Options = {
  mimeTypes: string[],
  includeMatcher: string[],
  ignoreMatcher: string[]
}