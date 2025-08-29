import { CheckableIterator, Matchable } from '@/fluent-api/common/matchables';
import { Checkable, Options } from '@/fluent-api/common/types';
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

class MatcherCheckableBuilder implements Checkable {
  constructor(private readonly matchConditionSelectorBuilder: MatchConditionSelectorBuilder) {}

  public async check(): Promise<void> {
    const checkableIterator = new CheckableIterator(this.matchConditionSelectorBuilder.matchables);
    await checkableIterator.check();
  }

  public and(): MatchConditionSelectorBuilder {
    if (this.matchConditionSelectorBuilder.negated) {
      return new NegativeMatchConditionSelectorBuilder(
        this.matchConditionSelectorBuilder.rootDir,
        this.matchConditionSelectorBuilder.pattern,
        this.matchConditionSelectorBuilder.options,
        this.matchConditionSelectorBuilder.excludePattern,
        [...this.matchConditionSelectorBuilder.ruleConstruction, 'and'],
        [...this.matchConditionSelectorBuilder.matchables],
      );
    }
    return new PositiveMatchConditionSelectorBuilder(
      this.matchConditionSelectorBuilder.rootDir,
      this.matchConditionSelectorBuilder.pattern,
      this.matchConditionSelectorBuilder.options,
      this.matchConditionSelectorBuilder.excludePattern,
      [...this.matchConditionSelectorBuilder.ruleConstruction, 'and'],
      [...this.matchConditionSelectorBuilder.matchables],
    );
  }
}

abstract class MatchConditionSelectorBuilder {
  public abstract readonly negated: boolean;

  constructor(
    public readonly rootDir: string,
    public readonly pattern: string[],
    public readonly options: Options,
    public readonly excludePattern: string[],
    public readonly ruleConstruction: string[],
    public readonly matchables: Matchable[] = [],
  ) {}

  haveTotalProjectCodeLessOrEqualThan(threshold: number): MatcherCheckableBuilder {
    this.matchables.push(
      new HaveTotalProjectCodeLessOrEqualThanShouldMatcher({
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
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  haveTotalProjectCodeLessThan(threshold: number): MatcherCheckableBuilder {
    this.matchables.push(
      new HaveTotalProjectCodeLessThanShouldMatcher({
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
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  haveLocGreaterOrEqualThan(threshold: number): MatcherCheckableBuilder {
    this.matchables.push(
      new LOCAnalysisGreaterThanOrEqualShouldMatcher({
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
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  haveLocGreaterThan(threshold: number): MatcherCheckableBuilder {
    this.matchables.push(
      new LOCAnalysisGreaterThanShouldMatcher({
        negated: this.negated,
        rootDir: this.rootDir,
        filteringPatterns: [...this.pattern],
        analisisThreshold: threshold,
        options: this.options,
        excludePattern: this.excludePattern,
        ruleConstruction: [...this.ruleConstruction, `have L.O.C. greater than: ${threshold}`],
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  haveLocLessOrEqualThan(threshold: number): MatcherCheckableBuilder {
    this.matchables.push(
      new LOCAnalysisLessThanOrEqualShouldMatcher({
        negated: this.negated,
        rootDir: this.rootDir,
        filteringPatterns: [...this.pattern],
        analisisThreshold: threshold,
        options: this.options,
        excludePattern: this.excludePattern,
        ruleConstruction: [
          ...this.ruleConstruction,
          `have L.O.C. less or equal than: ${threshold}`,
        ],
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  haveLocLessThan(threshold: number): MatcherCheckableBuilder {
    this.matchables.push(
      new LOCAnalysisLessThanShouldMatcher({
        negated: this.negated,
        rootDir: this.rootDir,
        filteringPatterns: [...this.pattern],
        analisisThreshold: threshold,
        options: this.options,
        excludePattern: this.excludePattern,
        ruleConstruction: [...this.ruleConstruction, `have L.O.C. less than: ${threshold}`],
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  haveCycles(): MatcherCheckableBuilder {
    this.matchables.push(
      new HaveCyclesShouldMatcher({
        negated: this.negated,
        rootDir: this.rootDir,
        filteringPatterns: [...this.pattern],
        checkingPatterns: [],
        options: this.options,
        excludePattern: this.excludePattern,
        ruleConstruction: [...this.ruleConstruction, `have cycles`],
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  dependsOn(pattern: string[] | string): MatcherCheckableBuilder {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    this.matchables.push(
      new DependsOnShouldMatcher({
        negated: this.negated,
        rootDir: this.rootDir,
        filteringPatterns: [...this.pattern],
        checkingPatterns: patternArray,
        options: this.options,
        excludePattern: this.excludePattern,
        ruleConstruction: [...this.ruleConstruction, `depends on '[${patternArray.join(', ')}]'`],
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  onlyDependsOn(pattern: string[] | string): MatcherCheckableBuilder {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    this.matchables.push(
      new OnlyDependsOnShouldMatcher({
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
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  onlyHaveName(pattern: string): MatcherCheckableBuilder {
    this.matchables.push(
      new OnlyHaveNameShouldMatcher({
        negated: this.negated,
        rootDir: this.rootDir,
        filteringPatterns: [...this.pattern],
        checkingPatterns: [pattern],
        options: this.options,
        excludePattern: this.excludePattern,
        ruleConstruction: [...this.ruleConstruction, `only have name '${pattern}'`],
      }),
    );
    return new MatcherCheckableBuilder(this);
  }

  haveName(pattern: string): MatcherCheckableBuilder {
    this.matchables.push(
      new HaveNameShouldMatcher({
        negated: this.negated,
        rootDir: this.rootDir,
        filteringPatterns: [...this.pattern],
        checkingPatterns: [pattern],
        options: this.options,
        excludePattern: this.excludePattern,
        ruleConstruction: [...this.ruleConstruction, `have name '${pattern}'`],
      }),
    );
    return new MatcherCheckableBuilder(this);
  }
}

class PositiveMatchConditionSelectorBuilder extends MatchConditionSelectorBuilder {
  public override readonly negated: boolean = false;
}

class NegativeMatchConditionSelectorBuilder extends MatchConditionSelectorBuilder {
  public override readonly negated: boolean = true;
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
