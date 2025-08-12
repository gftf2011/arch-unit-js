import fs from 'fs';
import micromatch from 'micromatch';
import * as path from 'pathe';

import { glob } from '../../utils';
import { RootFile } from '../file';
import { WalkVisitor, AvailableFilesVisitor, NodeFilesVisitor } from './visitors';

export class NodeGraph {
  private constructor(readonly nodes: Map<string, RootFile.Base>) {}

  public static async create(
    fileAnalysisType: RootFile.AnalysisType,
    startPath: string,
    filesOrFoldersToInclude: string[],
    filesOrFoldersToIgnore: string[],
    extensionTypes: string[],
    typescriptPath?: string,
  ): Promise<NodeGraph> {
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
    const nodesVisitor = new NodeFilesVisitor(fileAnalysisType);

    await walk(startPath, availableFilesVisitor, []);
    await walk(startPath, nodesVisitor, availableFilesVisitor.files);

    return new NodeGraph(nodesVisitor.files as Map<string, RootFile.Base>);
  }
}
