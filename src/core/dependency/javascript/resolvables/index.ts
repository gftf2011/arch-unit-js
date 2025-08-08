import fs from 'fs';
import * as path from 'pathe';
import * as tsConfigPaths from 'tsconfig-paths';
import {
    DependencyProps,
    Resolvable,
    ResolvableDependencyProps,
    ResolvableResponse
} from "../../common";
import { nodejs, glob, javascript } from "../../../../utils";
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

export class TypescriptPathDependencyResolvable extends Resolvable {
    constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
        super(depProps, resolvableProps);
    }
    public override resolve(): ResolvableResponse {
        try {
            const stat = fs.statSync(this.resolvableProps.typescriptPath as string);
            if (stat.isFile()) {
                const tsconfigPaths = tsConfigPaths.loadConfig(this.resolvableProps.typescriptPath as string);
                if (tsconfigPaths.resultType === 'success') {
                    const { absoluteBaseUrl, paths } = tsconfigPaths;

                    const matchPath = tsConfigPaths.createMatchPath(
                        absoluteBaseUrl,  // baseUrl from tsconfig
                        paths             // paths from tsconfig
                    );

                    const resolvedMatchPath = matchPath(
                        this.depProps.name,
                        undefined,
                        undefined,
                        this.resolvableProps.extensions
                    );

                    if (resolvedMatchPath) {
                        const dependencyCandidates = javascript.generateDependenciesCandidates(resolvedMatchPath, this.resolvableProps.extensions);
                        const dependencyCandidateIfExists = javascript.getDependencyCandidateIfExists(dependencyCandidates);

                        if (dependencyCandidateIfExists) {
                            const dependency = micromatch(this.resolvableProps.availableFiles, [dependencyCandidateIfExists])[0];
                            if (dependency) {
                                this.depProps.type = 'valid-path';
                                this.depProps.name = dependency;
                                return { status: 'resolved', depProps: { ...this.depProps } };
                            }
                        }
                    }
                }
            }
            return { status: 'unresolved', depProps: { ...this.depProps } };
        } catch (error) {
            return { status: 'unresolved', depProps: { ...this.depProps } };
        }
    }
}

export class ValidPathDependencyResolvable extends Resolvable {
    constructor(depProps: DependencyProps, resolvableProps: ResolvableDependencyProps) {
        super(depProps, resolvableProps);
    }
    public override resolve(): ResolvableResponse {
        const dependencyResolvedPath = path.resolve(this.resolvableProps.fileDir, this.depProps.name);
        const dependencyCandidates = javascript.generateDependenciesCandidates(dependencyResolvedPath, this.resolvableProps.extensions);
        const dependencyCandidateIfExists = javascript.getDependencyCandidateIfExists(dependencyCandidates);

        if (dependencyCandidateIfExists) {
            const dependency = micromatch(this.resolvableProps.availableFiles, [dependencyCandidateIfExists])[0];
            if (dependency) {
                this.depProps.type = 'valid-path';
                this.depProps.name = dependency;
                return { status: 'resolved', depProps: { ...this.depProps } };
            }
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
