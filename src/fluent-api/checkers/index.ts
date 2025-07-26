import micromatch from "micromatch";
import { Checkable, Options, File } from "../../common/fluent-api";
import { walkThrough } from "../../common/walker";
import { extractExtensionFromGlobPattern } from "../../common/utils";

type Props = {
    negated: boolean;
    rootDir: string;
    filteringPatterns: string[];
    checkingPatterns: string[];
    options: Options;
    excludeIndexFiles: boolean;
    ruleConstruction: string[];
}

export class ImportMatchConditionSelector implements Checkable {
    constructor(readonly props: Props) {}

    private filter(map: Map<string, File>, filters: string[]): Map<string, File> {
        const indexFiltering = this.props.options.mimeTypes.map(mimeType => `**/index${extractExtensionFromGlobPattern(mimeType)}`).filter(mimeType => !mimeType.includes("null"));
        const filteringPattern = this.props.excludeIndexFiles ? [...filters, ...indexFiltering] : filters;
        const filteredFiles = new Map([...map].filter(([path, _file]) => micromatch([path], filteringPattern).length > 0));

        if (filteredFiles.size === 0) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `No files found in '[${filters.join(', ')}']`);
        }

        return filteredFiles;
    }
  
    async check(): Promise<boolean> {
        const hasAnyEmptyChecker = this.props.checkingPatterns.length === 0 
            || this.props.filteringPatterns.length === 0
            || this.props.checkingPatterns.includes('')
            || this.props.filteringPatterns.includes('');

        if (hasAnyEmptyChecker) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `No pattern was provided for checking`);
        }

        const files = await walkThrough(this.props.rootDir, this.props.options.includeMatcher, this.props.options.ignoreMatcher, this.props.options.mimeTypes);
        const filteredFiles = this.filter(files, this.props.filteringPatterns);
    
        const filteredImports = new Map<string, File>();
    
        for (const [path, file] of filteredFiles) {
            if (micromatch(file.dependencies.map(d => d.name), this.props.checkingPatterns).length > 0) {
                filteredImports.set(path, file);
            }
        }
    
        // TODO: check if the given imports exist in the project mapping in `files`
    
        return this.props.negated ? filteredImports.size === 0 : filteredImports.size > 0;
    }
}

export class ImportAllMatchConditionSelector implements Checkable {
    constructor(readonly props: Props) {}

    private filter(map: Map<string, File>, filters: string[]): Map<string, File> {
        const indexFiltering = this.props.options.mimeTypes.map(mimeType => `**/index${extractExtensionFromGlobPattern(mimeType)}`).filter(mimeType => !mimeType.includes("null"));
        const filteringPattern = this.props.excludeIndexFiles ? [...filters, ...indexFiltering] : filters;
        const filteredFiles = new Map([...map].filter(([path, _file]) => micromatch([path], filteringPattern).length > 0));

        if (filteredFiles.size === 0) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `No files found in '[${filters.join(', ')}']`);
        }

        return filteredFiles;
    }
    
    async check(): Promise<boolean> {
        const hasAnyEmptyChecker = this.props.checkingPatterns.length === 0 
            || this.props.filteringPatterns.length === 0
            || this.props.checkingPatterns.includes('')
            || this.props.filteringPatterns.includes('');

        if (hasAnyEmptyChecker) {
            throw new Error(`Violation - ${this.props.ruleConstruction.join(' ')}\n` + `No pattern was provided for checking`);
        }

        const files = await walkThrough(this.props.rootDir, this.props.options.includeMatcher, this.props.options.ignoreMatcher, this.props.options.mimeTypes);
        const filteredFiles = this.filter(files, this.props.filteringPatterns);

        let allImportsMatch = true;

        for (const [_path, file] of filteredFiles) {
            if (file.dependencies.length > 0) {
                const dependencies = micromatch(file.dependencies.map(d => d.name), this.props.checkingPatterns);
                if (dependencies.length !== file.dependencies.length) {
                    allImportsMatch = false;
                }
            }
        }

        // TODO: check if the given imports exist in the project mapping in `files`

        return this.props.negated ? !allImportsMatch : allImportsMatch;
    }
}