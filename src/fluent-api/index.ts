import {
  ProjectFilesInDirectoryHaveNameShouldSelector,
  ProjectFilesInDirectoryOnlyDependsOnShouldSelector,
  ProjectFilesInDirectoryOnlyHaveNameShouldSelector,
  ProjectFilesInDirectoryDependsOnShouldSelector,
  ProjectFilesInDirectoryHaveCyclesShouldSelector,
  ProjectFilesInDirectoryLOCAnalysisLessThanShouldSelector,
  ProjectFilesInDirectoryLOCAnalysisLessThanOrEqualShouldSelector,
  ProjectFilesInDirectoryLOCAnalysisGreaterThanShouldSelector,
  ProjectFilesInDirectoryLOCAnalysisGreaterThanOrEqualShouldSelector,
} from './checkers';
import { Options } from './common/types';

class PositiveMatchConditionSelectorBuilder {
  private readonly negated: boolean = false;

  constructor(
    protected readonly rootDir: string,
    protected readonly pattern: string,
    protected readonly options: Options,
    protected readonly excludePattern: string[],
    protected readonly ruleConstruction: string[],
  ) {}

  haveLocGreaterOrEqualThan(
    threshold: number,
  ): ProjectFilesInDirectoryLOCAnalysisGreaterThanOrEqualShouldSelector {
    return new ProjectFilesInDirectoryLOCAnalysisGreaterThanOrEqualShouldSelector({
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

  haveLocGreaterThan(
    threshold: number,
  ): ProjectFilesInDirectoryLOCAnalysisGreaterThanShouldSelector {
    return new ProjectFilesInDirectoryLOCAnalysisGreaterThanShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. greater than: ${threshold}`],
    });
  }

  haveLocLessOrEqualThan(
    threshold: number,
  ): ProjectFilesInDirectoryLOCAnalysisLessThanOrEqualShouldSelector {
    return new ProjectFilesInDirectoryLOCAnalysisLessThanOrEqualShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less or equal than: ${threshold}`],
    });
  }

  haveLocLessThan(threshold: number): ProjectFilesInDirectoryLOCAnalysisLessThanShouldSelector {
    return new ProjectFilesInDirectoryLOCAnalysisLessThanShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less than: ${threshold}`],
    });
  }

  haveCycles(): ProjectFilesInDirectoryHaveCyclesShouldSelector {
    return new ProjectFilesInDirectoryHaveCyclesShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: [],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have cycles`],
    });
  }

  dependsOn(pattern: string[] | string): ProjectFilesInDirectoryDependsOnShouldSelector {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    return new ProjectFilesInDirectoryDependsOnShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: patternArray,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `depends on '[${patternArray.join(', ')}]'`],
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
      ruleConstruction: [
        ...this.ruleConstruction,
        `only depends on '[${patternArray.join(', ')}]'`,
      ],
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
      ruleConstruction: [...this.ruleConstruction, `only have name '${pattern}'`],
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

  haveLocGreaterOrEqualThan(
    threshold: number,
  ): ProjectFilesInDirectoryLOCAnalysisGreaterThanOrEqualShouldSelector {
    return new ProjectFilesInDirectoryLOCAnalysisGreaterThanOrEqualShouldSelector({
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

  haveLocGreaterThan(
    threshold: number,
  ): ProjectFilesInDirectoryLOCAnalysisGreaterThanShouldSelector {
    return new ProjectFilesInDirectoryLOCAnalysisGreaterThanShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. greater than: ${threshold}`],
    });
  }

  haveLocLessOrEqualThan(
    threshold: number,
  ): ProjectFilesInDirectoryLOCAnalysisLessThanOrEqualShouldSelector {
    return new ProjectFilesInDirectoryLOCAnalysisLessThanOrEqualShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less or equal than: ${threshold}`],
    });
  }

  haveLocLessThan(threshold: number): ProjectFilesInDirectoryLOCAnalysisLessThanShouldSelector {
    return new ProjectFilesInDirectoryLOCAnalysisLessThanShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      analisisThreshold: threshold,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have L.O.C. less than: ${threshold}`],
    });
  }

  haveCycles(): ProjectFilesInDirectoryHaveCyclesShouldSelector {
    return new ProjectFilesInDirectoryHaveCyclesShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: [],
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `have cycles`],
    });
  }

  dependsOn(pattern: string[] | string): ProjectFilesInDirectoryDependsOnShouldSelector {
    const patternArray = typeof pattern === 'string' ? [pattern] : pattern;
    return new ProjectFilesInDirectoryDependsOnShouldSelector({
      negated: this.negated,
      rootDir: this.rootDir,
      filteringPatterns: [this.pattern],
      checkingPatterns: patternArray,
      options: this.options,
      excludePattern: this.excludePattern,
      ruleConstruction: [...this.ruleConstruction, `depends on '[${patternArray.join(', ')}]'`],
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
      ruleConstruction: [
        ...this.ruleConstruction,
        `only depends on '[${patternArray.join(', ')}]'`,
      ],
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
      ruleConstruction: [...this.ruleConstruction, `only have name '${pattern}'`],
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
