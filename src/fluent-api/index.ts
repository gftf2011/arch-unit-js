import { Options } from '../common/fluent-api';
import { BeImportedOrRequiredBySelector, OnlyDependsOnSelector, OnlyHaveNameSelector } from './checkers';

class PositiveMatchConditionSelectorBuilder {
    readonly negated: boolean = false;

    constructor(
        readonly rootDir: string,
        readonly pattern: string,
        readonly options: Options,
        readonly excludeIndexFiles: boolean,
        readonly ruleConstruction: string[]
    ) {}

    beImportedOrRequiredBy(pattern: string): BeImportedOrRequiredBySelector {
        return new BeImportedOrRequiredBySelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [pattern],
            checkingPatterns: [this.pattern],
            options: this.options,
            excludeIndexFiles: this.excludeIndexFiles,
            ruleConstruction: [...this.ruleConstruction, `be imported or required by '${pattern}'`]
        });
    }

    onlyDependsOn(patterns: string[]): OnlyDependsOnSelector {
        return new OnlyDependsOnSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: patterns,
            options: this.options,
            excludeIndexFiles: this.excludeIndexFiles,
            ruleConstruction: [...this.ruleConstruction, `only depends on '[${patterns.join(', ')}]'`]
        });
    }

    onlyHaveName(pattern: string): OnlyHaveNameSelector {
        return new OnlyHaveNameSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: [pattern],
            options: this.options,
            excludeIndexFiles: this.excludeIndexFiles,
            ruleConstruction: [...this.ruleConstruction, `have name '${pattern}'`]
        });
    }
}

class NegativeMatchConditionSelectorBuilder {
    readonly negated: boolean = true;

    constructor(
        readonly rootDir: string,
        readonly pattern: string,
        readonly options: Options,
        readonly excludeIndexFiles: boolean,
        readonly ruleConstruction: string[]
    ) {}

    beImportedOrRequiredBy(pattern: string): BeImportedOrRequiredBySelector {
        return new BeImportedOrRequiredBySelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [pattern],
            checkingPatterns: [this.pattern],
            options: this.options,
            excludeIndexFiles: this.excludeIndexFiles,
            ruleConstruction: [...this.ruleConstruction, `be imported or required by '${pattern}'`]
        });
    }

    onlyDependsOn(patterns: string[]): OnlyDependsOnSelector {
        return new OnlyDependsOnSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: patterns,
            options: this.options,
            excludeIndexFiles: this.excludeIndexFiles,
            ruleConstruction:[...this.ruleConstruction, `only depends on '[${patterns.join(', ')}]'`]
        });
    }

    onlyHaveName(pattern: string): OnlyHaveNameSelector {
        return new OnlyHaveNameSelector({
            negated: this.negated,
            rootDir: this.rootDir,
            filteringPatterns: [this.pattern],
            checkingPatterns: [pattern],
            options: this.options,
            excludeIndexFiles: this.excludeIndexFiles,
            ruleConstruction: [...this.ruleConstruction, `have name '${pattern}'`]
        });
    }
}

class ShouldSelectorBuilder {
  constructor(
    readonly rootDir: string,
    readonly pattern: string,
    readonly options: Options,
    readonly excludeIndexFiles: boolean,
    readonly ruleConstruction: string[]
) {}

  should(): PositiveMatchConditionSelectorBuilder {
    return new PositiveMatchConditionSelectorBuilder(
        this.rootDir,
        this.pattern,
        this.options,
        this.excludeIndexFiles,
        [...this.ruleConstruction, 'should']
    );
  }

  shouldNot(): NegativeMatchConditionSelectorBuilder {
    return new NegativeMatchConditionSelectorBuilder(
        this.rootDir,
        this.pattern,
        this.options,
        this.excludeIndexFiles,
        [...this.ruleConstruction, 'should not']
    );
  }
}

class ComponentSelector {
    constructor(readonly rootDir: string, readonly options: Options, readonly ruleConstruction: string[]) {}

    inDirectory(pattern: string, excludeIndexFiles: boolean = false): ShouldSelectorBuilder {
        return new ShouldSelectorBuilder(
            this.rootDir,
            pattern,
            this.options,
            excludeIndexFiles,
            [...this.ruleConstruction, `inDirectory '${pattern}'` + (excludeIndexFiles ? ' - excluding index files,' : '')]
        );
    }
}

export class ComponentSelectorBuilder {
  private constructor(readonly rootDir: string, readonly options: Options) {}

  static create(rootDir: string, options: Options): ComponentSelectorBuilder {
    return new ComponentSelectorBuilder(rootDir, options);
  }

  projectFiles(): ComponentSelector {
    return new ComponentSelector(this.rootDir, this.options, ['Rule: project files']);
  }
}

// inDirectory.should.beImportedOrRequiredBy.check
// inDirectory.shouldNot.beImportedOrRequiredBy.check

// inDirectory.should.onlyDependsOn.check
// inDirectory.shouldNot.onlyDependsOn.check