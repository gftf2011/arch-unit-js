import { RootFile } from '../../../file';

export type NodeInfo = {
  fileName: string;
  rootDir: string;
  availableFiles: string[];
  extensions: string[];
  typescriptPath?: string;
};

export interface WalkVisitor {
  files: string[] | Map<string, RootFile>;
  addFile: (fullPath: string, nodeInfo: NodeInfo) => Promise<void>;
}
