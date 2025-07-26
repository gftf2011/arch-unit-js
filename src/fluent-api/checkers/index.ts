import micromatch from "micromatch";
import { Checkable, File, CheckableProps } from "../../common/fluent-api";

export class ImportMatchConditionSelector extends Checkable {
    constructor(readonly props: CheckableProps) {
        super(props);
    }

    protected override async checkRule(filteredFiles: Map<string, File>): Promise<boolean> {
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

export class ImportAllMatchConditionSelector extends Checkable {
    constructor(readonly props: CheckableProps) {
        super(props);
    }

    protected override async checkRule(filteredFiles: Map<string, File>): Promise<boolean> {
        if (this.props.negated) {
            let anyImportsMatch = true;

            for (const [_path, file] of filteredFiles) {
                const matchingDependencies = file.dependencies.filter(dep => 
                    micromatch([dep.name], this.props.checkingPatterns).length > 0
                );
                
                if (file.dependencies.length > 0 && matchingDependencies.length === file.dependencies.length) {
                    anyImportsMatch = false;
                    break;
                }
            }

            return anyImportsMatch;
        } else {
            let allImportsMatch = true;

            for (const [_path, file] of filteredFiles) {
                const matchingDependencies = file.dependencies.filter(dep => 
                    micromatch([dep.name], this.props.checkingPatterns).length > 0
                );
                
                if (file.dependencies.length > 0 && matchingDependencies.length !== file.dependencies.length) {
                    allImportsMatch = false;
                    break;
                }
            }

            return allImportsMatch;
        }
    }
}