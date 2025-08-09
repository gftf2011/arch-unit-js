import micromatch from 'micromatch';

import { RootFile } from '../../../core/file';
import { NodeGraph } from '../../../core/node-graph';
import { NotificationError } from '../errors/notification';
import { NotificationHandler } from '../notification/handler';
import { CheckableProps, LOCAnalysisProps, PatternCheckableProps } from '../types';

abstract class Checkable {
  constructor(protected readonly props: CheckableProps) {}

  protected filter(map: Map<string, RootFile>): Map<string, RootFile> {
    const filters: string[] = this.props.filteringPatterns;
    const filteringPattern = [...filters, ...this.props.excludePattern];
    const filteredFiles = new Map(
      [...map].filter(([path, _file]) => micromatch([path], filteringPattern).length > 0),
    );

    if (filteredFiles.size === 0) {
      throw new NotificationError(this.props.ruleConstruction, [
        new Error(`No files found in '[${filters.join(', ')}]'`),
      ]);
    }

    return filteredFiles;
  }

  protected async buildNodeGraph(): Promise<NodeGraph> {
    return NodeGraph.create(
      this.props.rootDir,
      this.props.options.includeMatcher,
      this.props.options.ignoreMatcher,
      this.props.options.extensionTypes,
      this.props.options.typescriptPath,
    );
  }

  protected clearFiles(files: Map<string, RootFile>): void {
    files.clear();
  }

  protected validateFilesExtension(files: Map<string, RootFile>): void {
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

  protected validateFilesDependencies(files: Map<string, RootFile>): void {
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

  protected abstract checkPositiveRule(filteredFiles: Map<string, RootFile>): Promise<void>;

  protected abstract checkNegativeRule(filteredFiles: Map<string, RootFile>): Promise<void>;

  public async check(): Promise<void> {
    const files = (await this.buildNodeGraph()).nodes;

    this.validateFilesExtension(files);
    this.validateFilesDependencies(files);

    const filteredFiles = this.filter(files);
    try {
      this.props.negated
        ? await this.checkNegativeRule(filteredFiles)
        : await this.checkPositiveRule(filteredFiles);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      this.clearFiles(files);
      this.clearFiles(filteredFiles);
    }
  }
}

export abstract class LOCAnalysisCheckable extends Checkable {
  constructor(protected readonly props: LOCAnalysisProps) {
    super(props);
  }

  public override async check(): Promise<void> {
    const isThresholdValid = this.props.analisisThreshold <= 0;

    if (isThresholdValid) {
      throw new NotificationError(this.props.ruleConstruction, [
        new Error('Threshold value must be greater than 0'),
      ]);
    }
    await super.check();
  }
}

export abstract class PatternCheckable extends Checkable {
  constructor(protected readonly props: PatternCheckableProps) {
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

export abstract class PatternCyclesCheckable extends PatternCheckable {
  constructor(protected readonly props: PatternCheckableProps) {
    super(props);
  }

  public override async check(): Promise<void> {
    const files = (await this.buildNodeGraph()).nodes;

    this.validateFilesExtension(files);
    this.validateFilesDependencies(files);

    const filteredFiles = this.filter(files);
    try {
      this.props.negated
        ? await this.checkNegativeRule(filteredFiles)
        : await this.checkPositiveRule(filteredFiles);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      this.clearFiles(files);
      this.clearFiles(filteredFiles);
    }
  }
}
