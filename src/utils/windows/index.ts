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
export function normalizeWindowsPath(path: string): string {
    return path.replace(/\\/g, '/');
}