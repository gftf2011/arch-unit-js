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

export class ProjectFilesInDirectoryDependsOnShouldSelector extends Checkable {
    constructor(protected readonly props: CheckableProps) {
        super(props);
    }

    protected override async checkPositiveRule(filteredFiles: Map<string, File>): Promise<boolean> {
        for (const [_, file] of filteredFiles) {
            // Files with no dependencies fail the rule (cannot satisfy ALL patterns requirement)
            if (file.dependencies.length === 0) return false;
            
            // Check if ALL specified patterns are present in this file's dependencies
            for (const pattern of this.props.checkingPatterns) {
                const hasPattern = file.dependencies.some(dep => 
                    micromatch([dep.name], [pattern]).length > 0
                );
                
                // If any pattern is missing, the rule fails
                if (!hasPattern) return false;
            }
        }
        
        // All files have ALL required patterns
        return true;
    }

    protected override async checkNegativeRule(filteredFiles: Map<string, File>): Promise<boolean> {
        for (const [_, file] of filteredFiles) {
            // Files with no dependencies pass the rule (no forbidden patterns can be present)
            if (file.dependencies.length === 0) continue;
            
            // Check if ANY of the specified patterns are present in this file's dependencies
            for (const dependency of file.dependencies) {
                const hasAnyPattern = this.props.checkingPatterns.some(pattern => 
                    micromatch([dependency.name], [pattern]).length > 0
                );
                
                // If any forbidden pattern is found, the rule fails
                if (hasAnyPattern) return false;
            }
        }
        
        // No files have any forbidden patterns
        return true;
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
        // If no files are found, the rule passes (no exclusive naming possible)
        if (filteredFiles.size === 0) return true;
        
        let matchingFiles = 0;
        let totalFiles = filteredFiles.size;
        
        for (const [_, file] of filteredFiles) {
            const fileName = file.name;
            
            // Check if this file name matches the pattern
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            
            if (matches) {
                matchingFiles++;
            }
        }
        
        // Rule fails only when ALL files match the pattern (exclusive naming)
        // Rule passes when NONE match or when SOME match (mixed naming)
        return matchingFiles !== totalFiles;
    }

    protected override async checkPositiveRule(filteredFiles: Map<string, File>): Promise<boolean> {
        // If no files are found, the rule passes (vacuous truth)
        if (filteredFiles.size === 0) return true;
        
        for (const [_, file] of filteredFiles) {
            const fileName = file.name;
            
            // Check if this file name matches the pattern
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            
            // If any file doesn't match the pattern, the rule fails
            if (!matches) return false;
        }
        
        // All files match the pattern
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
        for (const [_, file] of filteredFiles) {
            const fileName = file.name;
            
            // Check if this file name matches the pattern
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            
            // If any file doesn't match the pattern, the rule fails
            if (!matches) return false;
        }
        
        // All files match the pattern
        return true;
    }

    protected override async checkNegativeRule(filteredFiles: Map<string, File>): Promise<boolean> {
        for (const [_, file] of filteredFiles) {
            const fileName = file.name;
            
            // Check if this file name matches the pattern
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            
            // If any file matches the pattern, the rule fails (shouldNot.haveName)
            if (matches) return false;
        }
        
        // No files match the pattern - rule passes
        return true;
    }
}