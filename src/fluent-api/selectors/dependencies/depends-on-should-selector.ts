import micromatch from 'micromatch';

import { RootFile } from '@/core/file';
import { PatternCheckable } from '@/fluent-api/common/checkables';
import { NotificationError } from '@/fluent-api/common/errors/notification';
import { NotificationHandler } from '@/fluent-api/common/notification/handler';
import { PatternCheckableProps } from '@/fluent-api/common/types';

export class DependsOnShouldSelector extends PatternCheckable {
  protected override readonly fileAnalysisType: RootFile.AnalysisType =
    RootFile.AnalysisType.DEPENDENCIES;

  constructor(protected readonly props: PatternCheckableProps) {
    super(props);
  }

  protected override async checkPositiveRule(): Promise<void> {
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    const check = (file: RootFile.Base): boolean => {
      if (file.props.dependencies.length === 0) return false;

      // Check if ALL specified patterns are present in this file's dependencies
      for (const pattern of this.props.checkingPatterns) {
        const hasPattern = file.props.dependencies.some(
          (dep) => micromatch([dep.props.name], [pattern]).length > 0,
        );

        // If any pattern is missing, the rule fails
        if (!hasPattern) return false;
      }
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
      // Files with no dependencies pass the rule (no forbidden patterns can be present)
      if (file.props.dependencies.length === 0) return true;

      // Check if ANY of the specified patterns are present in this file's dependencies
      for (const dependency of file.props.dependencies) {
        const hasAnyPattern = this.props.checkingPatterns.some(
          (pattern) => micromatch([dependency.props.name], [pattern]).length > 0,
        );

        // If any forbidden pattern is found, the rule fails
        if (hasAnyPattern) return false;
      }

      return true;
    };
    for (const [_, file] of files) {
      if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }

    if (notificationHandler.hasErrors()) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }
}
