import { Options } from '@/fluent-api/common/types';
import {
  DependsOnShouldMatcher,
  HaveCyclesShouldMatcher,
  HaveNameShouldMatcher,
  LOCAnalysisGreaterThanOrEqualShouldMatcher,
  LOCAnalysisGreaterThanShouldMatcher,
  LOCAnalysisLessThanOrEqualShouldMatcher,
  LOCAnalysisLessThanShouldMatcher,
  OnlyDependsOnShouldMatcher,
  OnlyHaveNameShouldMatcher,
  HaveTotalProjectCodeLessOrEqualThanShouldMatcher,
  HaveTotalProjectCodeLessThanShouldMatcher,
} from '@/fluent-api/matchers';

abstract class MatchConditionSelectorBuilder {
  protected abstract readonly negated: boolean;

  constructor(
    protected readonly rootDir: string,
    protected readonly pattern: string[],
    protected readonly options: Options,
    protected readonly excludePattern: string[],
    protected readonly ruleConstruction: string[],
  ) {}

  haveTotalProjectCodeLessOrEqualThan(
    threshold: number,
  ): HaveTotalProjectCodeLessOrEqualThanShouldMatcher {
    return new HaveTotalProjectCodeLessOrEqualThanShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      percentageThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [
        ...this.ruleConstruction,
        `have total project code less or equal than: ${threshold}`,
      ],
    });
  }

  haveTotalProjectCodeLessThan(threshold: number): HaveTotalProjectCodeLessThanShouldMatcher {
    return new HaveTotalProjectCodeLessThanShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      percentageThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [
        ...this.ruleConstruction,
        `have total project code less than: ${threshold}`,
      ],
    });
  }

  haveLocGreaterOrEqualThan(threshold: number): LOCAnalysisGreaterThanOrEqualShouldMatcher {
    return new LOCAnalysisGreaterThanOrEqualShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [
        ...this.ruleConstruction,
        `have L.O.C. greater or equal than: ${threshold}`,
      ],
    });
  }

  haveLocGreaterThan(threshold: number): LOCAnalysisGreaterThanShouldMatcher {
    return new LOCAnalysisGreaterThanShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. greater than: ${threshold}`],
    });
  }

  haveLocLessOrEqualThan(threshold: number): LOCAnalysisLessThanOrEqualShouldMatcher {
    return new LOCAnalysisLessThanOrEqualShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less or equal than: ${threshold}`],
    });
  }

  haveLocLessThan(threshold: number): LOCAnalysisLessThanShouldMatcher {
    return new LOCAnalysisLessThanShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less than: ${threshold}`],
    });
  }

    haveCycles(): HaveCyclesShouldMatcher {
    return new HaveCyclesShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      checkingPatterns: [],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have cycles`],
    });
  }

  dependsOn(pattern: string[] | string): DependsOnShouldMatcher {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    return new DependsOnShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      checkingPatterns: patternArray,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `depends on '[${patternArray.join(', ')}]'`],
    });
  }

  onlyDependsOn(pattern: string[] | string): OnlyDependsOnShouldMatcher {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    return new OnlyDependsOnShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      checkingPatterns: patternArray,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [
        ...this.ruleConstruction,
        `only depends on '[${patternArray.join(', ')}]'`,
      ],
    });
  }

  onlyHaveName(pattern: string): OnlyHaveNameShouldMatcher {
    return new OnlyHaveNameShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      checkingPatterns: [pattern],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `only have name '${pattern}'`],
    });
  }

  haveName(pattern: string): HaveNameShouldMatcher {
    return new HaveNameShouldMatcher({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [...this.pattern],
      checkingPatterns: [pattern],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have name '${pattern}'`],
    });
  }
}

class PositiveMatchConditionSelectorBuilder extends MatchConditionSelectorBuilder {
  protected override readonly negated: boolean = false;
}

class NegativeMatchConditionSelectorBuilder extends MatchConditionSelectorBuilder {
  protected override readonly negated: boolean = true;
}

class ShouldSelectorBuilder {
  constructor(
    protected readonly rootDir: string,
    protected readonly options: Options,
    protected readonly ruleConstruction: string[],
    protected readonly componentSelector: ProjectFilesComponentSelector,
  ) {}

  should(): PositiveMatchConditionSelectorBuilder {
    return new PositiveMatchConditionSelectorBuilder(
      this.rootDir,
      this.componentSelector.includePatterns,
      this.options,
      this.componentSelector.excludePatterns,
      [...this.ruleConstruction, 'should'],
    );
  }

  shouldNot(): NegativeMatchConditionSelectorBuilder {
    return new NegativeMatchConditionSelectorBuilder(
      this.rootDir,
      this.componentSelector.includePatterns,
      this.options,
      this.componentSelector.excludePatterns,
      [...this.ruleConstruction, 'should not'],
    );
  }

  and(): ProjectFilesComponentSelector {
    return new ProjectFilesComponentSelector(
      this.rootDir,
      this.options,
      [...this.ruleConstruction, 'and'],
      [...this.componentSelector.includePatterns],
      [...this.componentSelector.excludePatterns],
    );
  }
}

class ProjectFilesComponentSelector {
  constructor(
    protected readonly rootDir: string,
    protected readonly options: Options,
    protected readonly ruleConstruction: string[],
    public includePatterns: string[] = [],
    public excludePatterns: string[] = [],
  ) {}

  inDirectories(patterns: string[], excludePattern: string[] = []): ShouldSelectorBuilder {
    this.includePatterns.push(...patterns);
    this.excludePatterns.push(...excludePattern);
    return new ShouldSelectorBuilder(
      this.rootDir,
      this.options,
      [
        ...this.ruleConstruction,
        `in directories '[${patterns.join(', ')}]'` +
          (excludePattern.length > 0 ? ` - excluding [${excludePattern.join(', ')}] ,` : ''),
      ],
      this,
    );
  }

  inDirectory(pattern: string, excludePattern: string[] = []): ShouldSelectorBuilder {
    this.includePatterns.push(pattern);
    this.excludePatterns.push(...excludePattern);
    return new ShouldSelectorBuilder(
      this.rootDir,
      this.options,
      [
        ...this.ruleConstruction,
        `in directory '${pattern}'` +
          (excludePattern.length > 0 ? ` - excluding [${excludePattern.join(', ')}] ,` : ''),
      ],
      this,
    );
  }

  inFiles(patterns: string[]): ShouldSelectorBuilder {
    this.includePatterns.push(...patterns);
    return new ShouldSelectorBuilder(
      this.rootDir,
      this.options,
      [...this.ruleConstruction, `in files '[${patterns.join(', ')}]'`],
      this,
    );
  }

  inFile(pattern: string): ShouldSelectorBuilder {
    this.includePatterns.push(pattern);
    return new ShouldSelectorBuilder(
      this.rootDir,
      this.options,
      [...this.ruleConstruction, `in file '${pattern}'`],
      this,
    );
  }
}

export class ComponentSelectorBuilder {
  private constructor(
    protected readonly rootDir: string,
    protected readonly options: Options,
  ) {}

  static create(rootDir: string, options: Options): ComponentSelectorBuilder {
    return new ComponentSelectorBuilder(rootDir, options);
  }

  projectFiles(): ProjectFilesComponentSelector {
    return new ProjectFilesComponentSelector(this.rootDir, this.options, ['Rule: project files']);
  }
}
