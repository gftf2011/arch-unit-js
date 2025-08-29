import micromatch from 'micromatch';

import { RootFile } from '@/core/file';
import { NotificationError } from '@/fluent-api/common/errors/notification';
import { PatternMatchable } from '@/fluent-api/common/matchables';
import { NotificationHandler } from '@/fluent-api/common/notification/handler';
import { PatternMatchableProps } from '@/fluent-api/common/types';

export class OnlyDependsOnShouldMatcher extends PatternMatchable {
  protected override readonly fileAnalysisType: RootFile.AnalysisType =
    RootFile.AnalysisType.DEPENDENCIES;

  constructor(protected readonly props: PatternMatchableProps) {
    super(props);
  }

  protected override async checkPositiveRule(): Promise<void> {
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    const check = (file: RootFile.Base): boolean => {
      if (file.props.dependencies.length === 0) return true;

      const matchingDeps = file.props.dependencies.filter(
        (dep) => micromatch([dep.props.name], this.props.checkingPatterns).length > 0,
      );

      if (matchingDeps.length !== file.props.dependencies.length) return false;

      return true;
    };
    for (const [_, file] of files) {
      if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }

    if (notificationHandler.hasErrors()) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }

  protected override async checkNegativeRule(): Promise<void> {
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    const check = (file: RootFile.Base): boolean => {
      if (file.props.dependencies.length === 0) return true;

      const matchingDeps = file.props.dependencies.filter(
        (dep) => micromatch([dep.props.name], this.props.checkingPatterns).length > 0,
      );

      if (matchingDeps.length < file.props.dependencies.length) return true;

      return false;
    };
    for (const [_, file] of files) {
      if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }

    if (notificationHandler.hasErrors()) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }
}
