export type JavascriptRelatedDependencyType =
  | 'node-builtin-module'
  | 'node-package'
  | 'node-dev-package'
  | 'valid-path'
  | 'invalid';
export type JavascriptRelatedDependencyResolvedWith = 'require' | 'import';
export type JavascriptRelatedDependencyComesFrom = 'javascript';

export type DependencyType = 'unknown' | JavascriptRelatedDependencyType;
export type DependencyResolvedWith = JavascriptRelatedDependencyResolvedWith;
export type DependencyComesFrom = JavascriptRelatedDependencyComesFrom;

export type DependencyProps = {
  name: string;
  type: DependencyType;
  resolvedWith: DependencyResolvedWith;
  comesFrom: DependencyComesFrom;
};

export type ResolvableDependencyProps = {
  rootDir: string;
  fileDir: string;
  availableFiles: string[];
  extensions: string[];
  typescriptPath?: string;
};

export abstract class Resolvable {
  constructor(
    public depProps: DependencyProps,
    public resolvableProps: ResolvableDependencyProps,
  ) {}
  abstract resolve(): ResolvableResponse;
}

export type ResolvableResponse = {
  status: 'resolved' | 'unresolved';
  depProps: DependencyProps;
};

export abstract class Dependency {
  protected constructor(public readonly props: DependencyProps) {}

  public abstract resolve(resolvableProps: ResolvableDependencyProps): Dependency;
}
