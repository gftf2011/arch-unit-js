import fsPromises from 'fs/promises';
import path from 'path';
import micromatch from 'micromatch';
import { RootFile, FileFactory } from '../file';
import {
    extractExtensionFromGlobPattern,
    resolveRootDirPatternToGlobPattern
} from "../../utils";

export class NodeGraph {
    private constructor(
        readonly nodes: Map<string, RootFile>
    ) {}

    public static async create(
        startPath: string,
        filesOrFoldersToInclude: string[],
        filesOrFoldersToIgnore: string[],
        extensionTypes: string[]
      ): Promise<NodeGraph> {
        const nodes: Map<string, RootFile> = new Map();
    
        const extensions = extensionTypes.map(mimeType => extractExtensionFromGlobPattern(mimeType)) as string[];
      
        const includePatterns = resolveRootDirPatternToGlobPattern(filesOrFoldersToInclude, startPath);
        const ignorePatterns = resolveRootDirPatternToGlobPattern(filesOrFoldersToIgnore, startPath);

        async function walk(currentPath: string, extensions: string[]) {
          const entries = await fsPromises.readdir(currentPath, { withFileTypes: true });
    
          for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (micromatch([fullPath], [...includePatterns, ...ignorePatterns]).length > 0) {
              if (entry.isDirectory()) {
                await walk(fullPath, extensions);
              } else if (entry.isFile()) {

                const file = await FileFactory.create(entry.name, fullPath, startPath, extensions);
                nodes.set(file.path, file);
              }
            }
          }
        }

        await walk(startPath, extensions);
    
        return new NodeGraph(nodes);
    }
}