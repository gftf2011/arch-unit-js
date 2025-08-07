import * as path from 'pathe';
import {
    DependencyProps,
    Resolvable,
    ResolvableDependencyProps,
    ResolvableResponse
} from "../../common";
import { nodejs, glob } from "../../../../utils";
import micromatch from 'micromatch';

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
