import path from 'path';

/**
 * Extracts the file extension from a glob pattern or file path.
 * 
 * This function analyzes a pattern string and extracts the file extension
 * from the end of the pattern. It's designed to work with both glob patterns
 * (like "\*\*\/\*.ts" or "src/\*\*\/\*.js") and regular file paths (like "file.txt").
 * 
 * The function uses a regex pattern that matches:
 * - A literal dot (.)
 * - Followed by one or more characters that are not dots, backslashes, forward slashes,
 *   colons, asterisks, question marks, quotes, angle brackets, pipes, or newlines
 * - At the end of the string ($)
 * 
 * @param pattern - The glob pattern or file path to extract the extension from.
 *                  Examples: "\*\*\/\*.ts", "src/\*\*\/\*.js", "file.txt", "\*.{ts,js}"
 * 
 * @returns The file extension including the dot (e.g., ".ts", ".js", ".txt") if found,
 *          or null if no valid extension is detected at the end of the pattern.
 * 
 * @example
 * ```typescript
 * extractExtensionFromGlobPattern("\*\*\/\*.ts")     // Returns ".ts"
 * extractExtensionFromGlobPattern("src/\*\*\/\*.js") // Returns ".js"
 * extractExtensionFromGlobPattern("file.txt")        // Returns ".txt"
 * extractExtensionFromGlobPattern("*.{ts,js}")       // Returns ".js" (matches last extension)
 * extractExtensionFromGlobPattern("no-extension")    // Returns null
 * extractExtensionFromGlobPattern("folder/")         // Returns null
 * ```
 * 
 * @since 1.0.0
 */
export function extractExtensionFromGlobPattern(pattern: string): string | null {
    const match = pattern.match(/\.[^.\\/:*?"<>|\r\n]+$/);
    return match ? match[0] : null;
}

/**
 * Normalizes Windows file paths to POSIX-style paths by replacing backslashes with forward slashes.
 *
 * This utility is useful for ensuring consistent path handling across different operating systems,
 * especially when working with glob patterns, file system operations, or tools that expect POSIX-style paths.
 *
 * On Windows, file paths use backslashes (e.g., 'C:\\Users\\user\\project'), while POSIX systems (Linux, macOS)
 * use forward slashes (e.g., '/home/user/project'). This function converts all backslashes in the input path
 * to forward slashes, making the path compatible with POSIX expectations.
 *
 * Note: This function does not modify forward slashes or resolve relative/absolute paths; it only replaces
 * backslashes with forward slashes.
 *
 * @param path - The file path string to normalize. Can be absolute or relative, and may contain backslashes.
 *
 * @returns The normalized path string with all backslashes replaced by forward slashes.
 *
 * @example
 * ```typescript
 * normalizeWindowsPath('C:\\Users\\user\\project')    // Returns 'C:/Users/user/project'
 * normalizeWindowsPath('folder\\subfolder\\file.txt') // Returns 'folder/subfolder/file.txt'
 * normalizeWindowsPath('/already/posix/path')         // Returns '/already/posix/path'
 * ```
 *
 * @since 1.0.0
 */
function normalizeWindowsPath(path: string): string {
    return path.replace(/\\/g, '/');
}

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
    const normalizedRootDir = normalizeWindowsPath(rootDir);
    return patterns.map(pattern => {
        if (pattern.startsWith('!')) {
            const cleaned = pattern.replace('<rootDir>', '').replace(/^!/, '');
            const relative = cleaned.replace(/^\.?\//, '').replace(/\\/g, '/');
            const newPattern = `!${path.resolve(normalizedRootDir, relative)}`;
            return newPattern;
        }
        const cleaned = pattern.replace('<rootDir>', '');
        const relative = cleaned.replace(/^\.?\//, '').replace(/\\/g, '/');
        const newPattern = path.resolve(normalizedRootDir, relative);
        return newPattern;
    });
}