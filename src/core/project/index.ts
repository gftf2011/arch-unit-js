import fs from 'fs';
import micromatch from 'micromatch';
import * as path from 'pathe';

import { RootFile } from '@/core/file';
import { WalkVisitor, AvailableFilesVisitor, FilesVisitor } from '@/core/project/visitors';
import { glob } from '@/utils';

export class Project {
  private constructor(protected files: Map<string, RootFile.Base>) {}

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
    typescriptPath?: string,
  ): Promise<Project> {
    const extensions = extensionTypes.map((mimeType) =>
      glob.extractExtensionFromGlobPattern(mimeType),
    ) as string[];

    const includePatterns = glob.resolveRootDirPatterns(filesOrFoldersToInclude, startPath);
    const ignorePatterns = glob.resolveRootDirPatterns(filesOrFoldersToIgnore, startPath);

    const typescriptPathResolved = typescriptPath
      ? glob.resolveRootDirPattern(typescriptPath, startPath)
      : typescriptPath;

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
              ...(typescriptPathResolved ? { typescriptPath: typescriptPathResolved } : {}),
            });
          }
        }
      }
    }

    const availableFilesVisitor = new AvailableFilesVisitor();
    const filesVisitor = new FilesVisitor(fileAnalysisType);

    await walk(startPath, availableFilesVisitor, []);
    await walk(startPath, filesVisitor, availableFilesVisitor.files);

    return new Project(filesVisitor.files as Map<string, RootFile.Base>);
  }
}
