import micromatch from 'micromatch';

import { RootFile } from '@/core/file';
import { PatternCheckable } from '@/fluent-api/common/checkables';
import { NotificationError } from '@/fluent-api/common/errors/notification';
import { NotificationHandler } from '@/fluent-api/common/notification/handler';
import { PatternCheckableProps } from '@/fluent-api/common/types';

export class OnlyHaveNameShouldSelector extends PatternCheckable {
  protected override readonly fileAnalysisType: RootFile.AnalysisType =
    RootFile.AnalysisType.NAME_ANALYSIS;

  constructor(protected readonly props: PatternCheckableProps) {
    super(props);
  }

  protected override validateFilesDependencies(): void {
    return;
  }

  protected override async checkNegativeRule(): Promise<void> {
    const files = this.project.getFiles();
    if (files.size === 0) return;

    const totalFiles = files.size;

    const notificationHandler = NotificationHandler.create();
    for (const [_, file] of files) {
      const fileName = file.props.name;

      // Check if this file name matches the pattern
      const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;

      if (matches) {
        notificationHandler.addError(new Error(`- '${file.props.path}'`));
      }
    }

    if (notificationHandler.getErrors().length === totalFiles) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }

  protected override async checkPositiveRule(): Promise<void> {
    const files = this.project.getFiles();
    if (files.size === 0) return;

    const notificationHandler = NotificationHandler.create();
    const check = (file: RootFile.Base): boolean => {
      const fileName = file.props.name;
      const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
      return matches;
    };
    for (const [_, file] of files) {
      if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }

    if (notificationHandler.getErrors().length > 0) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }
}
