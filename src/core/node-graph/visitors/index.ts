import { NodeInfo } from './common';
import { FileFactory, RootFile } from '../../file';

export interface WalkVisitor {
  files: string[] | Map<string, RootFile.Base>;
  addFile: (fullPath: string, nodeInfo: NodeInfo) => Promise<void>;
}

export class AvailableFilesVisitor implements WalkVisitor {
  files: string[] = [];

  public async addFile(fullPath: string, _nodeInfo: NodeInfo): Promise<void> {
    this.files.push(fullPath);
  }
}

export class NodeFilesVisitor implements WalkVisitor {
  files: Map<string, RootFile.Base> = new Map();

  public async addFile(fullPath: string, nodeInfo: NodeInfo): Promise<void> {
    const file = await FileFactory.create(nodeInfo.fileName, fullPath).build({
      rootDir: nodeInfo.rootDir,
      availableFiles: nodeInfo.availableFiles,
      extensions: nodeInfo.extensions,
      ...(nodeInfo.typescriptPath ? { typescriptPath: nodeInfo.typescriptPath } : {}),
    });
    (this.files as Map<string, RootFile.Base>).set(file.props.path, file);
  }
}
