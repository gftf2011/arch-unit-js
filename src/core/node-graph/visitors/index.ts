import { FileFactory, RootFile } from '@/core/file';
import { NodeInfo } from '@/core/node-graph/visitors/common';

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
  constructor(private readonly fileAnalysisType: RootFile.AnalysisType) {}

  files: Map<string, RootFile.Base> = new Map();

  public async addFile(fullPath: string, nodeInfo: NodeInfo): Promise<void> {
    const file = await FileFactory.create(nodeInfo.fileName, fullPath, this.fileAnalysisType).build(
      {
        rootDir: nodeInfo.rootDir,
        availableFiles: nodeInfo.availableFiles,
        extensions: nodeInfo.extensions,
        ...(nodeInfo.typescriptPath ? { typescriptPath: nodeInfo.typescriptPath } : {}),
      },
    );

    this.files.set(file.props.path, file);
  }
}
