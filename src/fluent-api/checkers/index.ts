import micromatch from "micromatch";
import { Checkable, File, CheckableProps } from "../../common/fluent-api";

export class ProjectFilesInDirectoryOnlyDependsOnShouldSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override async checkPositiveRule(filteredFiles: Map<string, File>): Promise<boolean> {
        for (const [_, file] of filteredFiles) {
            if (file.dependencies.length === 0) continue; // No dependencies is OK
            
            const matchingDeps = file.dependencies.filter(dep => 
                micromatch([dep.name], this.props.checkingPatterns).length > 0
            );
            
            // All dependencies must match patterns (exclusive match)
            // Files can depend exclusively on ANY subset of the specified patterns
            if (matchingDeps.length !== file.dependencies.length) return false;
        }
        return true;
    }

    protected override async checkNegativeRule(filteredFiles: Map<string, File>): Promise<boolean> {
        // shouldNot.onlyDependsOn passes when files do NOT exclusively depend only on specified patterns
        
        for (const [_, file] of filteredFiles) {
            // Files with no dependencies always pass (cannot violate exclusive dependency)
            if (file.dependencies.length === 0) continue;
            
            const matchingDeps = file.dependencies.filter(dep => 
                micromatch([dep.name], this.props.checkingPatterns).length > 0
            );
            
            // If any file has additional non-matching dependencies, the rule passes
            if (matchingDeps.length < file.dependencies.length) {
                return true; // Pass - file has mixed dependencies
            }
        }
        
        // If we reach here, all files with dependencies exclusively depend on matching patterns
        // Now check if any file exclusively depends on the patterns (either ALL or SOME)
        for (const [_, file] of filteredFiles) {
            if (file.dependencies.length === 0) continue;
            
            const matchingDeps = file.dependencies.filter(dep => 
                micromatch([dep.name], this.props.checkingPatterns).length > 0
            );
            
            // If file has only matching dependencies, it's exclusively depending on patterns
            if (matchingDeps.length === file.dependencies.length && file.dependencies.length > 0) {
                return false; // Fail - found exclusive dependency
            }
        }
        
        // If no files have exclusive dependencies, the rule passes
        return true;
    }
}

export class DependsOnSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override async checkPositiveRule(filteredFiles: Map<string, File>): Promise<boolean> {
        return true;
    }

    protected override async checkNegativeRule(filteredFiles: Map<string, File>): Promise<boolean> {
        return false;
    }
}

export class ProjectFilesInDirectoryOnlyHaveNameShouldSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override validateFilesDependencies(_files: Map<string, File>): void {
        return;
    }

    protected override validateIfAllDependenciesExistInProjectGraph(_files: Map<string, File>): void {
        return;
    }

    protected override async checkNegativeRule(filteredFiles: Map<string, File>): Promise<boolean> {
        return false;
    }

    protected override async checkPositiveRule(filteredFiles: Map<string, File>): Promise<boolean> {
        return true;
    }
}

export class ProjectFilesInDirectoryHaveNameShouldSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override validateFilesDependencies(_files: Map<string, File>): void {
        return;
    }

    protected override validateIfAllDependenciesExistInProjectGraph(_files: Map<string, File>): void {
        return;
    }

    protected override async checkPositiveRule(filteredFiles: Map<string, File>): Promise<boolean> {
        return true;
    }

    protected override async checkNegativeRule(filteredFiles: Map<string, File>): Promise<boolean> {
        return false;
    }
}