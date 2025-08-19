import { Dependency } from '@/core/dependency';

export type JavascriptOrTypescriptRelatedFileType = 'javascript-file' | 'typescript-file';
export type FileType = 'file' | JavascriptOrTypescriptRelatedFileType;

export enum AnalysisType {
  LOC = 'LOC_ANALYSIS',
  DEPENDENCIES = 'DEPENDENCIES_ANALYSIS',
  NAME_ANALYSIS = 'NAME_ANALYSIS',
  PROJECT_SIZE = 'PROJECT_SIZE_ANALYSIS',
}

export type BaseProps = {
  name: string;
  path: string;
  type: FileType;
  loc: number;
  size: number;
  totalLines: number;
  dependencies: Dependency[];
};

export type BaseBuildableProps = {
  rootDir: string;
  availableFiles: string[];
  extensions: string[];
  typescriptPath?: string;
};

export abstract class Base {
  public abstract props: BaseProps;

  protected constructor() {}

  public abstract build(buildableProps: BaseBuildableProps): Promise<Base>;
}
