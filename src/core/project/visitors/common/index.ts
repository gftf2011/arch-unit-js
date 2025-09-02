export type FileInfo = {
  fileName: string;
  rootDir: string;
  availableFiles: string[];
  extensions: string[];
  typescriptPath?: string;
  webpack?: {
    path: string;
    names?: string[];
  };
};
