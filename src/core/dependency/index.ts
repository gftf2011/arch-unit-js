import fs from 'fs';
import path from 'path';
import {
    isBuiltinModule,
    isPackageJsonDependency,
    isPackageJsonDevDependency,
    isTypescriptAtPathDependency,
    resolveIfTypescriptAtPathDependency
} from '../../utils';

export type JavascriptOrTypescriptRelatedDependencyType = 'node-builtin-module' | 'node-package' | 'node-dev-package' | 'valid-path' | 'invalid';
export type JavascriptOrTypescriptRelatedDependencyResolvedWith = 'require' | 'import';
export type JavascriptOrTypescriptRelatedDependencyComesFrom = 'javascript-or-typescript';

export type DependencyType = JavascriptOrTypescriptRelatedDependencyType;
export type DependencyResolvedWith = JavascriptOrTypescriptRelatedDependencyResolvedWith;
export type NodeDependencyComesFrom = JavascriptOrTypescriptRelatedDependencyComesFrom;

export abstract class Dependency {
    protected constructor (
        readonly name: string,
        readonly fullName: string,
        readonly type: DependencyType,
        readonly resolvedWith: DependencyResolvedWith,
        readonly comesFrom: NodeDependencyComesFrom
    ) {}
}

class JavascriptOrTypescriptRelatedDependency extends Dependency {
    private constructor(
        readonly name: string,
        readonly fullName: string,
        readonly type: JavascriptOrTypescriptRelatedDependencyType,
        readonly resolvedWith: JavascriptOrTypescriptRelatedDependencyResolvedWith,
        readonly comesFrom: JavascriptOrTypescriptRelatedDependencyComesFrom
    ) {
        super(name, fullName, type, resolvedWith, comesFrom);
    }

    public static create(
        rootDir: string,
        currentPath: string,
        dependency: string,
        extensions: string[],
        resolvedWith: JavascriptOrTypescriptRelatedDependencyResolvedWith,
        comesFrom: JavascriptOrTypescriptRelatedDependencyComesFrom
    ): JavascriptOrTypescriptRelatedDependency {
        if (isBuiltinModule(dependency)) return new JavascriptOrTypescriptRelatedDependency(dependency, dependency, 'node-builtin-module', resolvedWith, comesFrom);
        if (isPackageJsonDependency(rootDir, dependency)) return new JavascriptOrTypescriptRelatedDependency(dependency, dependency, 'node-package', resolvedWith, comesFrom);
        if (isPackageJsonDevDependency(rootDir, dependency)) return new JavascriptOrTypescriptRelatedDependency(dependency, dependency, 'node-dev-package', resolvedWith, comesFrom);
    
        const fullPath = (rootDir: string, currentPath: string, dependency: string) => {
            if (isTypescriptAtPathDependency(dependency)) {
                return resolveIfTypescriptAtPathDependency(rootDir, dependency);
            } else {
                return path.resolve(currentPath, dependency);
            }
        };
    
        const resolvedPathForCandidates = fullPath(rootDir, currentPath, dependency);
    
        const candidates = [
            resolvedPathForCandidates,
            ...extensions.map(ext => `${resolvedPathForCandidates}${ext}`),
            ...extensions.map(ext => path.join(resolvedPathForCandidates, `index${ext}`)),
        ];
    
        for (const candidate of candidates) {
            try {
                const stat = fs.statSync(candidate);
                if (stat.isFile()) return new JavascriptOrTypescriptRelatedDependency(path.relative(rootDir, candidate), candidate, 'valid-path', resolvedWith, comesFrom);
            } catch {
                // do nothing
            }
        }
    
        return new JavascriptOrTypescriptRelatedDependency(dependency, dependency, 'invalid', resolvedWith, comesFrom);
    }
}

export class DependencyFactory {
    public static create(
        rootDir: string,
        currentPath: string,
        dependency: string,
        extensions: string[],
        resolvedWith: DependencyResolvedWith,
        comesFrom: NodeDependencyComesFrom
    ): Dependency {
        if (comesFrom === 'javascript-or-typescript') {
            return JavascriptOrTypescriptRelatedDependency.create(rootDir, currentPath, dependency, extensions, resolvedWith, comesFrom);
        }
        throw new Error(`Unsupported dependency type: ${dependency}`);
    }
}