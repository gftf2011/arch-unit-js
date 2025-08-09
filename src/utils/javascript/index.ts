import * as fs from 'fs';

export function isTypeScriptRelatedFile(fileName: string): boolean {
  const extensions = ['.ts', '.mts', '.cts', '.d.ts', '.tsx'];
  return extensions.some((ext) => fileName.endsWith(ext));
}

export function isJavascriptRelatedFile(fileName: string): boolean {
  const extensions = ['.js', '.mjs', '.cjs', 'jsx'];
  return extensions.some((ext) => fileName.endsWith(ext));
}

export function generateDependenciesCandidates(pathName: string, extensions: string[]): string[] {
  const pathNameAsIs: string = pathName;
  const pathNameAsDirectoryToIndex: string[] = extensions.map((ext) => pathName + `/index${ext}`);
  const pathNameAsFile: string[] = extensions.map((ext) => pathName + `${ext}`);
  return [pathNameAsIs, ...pathNameAsDirectoryToIndex, ...pathNameAsFile];
}

export function getDependencyCandidateIfExists(candidates: string[]): string | null {
  for (const candidate of candidates) {
    try {
      const stat = fs.statSync(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      // do nothing
    }
  }
  return null;
}
