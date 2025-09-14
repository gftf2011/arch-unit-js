export class Argument {
  private constructor(
    private label: string = '',
    private values: string[] = [],
  ) {
    this.label = label;
  }

  public static create(): Argument {
    return new Argument();
  }

  setLabel(label: string): Argument {
    this.label = label;
    return this;
  }

  getLabel(): string {
    return this.label;
  }

  setValues(values: string[]): Argument {
    this.values = values;
    return this;
  }

  getValues(): string[] {
    return this.values;
  }
}
