import fs from 'fs';
import path from 'path';
import {
    isBuiltinModule,
    isPackageJsonDependency,
    isPackageJsonDevDependency,
    isTypescriptAtPathDependency,
    resolveIfTypescriptAtPathDependency
} from '../../utils';

export class Dependency {
    private constructor(
        readonly name: string,
        readonly fullName: string,
        readonly type: 'node-builtin-module' | 'node-package' | 'node-dev-package' | 'valid-path' | 'invalid',
        readonly resolvedWith: 'require' | 'import'
    ) {}
    
    public static create(
        rootDir: string,
        currentPath: string,
        dependency: string,
        extensions: string[],
        resolvedWith: 'require' | 'import'
    ): Dependency {
        if (isBuiltinModule(dependency)) return new Dependency(dependency, dependency, 'node-builtin-module', resolvedWith);
    
        if (isPackageJsonDependency(rootDir, dependency)) return new Dependency(dependency, dependency, 'node-package', resolvedWith);
    
        if (isPackageJsonDevDependency(rootDir, dependency)) return new Dependency(dependency, dependency, 'node-dev-package', resolvedWith);
    
        const fullPath = (rootDir: string, currentPath: string, dependency: string) => {
            if (isTypescriptAtPathDependency(dependency)) {
                return resolveIfTypescriptAtPathDependency(rootDir, dependency);
            } else {
                return path.resolve(currentPath, dependency);
            }
        };
    
        const resolvedPathForCandidates = fullPath(rootDir, currentPath, dependency);
    
        const candidates = [
            ...extensions.map(ext => `${resolvedPathForCandidates}${ext}`),
            ...extensions.map(ext => path.join(resolvedPathForCandidates, `index${ext}`)),
        ];
    
        for (const candidate of candidates) {
            try {
                const stat = fs.statSync(candidate);
                if (stat.isFile()) return new Dependency(path.relative(rootDir, candidate), candidate, 'valid-path', resolvedWith);
            } catch {
                // do nothing
            }
        }
    
        return new Dependency(dependency, dependency, 'invalid', resolvedWith);
    }
}