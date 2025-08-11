export type DefaultExportInfo = {
  hasDefaultExport: boolean;
};

export type ImportDeclarationInfo = {
  totalImportedDependencies: number;
  addDependency: (dependencyName: string) => void;
};

export type CallExpressionInfo = {
  totalRequiredDependencies: number;
  totalDinamicImportedDependencies: number;
  addDependency: (dependencyName: string) => void;
};
