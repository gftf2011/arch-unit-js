export interface Check {
  check(): Promise<void> | void;
}
