import * as path from 'pathe';

export function resolveRootDirPatterns(
  patterns: string[],
  rootDir: string,
  workspaceDir?: string,
): string[] {
  return patterns.map((pattern) => resolveRootDirPattern(pattern, rootDir, workspaceDir));
}

export function resolveRootDirPattern(
  pattern: string,
  rootDir: string,
  workspaceDir?: string,
): string {
  if (workspaceDir) {
    if (pattern.startsWith('!')) {
      const cleanedWorkspaceDir = workspaceDir
        .replace('<rootDir>', '')
        .replace(/^!/, '')
        .replace(/^\.?\//, '');
      const workspaceDirPath = path.resolve(rootDir, cleanedWorkspaceDir);
      if (pattern.includes('<workspaceDir>')) {
        const cleaned = pattern.replace('<workspaceDir>', '').replace(/^!/, '');
        const relative = cleaned.replace(/^\.?\//, '');
        const newPattern = `!${path.resolve(workspaceDirPath, relative)}`;
        return newPattern;
      } else if (pattern.includes('<rootDir>')) {
        const cleaned = pattern.replace('<rootDir>', '').replace(/^!/, '');
        const relative = cleaned.replace(/^\.?\//, '');
        const newPattern = `!${path.resolve(rootDir, relative)}`;
        return newPattern;
      }
      const cleaned = pattern.replace(/^!/, '');
      const relative = cleaned.replace(/^\.?\//, '');
      const newPattern = `!${path.resolve(workspaceDirPath, relative)}`;
      return newPattern;
    }
    const cleanedWorkspaceDir = workspaceDir
      .replace('<rootDir>', '')
      .replace(/^\.?\//, '');
    const workspaceDirPath = path.resolve(rootDir, cleanedWorkspaceDir);
    if (pattern.includes('<workspaceDir>')) {
      const cleaned = pattern.replace('<workspaceDir>', '');
      const relative = cleaned.replace(/^\.?\//, '');
      const newPattern = path.resolve(workspaceDirPath, relative);
      return newPattern;
    } else if (pattern.includes('<rootDir>')) {
      const cleaned = pattern.replace('<rootDir>', '');
      const relative = cleaned.replace(/^\.?\//, '');
      const newPattern = `${path.resolve(rootDir, relative)}`;
      return newPattern;
    }
    const cleaned = pattern;
    const relative = cleaned.replace(/^\.?\//, '');
    const newPattern = `${path.resolve(rootDir, relative)}`;
    return newPattern;
  } else {
    if (pattern.startsWith('!')) {
      const cleaned = pattern.replace('<rootDir>', '').replace(/^!/, '');
      const relative = cleaned.replace(/^\.?\//, '');
      const newPattern = `!${path.resolve(rootDir, relative)}`;
      return newPattern;
    }
    const cleaned = pattern.replace('<rootDir>', '');
    const relative = cleaned.replace(/^\.?\//, '');
    const newPattern = path.resolve(rootDir, relative);
    return newPattern;
  }
}

export function extractExtensionFromGlobPattern(pattern: string): string | null {
  const match = pattern.match(/\.[^.\\/:*?"<>|\r\n]+$/);
  return match ? match[0] : null;
}
