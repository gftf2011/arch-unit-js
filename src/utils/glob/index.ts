import fs from 'fs';
import * as path from 'pathe';

/**
 * Resolves glob patterns containing `<rootDir>` placeholders to absolute file system paths.
 *
 * This function processes an array of glob patterns and resolves any `<rootDir>` placeholders
 * to the actual root directory path. It handles both positive patterns (include) and negative
 * patterns (exclude, prefixed with `!`). The function also normalizes path separators to ensure
 * cross-platform compatibility.
 *
 * The function performs the following transformations:
 * - Replaces `<rootDir>` placeholder with the actual root directory path
 * - Removes leading `./` or `/` from relative patterns
 * - Converts backslashes to forward slashes for consistency
 * - Resolves relative paths to absolute paths using `path.resolve()`
 * - Preserves negation prefix (`!`) for exclude patterns
 *
 * This is particularly useful in build tools, testing frameworks, and file processing utilities
 * where patterns need to be resolved against a specific project root directory.
 *
 * @param patterns - Array of glob patterns that may contain `<rootDir>` placeholders.
 *                   Can include both positive patterns (e.g., `<rootDir>/src/**`) and
 *                   negative patterns (e.g., `!<rootDir>/node_modules/**`).
 *
 * @param rootDir - The absolute path to the root directory that will replace `<rootDir>` placeholders.
 *                  Should be an absolute path to ensure proper resolution.
 *
 * @returns Array of resolved glob patterns with absolute paths. Negative patterns retain their
 *          `!` prefix, while positive patterns are converted to absolute paths.
 *
 * @example
 * ```typescript
 * const patterns = [
 *   '<rootDir>/src/**',
 *   '!<rootDir>/node_modules/**',
 *   '<rootDir>/tests/**\/\*.test.ts',
 *   '!<rootDir>/dist/**'
 * ];
 * const rootDir = '/home/user/my-project';
 * 
 * const resolved = resolveRootDirPatternToGlobPattern(patterns, rootDir);
 * // Returns:
 * // [
 * //   '/home/user/my-project/src',
 * //   '!/home/user/my-project/node_modules',
 * //   '/home/user/my-project/tests/*.test.ts',
 * //   '!/home/user/my-project/dist'
 * // ]
 * 
 * // Windows paths are normalized
 * const windowsPatterns = ['<rootDir>\\\\src\\\\**'];
 * const windowsRoot = 'C:\\\\Users\\\\user\\\\project';
 * const windowsResolved = resolveRootDirPatternToGlobPattern(windowsPatterns, windowsRoot);
 * // Returns: ['C:/Users/user/project/src']
 * ```
 *
 * @since 1.0.0
 */
export function resolveRootDirPatternToGlobPattern(patterns: string[], rootDir: string): string[] {
    return patterns.map(pattern => {
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
    });
}

export function createGlobToJavascriptRelatedDependency(dependency: string): string {
    let dependencyGlob: string = dependency;
    try {
        const stat = fs.statSync(dependencyGlob);
        dependencyGlob = stat.isDirectory() ? `${dependencyGlob}/index**` : `${dependencyGlob}**`;
    } catch (error) {
        dependencyGlob = `${dependencyGlob}**`;
    }
    return dependencyGlob;
}