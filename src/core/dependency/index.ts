import * as path from 'pathe';
import { nodejs, glob } from '../../utils';
import micromatch from 'micromatch';
import {
    DependencyType,
    DependencyResolvedWith,
    NodeDependencyComesFrom,
    JavascriptRelatedDependencyType,
    JavascriptRelatedDependencyResolvedWith,
    JavascriptRelatedDependencyComesFrom
} from '../common/types';

export abstract class Dependency {
    protected constructor (
        readonly name: string,
        readonly type: DependencyType,
        readonly resolvedWith: DependencyResolvedWith,
        readonly comesFrom: NodeDependencyComesFrom
    ) {}
}

class JavascriptRelatedDependency extends Dependency {
    private constructor(
        readonly name: string,
        readonly type: JavascriptRelatedDependencyType,
        readonly resolvedWith: JavascriptRelatedDependencyResolvedWith,
        readonly comesFrom: JavascriptRelatedDependencyComesFrom
    ) {
        super(name, type, resolvedWith, comesFrom);
    }

    public static create(
        rootDir: string,
        currentDirPath: string,
        dependency: string,
        availableFiles: string[],
        resolvedWith: JavascriptRelatedDependencyResolvedWith,
        comesFrom: JavascriptRelatedDependencyComesFrom
    ): JavascriptRelatedDependency {
        if (nodejs.isBuiltinModule(dependency)) return new JavascriptRelatedDependency(dependency, 'node-builtin-module', resolvedWith, comesFrom);
        if (nodejs.isPackageJsonDependency(rootDir, dependency)) return new JavascriptRelatedDependency(dependency, 'node-package', resolvedWith, comesFrom);
        if (nodejs.isPackageJsonDevDependency(rootDir, dependency)) return new JavascriptRelatedDependency(dependency, 'node-dev-package', resolvedWith, comesFrom);
    
        const dependencyResolvedPath = path.resolve(currentDirPath, dependency);
        const resolvedDependencyGlobPattern: string = glob.createGlobToJavascriptRelatedDependency(dependencyResolvedPath);

        const resolvedDependency = micromatch([...availableFiles], [resolvedDependencyGlobPattern])[0];

        return resolvedDependency
            ? new JavascriptRelatedDependency(resolvedDependency, 'valid-path', resolvedWith, comesFrom)
            : new JavascriptRelatedDependency(dependency, 'invalid', resolvedWith, comesFrom);
    }
}

export class DependencyFactory {
    public static create(
        rootDir: string,
        currentPath: string,
        dependency: string,
        availableFiles: string[],
        resolvedWith: DependencyResolvedWith,
        comesFrom: NodeDependencyComesFrom
    ): Dependency {
        if (comesFrom === 'javascript') {
            return JavascriptRelatedDependency.create(
                rootDir,
                currentPath,
                dependency,
                availableFiles,
                resolvedWith,
                comesFrom
            );
        }
        throw new Error(`Unsupported dependency type: ${dependency}`);
    }
}