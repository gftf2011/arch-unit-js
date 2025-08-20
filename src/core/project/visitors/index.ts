import { FileFactory, RootFile } from '@/core/file';
import { FileInfo } from '@/core/project/visitors/common';

export interface WalkVisitor {
  files: string[] | Map<string, RootFile.Base>;
  addFile: (fullPath: string, fileInfo: FileInfo) => Promise<void>;
}

export class AvailableFilesVisitor implements WalkVisitor {
  files: string[] = [];

  public async addFile(fullPath: string, _fileInfo: FileInfo): Promise<void> {
    this.files.push(fullPath);
  }
}

export class FilesVisitor implements WalkVisitor {
  constructor(private readonly fileAnalysisType: RootFile.AnalysisType) {}

  files: Map<string, RootFile.Base> = new Map();

  public async addFile(fullPath: string, fileInfo: FileInfo): Promise<void> {
    const file = await FileFactory.create(fileInfo.fileName, fullPath, this.fileAnalysisType).build(
      {
        rootDir: fileInfo.rootDir,
        availableFiles: fileInfo.availableFiles,
        extensions: fileInfo.extensions,
        ...(fileInfo.typescriptPath ? { typescriptPath: fileInfo.typescriptPath } : {}),
      },
    );

    this.files.set(file.props.path, file);
  }
}
