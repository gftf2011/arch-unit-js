import fs from 'fs';
import micromatch from 'micromatch';
import * as path from 'pathe';

import { RootFile } from '@/core/file';
import { WalkVisitor, AvailableFilesVisitor, FilesVisitor } from '@/core/project/visitors';
import { glob } from '@/utils';

export class Project {
  private constructor(
    protected projectSizeInBytes: number,
    protected files: Map<string, RootFile.Base>,
  ) {}

  public getProjectSizeInBytes(): number {
    return this.projectSizeInBytes;
  }

  public getFiles(): Map<string, RootFile.Base> {
    return this.files;
  }

  public setFiles(files: Map<string, RootFile.Base>): void {
    this.files = files;
  }

  public static async create(
    fileAnalysisType: RootFile.AnalysisType,
    startPath: string,
    filesOrFoldersToInclude: string[],
    filesOrFoldersToIgnore: string[],
    extensionTypes: string[],
    workspaceDir?: string,
    typescriptPath?: string,
    webpack?: {
      path: string;
      names?: string[];
    },
  ): Promise<Project> {
    const extensions = extensionTypes.map((mimeType) =>
      glob.extractExtensionFromGlobPattern(mimeType),
    ) as string[];

    const includePatterns = glob.resolveRootDirPatterns(
      filesOrFoldersToInclude,
      startPath,
      workspaceDir,
    );
    const ignorePatterns = glob.resolveRootDirPatterns(
      filesOrFoldersToIgnore,
      startPath,
      workspaceDir,
    );

    const typescriptPathResolved = typescriptPath
      ? glob.resolveRootDirPattern(typescriptPath, startPath, workspaceDir)
      : typescriptPath;

    const webpackResolved = webpack
      ? {
          path: glob.resolveRootDirPattern(webpack.path, startPath, workspaceDir),
          ...(webpack.names ? { names: webpack.names } : {}),
        }
      : webpack;

    const workspaceDirResolved = workspaceDir
      ? glob.resolveRootDirPattern(workspaceDir, startPath, workspaceDir)
      : workspaceDir;

    async function walk(currentPath: string, visitor: WalkVisitor, availableFiles: string[]) {
      const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (micromatch([fullPath], [...includePatterns, ...ignorePatterns]).length > 0) {
          if (entry.isDirectory()) {
            await walk(fullPath, visitor, availableFiles);
          } else if (entry.isFile()) {
            await visitor.addFile(fullPath, {
              fileName: entry.name,
              rootDir: startPath,
              availableFiles,
              extensions,
              workspaceDir: workspaceDirResolved,
              ...(typescriptPathResolved ? { typescriptPath: typescriptPathResolved } : {}),
              ...(webpackResolved
                ? { webpack: { path: webpackResolved.path, names: webpackResolved.names } }
                : {}),
            });
          }
        }
      }
    }

    const availableFilesVisitor = new AvailableFilesVisitor();
    const filesVisitor = new FilesVisitor(fileAnalysisType);

    const currentPath = workspaceDirResolved || startPath;

    await walk(currentPath, availableFilesVisitor, []);
    await walk(currentPath, filesVisitor, availableFilesVisitor.files);

    let projectSizeInBytes = 0;
    for (const [_, file] of filesVisitor.files) {
      projectSizeInBytes += file.props.size;
    }

    return new Project(projectSizeInBytes, filesVisitor.files as Map<string, RootFile.Base>);
  }
}
