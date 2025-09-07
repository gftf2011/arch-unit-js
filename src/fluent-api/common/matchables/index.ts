import micromatch from 'micromatch';

import { RootFile } from '@/core/file';
import { Project } from '@/core/project';
import { NotificationError } from '@/fluent-api/common/errors/notification';
import { NotificationHandler } from '@/fluent-api/common/notification/handler';
import {
  MatchableProps,
  LOCAnalysisProps,
  PatternMatchableProps,
  ProjectSizeAnalysisProps,
  Checkable,
} from '@/fluent-api/common/types';
import { glob } from '@/utils';

export abstract class Matchable implements Checkable {
  protected project!: Project;
  protected abstract readonly fileAnalysisType: RootFile.AnalysisType;

  constructor(protected readonly props: MatchableProps) {}

  protected filter(): void {
    const filters: string[] = this.props.filteringPatterns;
    const filteringPattern = glob.resolveRootDirPatterns(
      [...filters, ...this.props.excludePattern],
      this.props.rootDir,
      this.props.options.workspaceDir,
    );

    const filteredFiles = new Map(
      [...this.project.getFiles()].filter(
        ([path, _file]) => micromatch([path], filteringPattern).length > 0,
      ),
    );

    if (filteredFiles.size === 0) {
      throw new NotificationError(this.props.ruleConstruction, [
        new Error(`No files found in '[${filters.join(', ')}]'`),
      ]);
    }

    this.project.setFiles(filteredFiles);
  }

  protected async buildNodeGraph(): Promise<Project> {
    return Project.create(
      this.fileAnalysisType,
      this.props.rootDir,
      this.props.options.includeMatcher,
      this.props.options.ignoreMatcher ?? [],
      this.props.options.extensionTypes,
      this.props.options.workspaceDir,
      this.props.options.typescriptPath,
      this.props.options.webpack,
    );
  }

  protected validateFilesExtension(): void {
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();

    for (const [_path, file] of files) {
      if (micromatch([file.props.path], this.props.options.extensionTypes).length === 0) {
        notificationHandler.addError(
          new Error(
            `- '${file.props.path}' - mismatch in 'extensionTypes': [${this.props.options.extensionTypes.join(', ')}]`,
          ),
        );
      }
    }

    if (notificationHandler.getErrors().length > 0) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }

  protected validateFilesDependencies(): void {
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    for (const [_path, file] of files) {
      const filePath = file.props.path;
      const dependenciesErrors: Error[] = [];
      for (const dependency of file.props.dependencies) {
        if (dependency.props.type === 'invalid') {
          dependenciesErrors.push(new Error(`  - '${dependency.props.name}'`));
        }
      }

      if (dependenciesErrors.length > 0) {
        const error = new Error(
          `Check if dependencies in file: '${filePath}' - are listed in package.json OR if dependency path is valid OR are reached by 'includeMatcher'`,
        );
        notificationHandler.addErrors([error, ...dependenciesErrors]);
      }
    }

    if (notificationHandler.getErrors().length > 0) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }

  protected abstract checkPositiveRule(): Promise<void>;

  protected abstract checkNegativeRule(): Promise<void>;

  public async check(): Promise<void> {
    this.project = await this.buildNodeGraph();

    this.validateFilesExtension();
    this.validateFilesDependencies();
    this.filter();

    try {
      this.props.negated ? await this.checkNegativeRule() : await this.checkPositiveRule();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export abstract class ProjectSizeAnalysisMatchable extends Matchable {
  constructor(protected readonly props: ProjectSizeAnalysisProps) {
    super(props);
  }

  public override async check(): Promise<void> {
    const isPercentageInvalid =
      this.props.percentageThreshold <= 0 || this.props.percentageThreshold > 1;

    if (isPercentageInvalid) {
      throw new NotificationError(this.props.ruleConstruction, [
        new Error('Percentage value must be greater than 0 and less or equal than 1'),
      ]);
    }
    await super.check();
  }
}

export abstract class LOCAnalysisMatchable extends Matchable {
  constructor(protected readonly props: LOCAnalysisProps) {
    super(props);
  }

  public override async check(): Promise<void> {
    const isThresholdInvalid = this.props.analisisThreshold <= 0;

    if (isThresholdInvalid) {
      throw new NotificationError(this.props.ruleConstruction, [
        new Error('Threshold value must be greater than 0'),
      ]);
    }
    await super.check();
  }
}

export abstract class PatternMatchable extends Matchable {
  constructor(protected readonly props: PatternMatchableProps) {
    super(props);
  }

  public override async check(): Promise<void> {
    const hasAnyEmptyChecker =
      this.props.checkingPatterns.length === 0 ||
      this.props.filteringPatterns.length === 0 ||
      this.props.checkingPatterns.includes('') ||
      this.props.filteringPatterns.includes('');

    if (hasAnyEmptyChecker) {
      throw new NotificationError(this.props.ruleConstruction, [
        new Error('No pattern was provided for checking'),
      ]);
    }
    await super.check();
  }
}

export abstract class PatternCyclesMatchable extends Matchable {
  constructor(protected readonly props: PatternMatchableProps) {
    super(props);
  }

  public override async check(): Promise<void> {
    await super.check();
  }
}

export class CheckableIterator implements Checkable {
  constructor(protected readonly matchables: Matchable[]) {}

  public async check(): Promise<void> {
    for (const matchable of this.matchables) {
      await matchable.check();
    }
  }
}
