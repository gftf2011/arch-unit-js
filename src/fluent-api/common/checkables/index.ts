import { RootFile } from '../../../core/file';
import { NodeGraph } from '../../../core/node-graph';
import micromatch from 'micromatch';
import { CheckableProps, LOCAnalysisProps, PatternCheckableProps } from '../types';

abstract class Checkable {
    constructor(protected readonly props: CheckableProps) {}

    protected filter(map: Map<string, RootFile>): Map<string, RootFile> {
        const filters: string[] = this.props.filteringPatterns;
        const filteringPattern = [...filters, ...this.props.excludePattern];
        const filteredFiles = new Map([...map].filter(([path, _file]) => micromatch([path], filteringPattern).length > 0));

        if (filteredFiles.size === 0) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `No files found in '[${filters.join(', ')}]'`);
        }

        return filteredFiles;
    }

    protected async buildNodeGraph(): Promise<NodeGraph> {
        return NodeGraph.create(this.props.rootDir, this.props.options.includeMatcher, this.props.options.ignoreMatcher, this.props.options.mimeTypes);
    }

    protected clearFiles(files: Map<string, RootFile>): void {
        files.clear();
    }

    protected validateFilesExtension(files: Map<string, RootFile>): void {
        const errors: Error[] = [];
        for (const [_path, file] of files) {
            if (micromatch([file.path], this.props.options.mimeTypes).length === 0) {
                errors.push(new Error(`File: '${file.path}' - mismatch\nFile does not is in 'mimeTypes': [${this.props.options.mimeTypes.join(', ')}] - add desired file extension`));
            }
        }

        if (errors.length > 0) {
            const message = errors.map(error => error.message).join('\n\n');
            throw new Error(message);
        }
    }

    protected validateFilesDependencies(files: Map<string, RootFile>): void {
        const errors: Error[] = [];
        for (const [_path, file] of files) {
            const filePath = file.path;
            const invalidDependencies: string[] = [];
            for (const dependency of file.dependencies) {
                if (dependency.type === 'invalid') {
                    invalidDependencies.push(dependency.name);
                }
            }

            if (invalidDependencies.length > 0) {
                let errorMessage = `Dependencies in file: '${filePath}' - could not be resolved\n`;
                errorMessage += `${invalidDependencies.map(dependency => `- '${dependency}'`).join('\n')}\n`;
                errorMessage += `Check if dependency is listed in packge.json OR if dependency path is valid`;
                errors.push(new Error(errorMessage));
            }
        }

        if (errors.length > 0) {
            const message = errors.map(error => error.message).join('\n\n');
            throw new Error(message);
        }
    }

    protected validateIfAllDependenciesExistInProjectGraph(files: Map<string, RootFile>): void {
        const errors: Error[] = [];
        for (const [_path, file] of files) {
            const filePath = file.path;
            const invalidDependencies: string[] = [];
            for (const dependency of file.dependencies) {
                if (dependency.type === 'valid-path' && !files.has(dependency.fullName)) {
                    invalidDependencies.push(dependency.fullName);
                }
            }

            if (invalidDependencies.length > 0) {
                let errorMessage = `Dependencies in file: '${filePath}' - could not be resolved\n`;
                errorMessage += `${invalidDependencies.map(dependency => `- '${dependency}' - file path was not found`).join('\n')}\n`;
                errorMessage += `Check if path is being reached by the 'includeMatcher'`;
                errors.push(new Error(errorMessage));
            }
        }

        if (errors.length > 0) {
            const message = errors.map(error => error.message).join('\n\n');
            throw new Error(message);
        }
    }

    protected abstract checkPositiveRule(filteredFiles: Map<string, RootFile>): Promise<boolean>

    protected abstract checkNegativeRule(filteredFiles: Map<string, RootFile>): Promise<boolean>
    
    public async check(): Promise<boolean> {
        const files = (await this.buildNodeGraph()).nodes;

        this.validateFilesExtension(files);
        this.validateFilesDependencies(files);
        this.validateIfAllDependenciesExistInProjectGraph(files);

        const filteredFiles = this.filter(files);
        const result = this.props.negated
            ? await this.checkNegativeRule(filteredFiles)
            : await this.checkPositiveRule(filteredFiles);

        this.clearFiles(files);
        this.clearFiles(filteredFiles);

        return result;
    }
}

export abstract class LOCAnalysisCheckable extends Checkable {
    constructor(protected readonly props: LOCAnalysisProps) {
        super(props);
    }

    public override async check(): Promise<boolean> {
        const isThresholdValid = this.props.analisisThreshold <= 0;

        if (isThresholdValid) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `Threshold value must be greater than 0`);
        }
        return super.check();
    }
}

export abstract class PatternCheckable extends Checkable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }

    public override async check(): Promise<boolean> {
        const hasAnyEmptyChecker = this.props.checkingPatterns.length === 0
            || this.props.filteringPatterns.length === 0
            || this.props.checkingPatterns.includes('')
            || this.props.filteringPatterns.includes('');

        if (hasAnyEmptyChecker) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `No pattern was provided for checking`);
        }
        return super.check();
    }
}

export abstract class PatternCiclesCheckable extends PatternCheckable {
    constructor(protected readonly props: PatternCheckableProps) {
        super(props);
    }

    public override async check(): Promise<boolean> {
        const files = (await this.buildNodeGraph()).nodes;

        this.validateFilesExtension(files);
        this.validateFilesDependencies(files);
        this.validateIfAllDependenciesExistInProjectGraph(files);

        const filteredFiles = this.filter(files);
        const result = this.props.negated
            ? await this.checkNegativeRule(filteredFiles)
            : await this.checkPositiveRule(filteredFiles);

        this.clearFiles(files);
        this.clearFiles(filteredFiles);

        return result;
    }
}
