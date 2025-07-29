import micromatch from "micromatch";
import { Checkable, File, CheckableProps } from "../../common/fluent-api";

export class BeImportedOrRequiredBySelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override async checkRule(filteredFiles: Map<string, File>): Promise<boolean> {
        const filteredImports = new Map<string, File>();
    
        for (const [path, file] of filteredFiles) {
            if (micromatch(file.dependencies.map(d => d.name), this.props.checkingPatterns).length > 0) {
                filteredImports.set(path, file);
            }
        }
        return this.props.negated ? filteredImports.size === 0 : filteredImports.size > 0;
    }
}

export class OnlyDependsOnSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override async checkRule(filteredFiles: Map<string, File>): Promise<boolean> {
        const filesFound = new Map<string, File>();
        let allEmptyDependencies = true;

        for (const [path, file] of filteredFiles) {
            const matchingDependencies = file.dependencies.filter(dep => micromatch([dep.name], this.props.checkingPatterns).length === 1);

            if (matchingDependencies.length === file.dependencies.length) {
                if (matchingDependencies.length !== 0) {
                    allEmptyDependencies = false;
                }
                filesFound.set(path, file);
            }
        }

        if (this.props.negated) {
            if (allEmptyDependencies) {
                return true;
            }
            return filesFound.size === filteredFiles.size ? false : true;
        } else {
            return filesFound.size === filteredFiles.size ? true : false;
        }
    }
}

export class DependsOnSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override async checkRule(filteredFiles: Map<string, File>): Promise<boolean> {
        
    }
}

export class OnlyHaveNameSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override validateFilesDependencies(_files: Map<string, File>): void {
        return;
    }

    protected override validateIfAllDependenciesExistInProjectGraph(_files: Map<string, File>): void {
        return;
    }

    protected override async checkRule(filteredFiles: Map<string, File>): Promise<boolean> {
        const filesFound = new Map<string, File>();
        
        for (const [path, file] of filteredFiles) {
            if (micromatch([file.name], this.props.checkingPatterns).length === 1) {
                filesFound.set(path, file);
            }
        }

        if (this.props.negated) {
            return filesFound.size === filteredFiles.size ? false : true;
        } else {
            return filesFound.size === filteredFiles.size ? true : false;
        }
    }
}

export class HaveNameSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override validateFilesDependencies(_files: Map<string, File>): void {
        return;
    }

    protected override validateIfAllDependenciesExistInProjectGraph(_files: Map<string, File>): void {
        return;
    }

    protected override async checkRule(filteredFiles: Map<string, File>): Promise<boolean> {
        const filesFound = new Map<string, File>();
        
        for (const [path, file] of filteredFiles) {
            if (micromatch([file.name], this.props.checkingPatterns).length === 1) {
                filesFound.set(path, file);
            }
        }

        if (this.props.negated) {
            return filesFound.size > 0 ? false : true;
        } else {
            return filesFound.size > 0 ? true : false;
        }
    }
}