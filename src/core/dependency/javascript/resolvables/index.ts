import * as path from 'pathe';
import { DependencyProps, ResolvableDependencyProps, ResolvableResponse } from "../../common";
import { nodejs, glob } from "../../../../utils";
import micromatch from 'micromatch';

export abstract class Resolvable {
    constructor(public depProps: DependencyProps, public resolvableProps: ResolvableDependencyProps) {}
    abstract resolve(): ResolvableResponse;
}

export class BuildinModuleResolvable extends Resolvable {
    constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
        super(depProps, resolvableProps);
    }
    public override resolve(): ResolvableResponse {
        if (nodejs.isBuiltinModule(this.depProps.name)) {
            this.depProps.type = 'node-builtin-module';
            return { status: 'resolved', depProps: { ...this.depProps } };
        }
        return { status: 'unresolved', depProps: this.depProps };
    }
}

export class PackageJsonDependencyResolvable extends Resolvable {
    constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
        super(depProps, resolvableProps);
    }
    public override resolve(): ResolvableResponse {
        if (nodejs.isPackageJsonDependency(this.resolvableProps.rootDir, this.depProps.name)) {
            this.depProps.type = 'node-package';
            return { status: 'resolved', depProps: { ...this.depProps } };
        }
        return { status: 'unresolved', depProps: this.depProps };
    }
}

export class PackageJsonDevDependencyResolvable extends Resolvable {
    constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
        super(depProps, resolvableProps);
    }
    public override resolve(): ResolvableResponse {
        if (nodejs.isPackageJsonDevDependency(this.resolvableProps.rootDir, this.depProps.name)) {
            this.depProps.type = 'node-dev-package';
            return { status: 'resolved', depProps: { ...this.depProps } };
        }
        return { status: 'unresolved', depProps: this.depProps };
    }
}

export class ValidPathDependencyResolvable extends Resolvable {
    constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
        super(depProps, resolvableProps);
    }
    public override resolve(): ResolvableResponse {
        const dependencyResolvedPath = path.resolve(this.resolvableProps.fileDir, this.depProps.name);
        const resolvedDependencyGlobPattern: string = glob.createGlobToJavascriptRelatedDependency(dependencyResolvedPath);
        const resolvedDependency = micromatch([...this.resolvableProps.availableFiles], [resolvedDependencyGlobPattern])[0];

        if (resolvedDependency) {
            this.depProps.type = 'valid-path';
            this.depProps.name = resolvedDependency;
            return { status: 'resolved', depProps: { ...this.depProps } };
        }
        return { status: 'unresolved', depProps: this.depProps };
    }
}

export class InvalidDependencyResolvable extends Resolvable {
    constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
        super(depProps, resolvableProps);
    }
    public override resolve(): ResolvableResponse {
        this.depProps.type = 'invalid';
        return { status: 'resolved', depProps: { ...this.depProps } };
    }
}

export interface Iterator<T> {
    add(item: T): void;
    get(): T | null;
    next(): T | null;
    previous(): T | null;
    resolved(): boolean;
}

export class ResolvableIterator implements Iterator<Resolvable> {
    private index: number = 0;
    private resolvables: Resolvable[] = [];

    public add(item: Resolvable): void {
        this.resolvables.push(item);
    }

    public get(): Resolvable | null {
        return this.resolvables[this.index];
    }

    public next(): Resolvable | null {
        if (this.index < this.resolvables.length) {
            return this.resolvables[this.index++];
        }
        return null;
    }

    public previous(): Resolvable | null {
        if (this.index > 0) {
            return this.resolvables[--this.index];
        }
        return null;
    }

    public resolved(): boolean {
        return this.resolvables[this.index].resolve().status === 'resolved';
    }
}