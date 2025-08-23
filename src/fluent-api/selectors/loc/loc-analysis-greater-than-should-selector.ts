import { RootFile } from '@/core/file';
import { LOCAnalysisCheckable } from '@/fluent-api/common/checkables';
import { NotificationError } from '@/fluent-api/common/errors/notification';
import { NotificationHandler } from '@/fluent-api/common/notification/handler';
import { LOCAnalysisProps } from '@/fluent-api/common/types';

export class LOCAnalysisGreaterThanShouldSelector extends LOCAnalysisCheckable {
  protected override readonly fileAnalysisType: RootFile.AnalysisType = RootFile.AnalysisType.LOC;

  constructor(protected readonly props: LOCAnalysisProps) {
    super(props);
  }

  protected override async checkPositiveRule(): Promise<void> {
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    for (const [_, file] of files) {
      if (file.props.loc <= this.props.analisisThreshold)
        notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }
    if (notificationHandler.hasErrors()) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }

  protected override async checkNegativeRule(): Promise<void> {
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    for (const [_, file] of files) {
      if (file.props.loc > this.props.analisisThreshold)
        notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }
    if (notificationHandler.hasErrors()) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }
}
