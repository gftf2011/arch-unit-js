import fs from 'fs';
import path from 'path';
import module from 'module';

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