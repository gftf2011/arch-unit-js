import { NodeInfo, WalkVisitor } from './common';
import { FileFactory, RootFile } from '../../file';

export class AvailableFilesVisitor implements WalkVisitor {
  files: string[] = [];

  public async addFile(fullPath: string, _nodeInfo: NodeInfo): Promise<void> {
    this.files.push(fullPath);
  }
}

export class NodeFilesVisitor implements WalkVisitor {
  files: Map<string, RootFile> = new Map();

  public async addFile(fullPath: string, nodeInfo: NodeInfo): Promise<void> {
    const file = await FileFactory.create(nodeInfo.fileName, fullPath).build({
      rootDir: nodeInfo.rootDir,
      availableFiles: nodeInfo.availableFiles,
      extensions: nodeInfo.extensions,
      ...(nodeInfo.typescriptPath ? { typescriptPath: nodeInfo.typescriptPath } : {}),
    });
    (this.files as Map<string, RootFile>).set(file.props.path, file);
  }
}
