import { Dependency } from '@/core/dependency';

export type JavascriptOrTypescriptRelatedFileType = 'javascript-file' | 'typescript-file';
export type FileType = 'file' | JavascriptOrTypescriptRelatedFileType;

export enum AnalysisType {
  LOC = 'LOC_ANALYSIS',
  DEPENDENCIES = 'DEPENDENCIES_ANALYSIS',
  NAME_ANALYSIS = 'NAME_ANALYSIS',
}

export type BaseProps = {
  name: string;
  path: string;
  type: FileType;
  loc: number;
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
  protected constructor(public props: BaseProps) {}

  public abstract build(buildableProps: BaseBuildableProps): Promise<Base>;
}
