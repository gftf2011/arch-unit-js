import * as path from 'pathe';
import { nodejs, glob } from '../../utils';
import micromatch from 'micromatch';
import {
    DependencyType,
    DependencyResolvedWith,
    NodeDependencyComesFrom,
} from '../common/types';

export type DependencyProps = {
    name: string;
    type: DependencyType;
    resolvedWith: DependencyResolvedWith;
    comesFrom: NodeDependencyComesFrom;
}

export abstract class Dependency {
    protected constructor (public readonly props: DependencyProps) {}

    public abstract resolve(rootDir: string, fileDir: string, availableFiles: string[]): void;
}

class JavascriptRelatedDependency extends Dependency {
    private constructor(public props: DependencyProps) {
        super(props);
    }
    public static create(props: Omit<DependencyProps, 'type'>): JavascriptRelatedDependency {
        return new JavascriptRelatedDependency({
            ...props,
            type: 'unknown'
        });
    }

    public override resolve(
        rootDir: string,
        fileDir: string,
        availableFiles: string[]
    ): void {
        if (nodejs.isBuiltinModule(this.props.name)) {
            this.props.type = 'node-builtin-module';
            return;
        }
        if (nodejs.isPackageJsonDependency(rootDir, this.props.name)) {
            this.props.type = 'node-package';
            return;
        }
        if (nodejs.isPackageJsonDevDependency(rootDir, this.props.name)) {
            this.props.type = 'node-dev-package';
            return;
        }

        const dependencyResolvedPath = path.resolve(fileDir, this.props.name);
        const resolvedDependencyGlobPattern: string = glob.createGlobToJavascriptRelatedDependency(dependencyResolvedPath);
        const resolvedDependency = micromatch([...availableFiles], [resolvedDependencyGlobPattern])[0];

        if (resolvedDependency) {
            this.props.name = resolvedDependency;
            this.props.type = 'valid-path';
        } else {
            this.props.type = 'invalid';
        }
    }
}

export class DependencyFactory {
    public static create(
        rootDir: string,
        currentPath: string,
        name: string,
        availableFiles: string[],
        resolvedWith: DependencyResolvedWith,
        comesFrom: NodeDependencyComesFrom
    ): Dependency {
        if (comesFrom === 'javascript') {
            const dependency = JavascriptRelatedDependency.create({
                name,
                resolvedWith,
                comesFrom
            });
            dependency.resolve(rootDir, currentPath, availableFiles);
            return dependency;
        }
        throw new Error(`Unsupported dependency type: ${name}`);
    }
}