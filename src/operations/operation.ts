import { Operand } from '@/operands/operand';

export abstract class Operation<T> {
  private _graph: any = null;

  constructor(
    protected readonly negated: boolean,
    protected readonly operand: Operand<T>,
  ) {}

  public set graph(_graph: any) {
    this._graph = _graph;
  }

  public get graph(): any {
    return this._graph;
  }
}
