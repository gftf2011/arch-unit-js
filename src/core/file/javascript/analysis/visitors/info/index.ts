import { DependencyResolvedWith } from '../../../../../dependency';

export type ResolveDependenciesVisitorInfo = {
  totalImportedDependencies: number;
  totalRequiredDependencies: number;
  totalDinamicImportedDependencies: number;
  addDependency: (dependencyName: string, type: DependencyResolvedWith) => void;
};
