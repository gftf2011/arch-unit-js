import { Node } from '../node';
import micromatch from 'micromatch';

export type Dependency = {
    resolvedWith: 'require' | 'import';
    name: string;
    type: 'valid-path' | 'invalid' | 'node-package' | 'node-dev-package' | 'node-builtin-module';
}

export type File = {
    name: string;
    path: string;
    totalRequiredDependencies: number;
    totalImportedDependencies: number;
    loc: number;
    totalLines: number;
    totalClasses: number;
    totalFunctions: number;
    totalVariables: number;
    totalVarVariables: number;
    totalLetVariables: number;
    totalConstVariables: number;
    hasDefaultExport: boolean;
    type: 'file';
    dependencies: Dependency[];
}

export type Options = {
  mimeTypes: string[],
  includeMatcher: string[],
  ignoreMatcher: string[]
}

export type CheckableProps = {
    negated: boolean;
    rootDir: string;
    filteringPatterns: string[];
    checkingPatterns: string[];
    options: Options;
    excludePattern: string[];
    ruleConstruction: string[];
}

export abstract class Checkable {
    constructor(protected readonly props: CheckableProps) {}

    protected filter(map: Map<string, File>): Map<string, File> {
        const filters: string[] = this.props.filteringPatterns;
        const filteringPattern = [...filters, ...this.props.excludePattern];
        const filteredFiles = new Map([...map].filter(([path, _file]) => micromatch([path], filteringPattern).length > 0));

        if (filteredFiles.size === 0) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `No files found in '[${filters.join(', ')}]'`);
        }

        return filteredFiles;
    }

    protected async buildProjectGraph(): Promise<Map<string, File>> {
        return Node.buildProjectGraph(this.props.rootDir, this.props.options.includeMatcher, this.props.options.ignoreMatcher, this.props.options.mimeTypes);
    }

    protected clearFiles(files: Map<string, File>): void {
        files.clear();
    }

    protected validateFilesExtension(files: Map<string, File>): void {
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

    protected validateFilesDependencies(files: Map<string, File>): void {
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

    protected validateIfAllDependenciesExistInProjectGraph(files: Map<string, File>): void {
        const errors: Error[] = [];
        for (const [_path, file] of files) {
            const filePath = file.path;
            const invalidDependencies: string[] = [];
            for (const dependency of file.dependencies) {
                if (dependency.type === 'valid-path' && !files.has(dependency.name)) {
                    invalidDependencies.push(dependency.name);
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

    protected abstract checkRule(filteredFiles: Map<string, File>): Promise<boolean>
    
    public async check(): Promise<boolean> {
        const hasAnyEmptyChecker = this.props.checkingPatterns.length === 0
            || this.props.filteringPatterns.length === 0
            || this.props.checkingPatterns.includes('')
            || this.props.filteringPatterns.includes('');

        if (hasAnyEmptyChecker) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `No pattern was provided for checking`);
        }

        const files = await this.buildProjectGraph();

        this.validateFilesExtension(files);
        this.validateFilesDependencies(files);
        this.validateIfAllDependenciesExistInProjectGraph(files);

        const filteredFiles = this.filter(files);
        const result = await this.checkRule(filteredFiles);

        this.clearFiles(files);
        this.clearFiles(filteredFiles);

        return result;
    }
}
