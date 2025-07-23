export type DirectoryTree = Directory | File;

export type File = {
    name: string;
    path: string;
    type: 'file';
    dependencies: string[];
}

export type Directory = {
    name: string;
    path: string;
    type: 'directory';
    children: DirectoryTree[];
}
