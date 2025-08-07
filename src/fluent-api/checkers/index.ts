import micromatch from "micromatch";
import { RootFile } from "../../core/file";
import {
    LOCAnalysisCheckable,
    PatternCiclesCheckable,
    PatternCheckable
} from "../common/checkables";
import { LOCAnalysisProps, PatternCheckableProps } from "../common/types";
import { NotificationHandler } from "../common/notification/handler";
import { NotificationError } from "../common/errors/notification";

export class ProjectFilesInDirectoryLOCAnalysisLessThanShouldSelector extends LOCAnalysisCheckable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            if (file.props.loc >= this.props.analisisThreshold) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }
        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            if (file.props.loc < this.props.analisisThreshold) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }
        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }
}

export class ProjectFilesInDirectoryLOCAnalysisLessThanOrEqualShouldSelector extends LOCAnalysisCheckable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            if (file.props.loc > this.props.analisisThreshold) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }
        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            if (file.props.loc <= this.props.analisisThreshold) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }
        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }
}

export class ProjectFilesInDirectoryLOCAnalysisGreaterThanShouldSelector extends LOCAnalysisCheckable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            if (file.props.loc <= this.props.analisisThreshold) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }
        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            if (file.props.loc > this.props.analisisThreshold) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }
        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }
}

export class ProjectFilesInDirectoryLOCAnalysisGreaterThanOrEqualShouldSelector extends LOCAnalysisCheckable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            if (file.props.loc < this.props.analisisThreshold) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }
        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            if (file.props.loc >= this.props.analisisThreshold) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }
        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }
}

export class ProjectFilesInDirectoryHaveCyclesShouldSelector extends PatternCiclesCheckable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }
    
    protected override async checkPositiveRule(_: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        const error = new Error('IF YOU SEE THIS, YOU MUST BE A UTTERLY STUPID PERSON');
        notificationHandler.addError(error);
        throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
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
            if (file && file.props.dependencies) {
                for (const dependency of file.props.dependencies) {
                    // Only check dependencies that exist in our graph (internal dependencies)
                    if (nodes.has(dependency.props.name)) {
                        if (hasCycleDFS(dependency.props.name)) {
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
                    throw new NotificationError(this.props.ruleConstruction, []);
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
        const notificationHandler = NotificationHandler.create();
        const check = (file: RootFile): boolean => {
            if (file.props.dependencies.length === 0) return true;

            const matchingDeps = file.props.dependencies.filter(dep => 
                micromatch([dep.props.name], this.props.checkingPatterns).length > 0
            );

            if (matchingDeps.length !== file.props.dependencies.length) return false;

            return true;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }

        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }
  
    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        const check = (file: RootFile): boolean => {
            if (file.props.dependencies.length === 0) return true;

            const matchingDeps = file.props.dependencies.filter(dep => 
                micromatch([dep.props.name], this.props.checkingPatterns).length > 0
            );

            if (matchingDeps.length < file.props.dependencies.length) return true;

            return false;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }

        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }
}

export class ProjectFilesInDirectoryDependsOnShouldSelector extends PatternCheckable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        const check = (file: RootFile): boolean => {
            if (file.props.dependencies.length === 0) return false;
            
            // Check if ALL specified patterns are present in this file's dependencies
            for (const pattern of this.props.checkingPatterns) {
                const hasPattern = file.props.dependencies.some(dep => 
                    micromatch([dep.props.name], [pattern]).length > 0
                );
                
                // If any pattern is missing, the rule fails
                if (!hasPattern) return false;
            }
            return true;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }

        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        const check = (file: RootFile): boolean => {
            // Files with no dependencies pass the rule (no forbidden patterns can be present)
            if (file.props.dependencies.length === 0) return true;
            
            // Check if ANY of the specified patterns are present in this file's dependencies
            for (const dependency of file.props.dependencies) {
                const hasAnyPattern = this.props.checkingPatterns.some(pattern => 
                    micromatch([dependency.props.name], [pattern]).length > 0
                );
                
                // If any forbidden pattern is found, the rule fails
                if (hasAnyPattern) return false;
            }

            return true;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }

        if (notificationHandler.hasErrors()) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
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

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        if (nodes.size === 0) return;

        let totalFiles = nodes.size;
        
        const notificationHandler = NotificationHandler.create();
        for (const [_, file] of nodes) {
            const fileName = file.props.name;
            
            // Check if this file name matches the pattern
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            
            if (matches) {
                notificationHandler.addError(new Error(`- '${file.props.path}'`));
            }
        }

        if (notificationHandler.getErrors().length === totalFiles) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        if (nodes.size === 0) return;
        
        const notificationHandler = NotificationHandler.create();
        const check = (file: RootFile): boolean => {
            const fileName = file.props.name;
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            return matches;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }

        if (notificationHandler.getErrors().length > 0) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
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

    protected override async checkPositiveRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        const check = (file: RootFile): boolean => {
            const fileName = file.props.name;
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            return matches;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }

        if (notificationHandler.getErrors().length > 0) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }

    protected override async checkNegativeRule(nodes: Map<string, RootFile>): Promise<void> {
        const notificationHandler = NotificationHandler.create();
        const check = (file: RootFile): boolean => {
            const fileName = file.props.name;
            const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
            return !matches;
        }
        for (const [_, file] of nodes) {
            if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
        }

        if (notificationHandler.getErrors().length > 0) {
            throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
        }
    }
}