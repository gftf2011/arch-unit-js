export type Options = {
  extensionTypes: string[];
  includeMatcher: string[];
  ignoreMatcher: string[];
  typescriptPath?: string;
};

export type CheckableProps = {
  negated: boolean;
  rootDir: string;
  filteringPatterns: string[];
  options: Options;
  excludePattern: string[];
  ruleConstruction: string[];
};

export type LOCAnalysisProps = CheckableProps & {
  analisisThreshold: number;
};

export type PatternCheckableProps = CheckableProps & {
  checkingPatterns: string[];
};
