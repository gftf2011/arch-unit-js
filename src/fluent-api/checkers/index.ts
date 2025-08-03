import micromatch from "micromatch";
import { RootFile } from "../../core/file";
import {
    LOCAnalysisCheckable,
    PatternCiclesCheckable,
    PatternCheckable
} from "../common/checkables";
import { LOCAnalysisProps, PatternCheckableProps } from "../common/types";

export class ProjectFilesInDirectoryLOCAnalysisLessThanShouldSelector extends LOCAnalysisCheckable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        for (const [_, file] of nodes) {
            if (file.loc >= this.props.analisisThreshold) errors.push(new Error(`- '${file.path}'`));
        }
        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        for (const [_, file] of nodes) {
            if (file.loc < this.props.analisisThreshold) errors.push(new Error(`- '${file.path}'`));
        }
        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
}

export class ProjectFilesInDirectoryLOCAnalysisLessThanOrEqualShouldSelector extends LOCAnalysisCheckable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        for (const [_, file] of nodes) {
            if (file.loc > this.props.analisisThreshold) errors.push(new Error(`- '${file.path}'`));
        }
        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        for (const [_, file] of nodes) {
            if (file.loc <= this.props.analisisThreshold) errors.push(new Error(`- '${file.path}'`));
        }
        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
}

export class ProjectFilesInDirectoryLOCAnalysisGreaterThanShouldSelector extends LOCAnalysisCheckable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        for (const [_, file] of nodes) {
            if (file.loc <= this.props.analisisThreshold) errors.push(new Error(`- '${file.path}'`));
        }
        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        for (const [_, file] of nodes) {
            if (file.loc > this.props.analisisThreshold) errors.push(new Error(`- '${file.path}'`));
        }
        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
}

export class ProjectFilesInDirectoryLOCAnalysisGreaterThanOrEqualShouldSelector extends LOCAnalysisCheckable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        for (const [_, file] of nodes) {
            if (file.loc < this.props.analisisThreshold) errors.push(new Error(`- '${file.path}'`));
        }
        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        for (const [_, file] of nodes) {
            if (file.loc >= this.props.analisisThreshold) errors.push(new Error(`- '${file.path}'`));
        }
        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
}

export class ProjectFilesInDirectoryHaveCyclesShouldSelector extends PatternCiclesCheckable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }
    
    protected override async checkPositiveRule(_: Map<string, RootFile>): Promise<void> {
        const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nIF YOU SEE THIS, YOU MUST BE A UTTERLY STUPID PERSON';
        throw new Error(errorMessage);
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        if (nodes.size === 0) return;
        
        // Color coding: 0 = white (unvisited), 1 = gray (visiting), 2 = black (visited)
        const colors = new Map<string, number>();
        
        // Initialize all nodes as white (unvisited)
        for (const [filePath] of nodes) {
            colors.set(filePath, 0);
        }
        
        // DFS function to detect cycles
        const hasCycleDFS = (filePath: string): boolean => {
            const color = colors.get(filePath);
            
            // If gray (currently being visited), we found a back edge = cycle
            if (color === 1) return true;
            
            // If black (already visited), skip
            if (color === 2) return false;
            
            // Mark as gray (visiting)
            colors.set(filePath, 1);
            
            // Check all dependencies
            const file = nodes.get(filePath);
            if (file && file.dependencies) {
                for (const dependency of file.dependencies) {
                    // Only check dependencies that exist in our graph (internal dependencies)
                    if (nodes.has(dependency.name)) {
                        if (hasCycleDFS(dependency.name)) {
                            return true; // Cycle detected
                        }
                    }
                }
            }
            
            // Mark as black (visited)
            colors.set(filePath, 2);
            return false;
        };
        
        // Check for cycles starting from each unvisited node
        for (const [filePath] of nodes) {
            if (colors.get(filePath) === 0) { // If white (unvisited)
                if (hasCycleDFS(filePath)) {
                    throw new Error(this.props.ruleConstruction.join(' '));
                }
            }
        }
    }
}

