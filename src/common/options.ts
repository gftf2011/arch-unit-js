export type Options = {
    rootDir: string;
    workspaceDir?: string;
    extensions: string[];
    matchers: string[];
    typescriptPath?: string;
    webpack?: {
      path: string;
      names?: string[];
    };
};