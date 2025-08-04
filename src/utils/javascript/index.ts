import fs from 'fs';
import path from 'path';

export function isTypescriptAtPathDependency(dependency: string): boolean {
    return dependency.startsWith('@');
}

export function resolveIfTypescriptAtPathDependency(rootDir: string, dependency: string): string {
    try {
        const typescriptPath = path.posix.join(rootDir, 'tsconfig.json');
        fs.statSync(typescriptPath);
        const typescriptFileContent = JSON.parse(fs.readFileSync(typescriptPath, 'utf8'));
        const resolvedPath = path.posix.resolve(rootDir, typescriptFileContent.compilerOptions.baseUrl, dependency.replace(/^@\/?|^@/, ''));
        return resolvedPath;
    } catch (error) {
        return dependency;
    }
}

export function isTypeScriptRelatedFile(fileName: string): boolean {
    const extensions = ['.ts', '.mts', '.cts', '.d.ts', '.tsx'];
    return extensions.some(ext => fileName.endsWith(ext));
}

export function isJavascriptRelatedFile(fileName: string): boolean {
    const extensions = ['.js', '.mjs', '.cjs', 'jsx'];
    return extensions.some(ext => fileName.endsWith(ext));
}
