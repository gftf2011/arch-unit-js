export interface Check<INPUT, OUTPUT> {
  check(input: INPUT): OUTPUT;
}

export interface NullaryCheck<OUTPUT> extends Check<null, OUTPUT> {
  check(): OUTPUT;
}

export interface UnitCheck<INPUT> extends Check<INPUT, void | Promise<void>> {
  check(input: INPUT): void | Promise<void>;
}
