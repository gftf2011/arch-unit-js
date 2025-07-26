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

export function resolveRootDirPattern(patterns: string[], rootDir: string): string[] {
    const normalizedRootDir = normalizeWindowsPath(rootDir);
    return patterns.map(pattern => {
        const cleaned = pattern.replace(/^\^/, '').replace('<rootDir>', '');
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

export function isTypescriptAtPathDependency(rootDir: string, dependency: string): boolean {
    try {
        if (!dependency.startsWith('@')) {
            return false;
        }
        const typescriptPath = path.join(rootDir, 'tsconfig.json');
        fs.statSync(typescriptPath);
        const { baseUrl } = JSON.parse(fs.readFileSync(typescriptPath, 'utf8'));
        const resolvedPath = path.resolve(rootDir, baseUrl, dependency.replace('@', ''));
        fs.statSync(resolvedPath);
        return true;
    } catch (error) {
        return false;
    }
}

export function resolveIfTypescriptAtPathDependency(rootDir: string, dependency: string): string {
    try {
        const typescriptPath = path.join(rootDir, 'tsconfig.json');
        fs.statSync(typescriptPath);
        const { baseUrl } = JSON.parse(fs.readFileSync(typescriptPath, 'utf8'));
        const resolvedPath = path.resolve(rootDir, baseUrl, dependency.replace('@', ''));
        return resolvedPath;
    } catch (error) {
        return dependency;
    }
}