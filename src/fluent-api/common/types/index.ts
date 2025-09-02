export type Options = {
  extensionTypes: string[];
  includeMatcher: string[];
  ignoreMatcher?: string[];
  typescriptPath?: string;
  webpack?: {
    path: string;
    names?: string[];
  };
};

export type MatchableProps = {
  negated: boolean;
  rootDir: string;
  filteringPatterns: string[];
  options: Options;
  excludePattern: string[];
  ruleConstruction: string[];
};

export type ProjectSizeAnalysisProps = MatchableProps & {
  percentageThreshold: number;
};

export type LOCAnalysisProps = MatchableProps & {
  analisisThreshold: number;
};

export type PatternMatchableProps = MatchableProps & {
  checkingPatterns: string[];
};

export interface Checkable {
  check(): Promise<void>;
}
