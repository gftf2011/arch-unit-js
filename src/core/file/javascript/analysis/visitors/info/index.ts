import { DependencyResolvedWith } from '@/core/dependency';

export type ResolveDependenciesVisitorInfo = {
  totalImportedDependencies: number;
  totalRequiredDependencies: number;
  totalDinamicImportedDependencies: number;
  addDependency: (dependencyName: string, type: DependencyResolvedWith) => void;
};

export type ClassComponent = {
  name: string;
  extendsFrom: string;
  implementsFrom: string[];
  decorators?: string[];
};

export type ClassComponentVisitorInfo = {
  classComponents: ClassComponent[];
  addClassComponent: (classComponent: ClassComponent) => void;
};
