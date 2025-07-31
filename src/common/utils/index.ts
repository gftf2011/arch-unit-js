import fs from 'fs';
import path from 'path';
import module from 'module';

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
export function normalizeWindowsPath(path: string): string {
    return path.replace(/\\/g, '/');
}

/**
 * Resolves root directory patterns to absolute glob patterns by processing pattern tokens and normalizing paths.
 *
 * This function takes an array of pattern strings that may contain special tokens and path prefixes,
 * and converts them into absolute file system paths suitable for glob matching. It's designed to handle
 * various pattern formats commonly used in build tools and file matching systems.
 *
 * The function performs the following transformations on each pattern:
 * 1. Replaces '<rootDir>' tokens with an empty string (to be resolved against the actual rootDir)
 * 2. Normalizes relative path indicators ('./', '.', leading '/')
 * 3. Converts Windows-style backslashes to forward slashes
 * 4. Resolves the cleaned pattern against the provided rootDir to create absolute paths
 *
 * This is particularly useful for configuration systems that need to convert relative or tokenized
 * patterns into absolute paths for file system operations, glob matching, or build processes.
 *
 * @param patterns - An array of pattern strings to resolve. Each pattern may contain:
 *                   - '<rootDir>' tokens that will be resolved against the rootDir parameter
 *                   - Relative path indicators like './', '.', or leading '/'
 *                   - Windows or POSIX path separators
 *                   Examples: ['<rootDir>/src', './utils', 'components']
 *
 * @param rootDir - The root directory path to resolve patterns against. This should be an absolute
 *                  path that will serve as the base for resolving all relative patterns.
 *                  Example: '/Users/user/project' or 'C:\\Users\\user\\project'
 *
 * @returns An array of absolute file system paths corresponding to the input patterns.
 *          All paths are normalized to use forward slashes and resolved against the rootDir.
 *
 * @example
 * ```typescript
 * const patterns = ['<rootDir>/src', './utils', 'components'];
 * const rootDir = '/Users/user/project';
 * const resolved = resolveRootDirPatternToGlobPattern(patterns, rootDir);
 * // Returns: [
 * //   '/Users/user/project/src',
 * //   '/Users/user/project/utils',
 * //   '/Users/user/project/components'
 * // ]
 *
 * // Windows paths are also supported
 * const windowsPatterns = ['<rootDir>\\src', 'domain\\', '.\\utils'];
 * const windowsRootDir = 'C:\\Users\\user\\project';
 * const windowsResolved = resolveRootDirPatternToGlobPattern(windowsPatterns, windowsRootDir);
 * // Returns: [
 * //   'C:/Users/user/project/src',
 * //   'C:/Users/user/project/domain',
 * //   'C:/Users/user/project/utils'
 * // ]
 * ```
 *
 * @since 1.0.0
 */
export function resolveRootDirPatternToGlobPattern(patterns: string[], rootDir: string): string[] {
    const normalizedRootDir = normalizeWindowsPath(rootDir);
    return patterns.map(pattern => {
        const cleaned = pattern.replace('<rootDir>', '');
        const relative = cleaned.replace(/^\/?\.?/, '').replace(/\\/g, '/');
        return path.resolve(normalizedRootDir, relative);
    });
}

export function isBuiltinModule(dependency: string): boolean {
    const builtinModules = new Set(module.builtinModules);
    return builtinModules.has(dependency);
}

export function isPackageJsonDependency(rootDir: string, dependency: string): boolean {
    try {
        const packageJsonPath = path.join(rootDir, 'package.json');
        fs.statSync(packageJsonPath);
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        return Object.keys(packageJson.dependencies).includes(dependency);
    } catch (error) {
        return false;
    }
}

export function isPackageJsonDevDependency(rootDir: string, dependency: string): boolean {
    try {
        const packageJsonPath = path.join(rootDir, 'package.json');
        fs.statSync(packageJsonPath);
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        return Object.keys(packageJson.devDependencies).includes(dependency);
    } catch (error) {
        return false;
    }
}

export function isTypescriptAtPathDependency(dependency: string): boolean {
    return dependency.startsWith('@');
}

export function resolveIfTypescriptAtPathDependency(rootDir: string, dependency: string): string {
    try {
        const typescriptPath = path.join(rootDir, 'tsconfig.json');
        fs.statSync(typescriptPath);
        const typescriptFileContent = JSON.parse(fs.readFileSync(typescriptPath, 'utf8'));
        const resolvedPath = path.resolve(rootDir, typescriptFileContent.compilerOptions.baseUrl, dependency.replace(/^@\/?|^@/, ''));
        return resolvedPath;
    } catch (error) {
        return dependency;
    }
}