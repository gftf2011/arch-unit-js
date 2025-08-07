import * as path from 'pathe';
import { nodejs, glob } from "../../../utils";
import micromatch from 'micromatch';
import { Dependency, DependencyProps } from "../common";

export class JavascriptRelatedDependency extends Dependency {
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