export class ProjectFilesInDirectoryOnlyDependsOnShouldSelector extends PatternCheckable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        const check = (file: RootFile): boolean => {
            if (file.dependencies.length === 0) return true;

            const matchingDeps = file.dependencies.filter(dep => 
                micromatch([dep.name], this.props.checkingPatterns).length > 0
            );

            if (matchingDeps.length !== file.dependencies.length) return false;

            return true;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) errors.push(new Error(`- '${file.path}'`));
        }

        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
  
    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        const check = (file: RootFile): boolean => {
            if (file.dependencies.length === 0) return true;

            const matchingDeps = file.dependencies.filter(dep => 
                micromatch([dep.name], this.props.checkingPatterns).length > 0
            );

            if (matchingDeps.length < file.dependencies.length) return true;

            return false;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) errors.push(new Error(`- '${file.path}'`));
        }

        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
}

export class ProjectFilesInDirectoryDependsOnShouldSelector extends PatternCheckable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        const check = (file: RootFile): boolean => {
            if (file.dependencies.length === 0) return false;
            
            // Check if ALL specified patterns are present in this file's dependencies
            for (const pattern of this.props.checkingPatterns) {
                const hasPattern = file.dependencies.some(dep => 
                    micromatch([dep.name], [pattern]).length > 0
                );
                
                // If any pattern is missing, the rule fails
                if (!hasPattern) return false;
            }
            return true;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) errors.push(new Error(`- '${file.path}'`));
        }

        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        const check = (file: RootFile): boolean => {
            // Files with no dependencies pass the rule (no forbidden patterns can be present)
            if (file.dependencies.length === 0) return true;
            
            // Check if ANY of the specified patterns are present in this file's dependencies
            for (const dependency of file.dependencies) {
                const hasAnyPattern = this.props.checkingPatterns.some(pattern => 
                    micromatch([dependency.name], [pattern]).length > 0
                );
                
                // If any forbidden pattern is found, the rule fails
                if (hasAnyPattern) return false;
            }

            return true;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) errors.push(new Error(`- '${file.path}'`));
        }

        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
}

export class ProjectFilesInDirectoryOnlyHaveNameShouldSelector extends PatternCheckable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }

    protected override validateFilesDependencies(_: Map<string, RootFile>): void {
        return;
    }

    protected override validateIfAllDependenciesExistInProjectGraph(_: Map<string, RootFile>): void {
        return;
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        if (nodes.size === 0) return;

        let matchingFiles = 0;
        let totalFiles = nodes.size;
        
        for (const [_, file] of nodes) {
            const fileName = file.name;
            
            // Check if this file name matches the pattern
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            
            if (matches) {
                matchingFiles++;
            }
        }

        if (matchingFiles === totalFiles) {
            throw new Error(this.props.ruleConstruction.join(' '));
        }
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        // If no files are found, the rule passes (vacuous truth)
        if (nodes.size === 0) return;
        
        const errors: Error[] = [];
        const check = (file: RootFile): boolean => {
            const fileName = file.name;
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            return matches;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) errors.push(new Error(`- '${file.path}'`));
        }

        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
}

export class ProjectFilesInDirectoryHaveNameShouldSelector extends PatternCheckable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }

    protected override validateFilesDependencies(_: Map<string, RootFile>): void {
        return;
    }

    protected override validateIfAllDependenciesExistInProjectGraph(_: Map<string, RootFile>): void {
        return;
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        const check = (file: RootFile): boolean => {
            const fileName = file.name;
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            return matches;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) errors.push(new Error(`- '${file.path}'`));
        }

        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const errors: Error[] = [];
        const check = (file: RootFile): boolean => {
            const fileName = file.name;
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            return !matches;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) errors.push(new Error(`- '${file.path}'`));
        }

        if (errors.length > 0) {
            const errorMessage = this.props.ruleConstruction.join(' ') + '\n\nViolating files:\n' + errors.map(error => error.message).join('\n');
            throw new Error(errorMessage);
        }
    }
}