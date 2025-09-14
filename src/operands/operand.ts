import { Edge } from "@/edge";

export abstract class Operand<T> {
  constructor(private _value: T) {}

  public get value(): T {
    return this._value;
  }

  public set value(_value: T) {
    this._value = _value;
  }

  public abstract errorMessage(Edge: Edge, negated: boolean): string;

  public abstract check(edge: Edge, negated: boolean): boolean;
}
