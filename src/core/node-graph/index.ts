import fs from 'fs';
import * as path from 'pathe';
import micromatch from 'micromatch';
import { RootFile, FileFactory } from '../file';
import { glob } from "../../utils";

export class NodeGraph {
    private constructor(
        readonly nodes: Map<string, RootFile>
    ) {}

    public static async create(
        startPath: string,
        filesOrFoldersToInclude: string[],
        filesOrFoldersToIgnore: string[],
        extensionTypes: string[],
        typescriptPath?: string,
      ): Promise<NodeGraph> {
        const nodes: Map<string, RootFile> = new Map();

        const extensions = extensionTypes.map(mimeType => glob.extractExtensionFromGlobPattern(mimeType)) as string[];

        const includePatterns = glob.resolveRootDirPatterns(filesOrFoldersToInclude, startPath);
        const ignorePatterns = glob.resolveRootDirPatterns(filesOrFoldersToIgnore, startPath);

        const typescriptPathResolved = typescriptPath ? glob.resolveRootDirPattern(typescriptPath, startPath) : typescriptPath;

        const availableFiles: string[] = [];

        async function walkByAvailableFiles(currentPath: string) {
          const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (micromatch([fullPath], [...includePatterns, ...ignorePatterns]).length > 0) {
              if (entry.isDirectory()) {
                await walkByAvailableFiles(fullPath);
              } else if (entry.isFile()) {
                availableFiles.push(fullPath);
              }
            }
          }
        }

        async function walk(currentPath: string) {
          const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (micromatch([fullPath], [...includePatterns, ...ignorePatterns]).length > 0) {
              if (entry.isDirectory()) {
                await walk(fullPath);
              } else if (entry.isFile()) {
                const file = await FileFactory.create(entry.name, fullPath).build({
                  rootDir: startPath,
                  availableFiles,
                  extensions,
                  ...(typescriptPathResolved ? { typescriptPath: typescriptPathResolved } : {})
                });
                nodes.set(file.props.path, file);
              }
            }
          }
        }

        await walkByAvailableFiles(startPath);
        await walk(startPath);

        return new NodeGraph(nodes);
    }
}