import micromatch from 'micromatch';

import { RootFile } from '@/core/file';
import { PatternCheckable } from '@/fluent-api/common/checkables';
import { NotificationError } from '@/fluent-api/common/errors/notification';
import { NotificationHandler } from '@/fluent-api/common/notification/handler';
import { PatternCheckableProps } from '@/fluent-api/common/types';

export class HaveNameShouldSelector extends PatternCheckable {
  protected override readonly fileAnalysisType: RootFile.AnalysisType =
    RootFile.AnalysisType.NAME_ANALYSIS;

  constructor(protected readonly props: PatternCheckableProps) {
    super(props);
  }

  protected override validateFilesDependencies(): void {
    return;
  }

  protected override async checkPositiveRule(): Promise<void> {
    const files = this.project.getFiles();
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

  protected override async checkNegativeRule(): Promise<void> {
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    const check = (file: RootFile.Base): boolean => {
      const fileName = file.props.name;
      const matches = micromatch([fileName], this.props.checkingPatterns).length > 0;
      return !matches;
    };
    for (const [_, file] of files) {
      if (!check(file)) notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }

    if (notificationHandler.getErrors().length > 0) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }
}
