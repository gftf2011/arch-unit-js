import { RootFile } from '@/core/file';
import { ProjectSizeAnalysisCheckable } from '@/fluent-api/common/checkables';
import { NotificationError } from '@/fluent-api/common/errors/notification';
import { NotificationHandler } from '@/fluent-api/common/notification/handler';
import { ProjectSizeAnalysisProps } from '@/fluent-api/common/types';

export class HaveTotalProjectCodeLessThanShouldSelector extends ProjectSizeAnalysisCheckable {
  protected override readonly fileAnalysisType: RootFile.AnalysisType =
    RootFile.AnalysisType.PROJECT_SIZE;

  constructor(protected readonly props: ProjectSizeAnalysisProps) {
    super(props);
  }

  protected override async checkPositiveRule(): Promise<void> {
    const projectSizeInBytes = this.project.getProjectSizeInBytes();
    const allowedProjectSizeInBytes = projectSizeInBytes * this.props.percentageThreshold;
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    let totalFilesSizeInBytes = 0;

    for (const [_, file] of files) {
      totalFilesSizeInBytes += file.props.size;
      notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }

    if (totalFilesSizeInBytes >= allowedProjectSizeInBytes) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }

  protected override async checkNegativeRule(): Promise<void> {
    const projectSizeInBytes = this.project.getProjectSizeInBytes();
    const allowedProjectSizeInBytes = projectSizeInBytes * this.props.percentageThreshold;
    const files = this.project.getFiles();
    const notificationHandler = NotificationHandler.create();
    let totalFilesSizeInBytes = 0;

    for (const [_, file] of files) {
      totalFilesSizeInBytes += file.props.size;
      notificationHandler.addError(new Error(`- '${file.props.path}'`));
    }

    if (totalFilesSizeInBytes < allowedProjectSizeInBytes) {
      throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
    }
  }
}
