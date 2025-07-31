import { Options } from '../common/fluent-api';
import {
    ProjectFilesInDirectoryHaveNameShouldSelector,
    ProjectFilesInDirectoryOnlyDependsOnShouldSelector,
    ProjectFilesInDirectoryOnlyHaveNameShouldSelector,
    ProjectFilesInDirectoryDependsOnShouldSelector
} from './checkers';

class PositiveMatchConditionSelectorBuilder {
    private readonly negated: boolean = false;

    constructor(
        readonly rootDir: string,
        readonly pattern: string,
        readonly options: Options,
        readonly excludePattern: string[],
        readonly ruleConstruction: string[]
    ) {}

    dependsOn(pattern: string[] | string): ProjectFilesInDirectoryDependsOnShouldSelector {
        const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
        return new ProjectFilesInDirectoryDependsOnShouldSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: patternArray,
            options: this.options,
            excludePattern: this.excludePattern,
            ruleConstruction: [...this.ruleConstruction, `depends on '[${patternArray.join(', ')}]'`]
        });
    }

    onlyDependsOn(pattern: string[] | string): ProjectFilesInDirectoryOnlyDependsOnShouldSelector {
        const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
        return new ProjectFilesInDirectoryOnlyDependsOnShouldSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: patternArray,
            options: this.options,
            excludePattern: this.excludePattern,
            ruleConstruction: [...this.ruleConstruction, `only depends on '[${patternArray.join(', ')}]'`]
        });
    }

    onlyHaveName(pattern: string): ProjectFilesInDirectoryOnlyHaveNameShouldSelector {
        return new ProjectFilesInDirectoryOnlyHaveNameShouldSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: [pattern],
            options: this.options,
            excludePattern: this.excludePattern,
            ruleConstruction: [...this.ruleConstruction, `only have name '${pattern}'`]
        });
    }

    haveName(pattern: string): ProjectFilesInDirectoryHaveNameShouldSelector {
        return new ProjectFilesInDirectoryHaveNameShouldSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: [pattern],
            options: this.options,
            excludePattern: this.excludePattern,
            ruleConstruction: [...this.ruleConstruction, `have name '${pattern}'`]
        });
    }
}

class NegativeMatchConditionSelectorBuilder {
    private readonly negated: boolean = true;

    constructor(
        readonly rootDir: string,
        readonly pattern: string,
        readonly options: Options,
        readonly excludePattern: string[],
        readonly ruleConstruction: string[]
    ) {}

    dependsOn(pattern: string[] | string): ProjectFilesInDirectoryDependsOnShouldSelector {
        const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
        return new ProjectFilesInDirectoryDependsOnShouldSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: patternArray,
            options: this.options,
            excludePattern: this.excludePattern,
            ruleConstruction: [...this.ruleConstruction, `depends on '[${patternArray.join(', ')}]'`]
        });
    }

    onlyDependsOn(pattern: string[] | string): ProjectFilesInDirectoryOnlyDependsOnShouldSelector {
        const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
        return new ProjectFilesInDirectoryOnlyDependsOnShouldSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: patternArray,
            options: this.options,
            excludePattern: this.excludePattern,
            ruleConstruction:[...this.ruleConstruction, `only depends on '[${patternArray.join(', ')}]'`]
        });
    }

    onlyHaveName(pattern: string): ProjectFilesInDirectoryOnlyHaveNameShouldSelector {
        return new ProjectFilesInDirectoryOnlyHaveNameShouldSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: [pattern],
            options: this.options,
            excludePattern: this.excludePattern,
            ruleConstruction: [...this.ruleConstruction, `only have name '${pattern}'`]
        });
    }

    haveName(pattern: string): ProjectFilesInDirectoryHaveNameShouldSelector {
        return new ProjectFilesInDirectoryHaveNameShouldSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: [pattern],
            options: this.options,
            excludePattern: this.excludePattern,
            ruleConstruction: [...this.ruleConstruction, `have name '${pattern}'`]
        });
    }
}

class ShouldSelectorBuilder {
  constructor(
    readonly rootDir: string,
    readonly pattern: string,
    readonly options: Options,
    readonly excludePattern: string[],
    readonly ruleConstruction: string[]
) {}

  should(): PositiveMatchConditionSelectorBuilder {
    return new PositiveMatchConditionSelectorBuilder(
        this.rootDir,
        this.pattern,
        this.options,
        this.excludePattern,
        [...this.ruleConstruction, 'should']
    );
  }

  shouldNot(): NegativeMatchConditionSelectorBuilder {
    return new NegativeMatchConditionSelectorBuilder(
        this.rootDir,
        this.pattern,
        this.options,
        this.excludePattern,
        [...this.ruleConstruction, 'should not']
    );
  }
}

class ProjectFilesComponentSelector {
    constructor(readonly rootDir: string, readonly options: Options, readonly ruleConstruction: string[]) {}

    inDirectory(pattern: string, excludePattern: string[] = []): ShouldSelectorBuilder {
        return new ShouldSelectorBuilder(
            this.rootDir,
            pattern,
            this.options,
            excludePattern,
            [...this.ruleConstruction, `in directory '${pattern}'` + (excludePattern.length > 0 ? ` - excluding files [${excludePattern.join(', ')}] ,` : '')]
        );
    }
}

export class ComponentSelectorBuilder {
  private constructor(readonly rootDir: string, readonly options: Options) {}

  static create(rootDir: string, options: Options): ComponentSelectorBuilder {
    return new ComponentSelectorBuilder(rootDir, options);
  }

  projectFiles(): ProjectFilesComponentSelector {
    return new ProjectFilesComponentSelector(this.rootDir, this.options, ['Rule: project files']);
  }
}

// inDirectory.should.beImportedOrRequiredBy.check
// inDirectory.shouldNot.beImportedOrRequiredBy.check

// inDirectory.should.onlyDependsOn.check
// inDirectory.shouldNot.onlyDependsOn.check

// inDirectory.should.onlyHaveName.check
// inDirectory.shouldNot.onlyHaveName.check

// inDirectory.should.haveName.check
// inDirectory.shouldNot.haveName.check