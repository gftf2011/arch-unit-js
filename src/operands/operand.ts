export abstract class Operand<T> {
  constructor(private _value: T) {}

  public get value(): T {
    return this._value;
  }

  public set value(_value: T) {
    this._value = _value;
  }

  public abstract check(value: T): boolean;
}
