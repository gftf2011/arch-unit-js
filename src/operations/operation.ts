import { Graph } from '@/graph';
import { Operand } from '@/operands/operand';

export abstract class Operation<T> {
  private _graph!: Graph;

  constructor(
    protected readonly negated: boolean,
    protected readonly operand: Operand<T>,
  ) {}

  public set graph(_graph: Graph) {
    this._graph = _graph;
  }

  public get graph(): Graph {
    return this._graph;
  }
}
