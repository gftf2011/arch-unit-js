import { Options } from './common/types';
import {
  DependsOnShouldSelector,
  HaveCyclesShouldSelector,
  HaveNameShouldSelector,
  LOCAnalysisGreaterThanOrEqualShouldSelector,
  LOCAnalysisGreaterThanShouldSelector,
  LOCAnalysisLessThanOrEqualShouldSelector,
  LOCAnalysisLessThanShouldSelector,
  OnlyDependsOnShouldSelector,
  OnlyHaveNameShouldSelector,
} from './selectors';

class PositiveMatchConditionSelectorBuilder {
  private readonly negated: boolean = false;

  constructor(
    protected readonly rootDir: string,
    protected readonly pattern: string,
    protected readonly options: Options,
    protected readonly excludePattern: string[],
    protected readonly ruleConstruction: string[],
  ) {}

  haveLocGreaterOrEqualThan(threshold: number): LOCAnalysisGreaterThanOrEqualShouldSelector {
    return new LOCAnalysisGreaterThanOrEqualShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [
        ...this.ruleConstruction,
        `have L.O.C. greater or equal than: ${threshold}`,
      ],
    });
  }

  haveLocGreaterThan(threshold: number): LOCAnalysisGreaterThanShouldSelector {
    return new LOCAnalysisGreaterThanShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. greater than: ${threshold}`],
    });
  }

  haveLocLessOrEqualThan(threshold: number): LOCAnalysisLessThanOrEqualShouldSelector {
    return new LOCAnalysisLessThanOrEqualShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less or equal than: ${threshold}`],
    });
  }

  haveLocLessThan(threshold: number): LOCAnalysisLessThanShouldSelector {
    return new LOCAnalysisLessThanShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less than: ${threshold}`],
    });
  }

  haveCycles(): HaveCyclesShouldSelector {
    return new HaveCyclesShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: [],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have cycles`],
    });
  }

  dependsOn(pattern: string[] | string): DependsOnShouldSelector {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    return new DependsOnShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: patternArray,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `depends on '[${patternArray.join(', ')}]'`],
    });
  }

  onlyDependsOn(pattern: string[] | string): OnlyDependsOnShouldSelector {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    return new OnlyDependsOnShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: patternArray,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [
        ...this.ruleConstruction,
        `only depends on '[${patternArray.join(', ')}]'`,
      ],
    });
  }

  onlyHaveName(pattern: string): OnlyHaveNameShouldSelector {
    return new OnlyHaveNameShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: [pattern],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `only have name '${pattern}'`],
    });
  }

  haveName(pattern: string): HaveNameShouldSelector {
    return new HaveNameShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: [pattern],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have name '${pattern}'`],
    });
  }
}

class NegativeMatchConditionSelectorBuilder {
  private readonly negated: boolean = true;

  constructor(
    protected readonly rootDir: string,
    protected readonly pattern: string,
    protected readonly options: Options,
    protected readonly excludePattern: string[],
    protected readonly ruleConstruction: string[],
  ) {}

  haveLocGreaterOrEqualThan(threshold: number): LOCAnalysisGreaterThanOrEqualShouldSelector {
    return new LOCAnalysisGreaterThanOrEqualShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [
        ...this.ruleConstruction,
        `have L.O.C. greater or equal than: ${threshold}`,
      ],
    });
  }

  haveLocGreaterThan(threshold: number): LOCAnalysisGreaterThanShouldSelector {
    return new LOCAnalysisGreaterThanShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. greater than: ${threshold}`],
    });
  }

  haveLocLessOrEqualThan(threshold: number): LOCAnalysisLessThanOrEqualShouldSelector {
    return new LOCAnalysisLessThanOrEqualShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less or equal than: ${threshold}`],
    });
  }

  haveLocLessThan(threshold: number): LOCAnalysisLessThanShouldSelector {
    return new LOCAnalysisLessThanShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less than: ${threshold}`],
    });
  }

  haveCycles(): HaveCyclesShouldSelector {
    return new HaveCyclesShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: [],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have cycles`],
    });
  }

  dependsOn(pattern: string[] | string): DependsOnShouldSelector {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    return new DependsOnShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: patternArray,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `depends on '[${patternArray.join(', ')}]'`],
    });
  }

  onlyDependsOn(pattern: string[] | string): OnlyDependsOnShouldSelector {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    return new OnlyDependsOnShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: patternArray,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [
        ...this.ruleConstruction,
        `only depends on '[${patternArray.join(', ')}]'`,
      ],
    });
  }

  onlyHaveName(pattern: string): OnlyHaveNameShouldSelector {
    return new OnlyHaveNameShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: [pattern],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `only have name '${pattern}'`],
    });
  }

  haveName(pattern: string): HaveNameShouldSelector {
    return new HaveNameShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: [pattern],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have name '${pattern}'`],
    });
  }
}

class ShouldSelectorBuilder {
  constructor(
    protected readonly rootDir: string,
    protected readonly pattern: string,
    protected readonly options: Options,
    protected readonly excludePattern: string[],
    protected readonly ruleConstruction: string[],
  ) {}

  should(): PositiveMatchConditionSelectorBuilder {
    return new PositiveMatchConditionSelectorBuilder(
      this.rootDir,
      this.pattern,
      this.options,
      this.excludePattern,
      [...this.ruleConstruction, 'should'],
    );
  }

  shouldNot(): NegativeMatchConditionSelectorBuilder {
    return new NegativeMatchConditionSelectorBuilder(
      this.rootDir,
      this.pattern,
      this.options,
      this.excludePattern,
      [...this.ruleConstruction, 'should not'],
    );
  }
}

class ProjectFilesComponentSelector {
  constructor(
    protected readonly rootDir: string,
    protected readonly options: Options,
    protected readonly ruleConstruction: string[],
  ) {}

  inDirectory(pattern: string, excludePattern: string[] = []): ShouldSelectorBuilder {
    return new ShouldSelectorBuilder(this.rootDir, pattern, this.options, excludePattern, [
      ...this.ruleConstruction,
      `in directory '${pattern}'` +
        (excludePattern.length > 0 ? ` - excluding files [${excludePattern.join(', ')}] ,` : ''),
    ]);
  }

  withFile(pattern: string, excludePattern: string[] = []): ShouldSelectorBuilder {
    return new ShouldSelectorBuilder(this.rootDir, pattern, this.options, excludePattern, [
      ...this.ruleConstruction,
      `with file '${pattern}'` +
        (excludePattern.length > 0 ? ` - excluding files [${excludePattern.join(', ')}] ,` : ''),
    ]);
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
