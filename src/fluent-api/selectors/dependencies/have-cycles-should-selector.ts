import { RootFile } from '@/core/file';
import { PatternCyclesCheckable } from '@/fluent-api/common/checkables';
import { NotificationError } from '@/fluent-api/common/errors/notification';
import { NotificationHandler } from '@/fluent-api/common/notification/handler';
import { PatternCheckableProps } from '@/fluent-api/common/types';

export class HaveCyclesShouldSelector extends PatternCyclesCheckable {
  protected override readonly fileAnalysisType: RootFile.AnalysisType =
    RootFile.AnalysisType.DEPENDENCIES;

  constructor(protected readonly props: PatternCheckableProps) {
    super(props);
  }

  protected override async checkPositiveRule(): Promise<void> {
    const notificationHandler = NotificationHandler.create();
    const error = new Error('IF YOU SEE THIS, YOU MUST BE A UTTERLY STUPID PERSON');
    notificationHandler.addError(error);
    throw new NotificationError(this.props.ruleConstruction, notificationHandler.getErrors());
  }

  protected override async checkNegativeRule(): Promise<void> {
    const files = this.project.getFiles();

    if (files.size === 0) return;

    // Color coding: 0 = white (unvisited), 1 = gray (visiting), 2 = black (visited)
    const colors = new Map<string, number>();

    // Initialize all nodes as white (unvisited)
    for (const [filePath] of files) {
      colors.set(filePath, 0);
    }

    // DFS function to detect cycles
    const hasCycleDFS = (filePath: string): boolean => {
      const color = colors.get(filePath);

      // If gray (currently being visited), we found a back edge = cycle
      if (color === 1) return true;

      // If black (already visited), skip
      if (color === 2) return false;

      // Mark as gray (visiting)
      colors.set(filePath, 1);

      // Check all dependencies
      const file = files.get(filePath);
      if (file && file.props.dependencies) {
        for (const dependency of file.props.dependencies) {
          // Only check dependencies that exist in our graph (internal dependencies)
          if (files.has(dependency.props.name)) {
            if (hasCycleDFS(dependency.props.name)) {
              return true; // Cycle detected
            }
          }
        }
      }

      // Mark as black (visited)
      colors.set(filePath, 2);
      return false;
    };

    // Check for cycles starting from each unvisited node
    for (const [filePath] of files) {
      if (colors.get(filePath) === 0) {
        // If white (unvisited)
        if (hasCycleDFS(filePath)) {
          throw new NotificationError(this.props.ruleConstruction, []);
        }
      }
    }
  }
}
