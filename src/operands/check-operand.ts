import { Check } from '@/common/check';
import { Edge } from '@/edge';
import { NotificationError } from '@/errors/notification-error';
import { Graph } from '@/graph';
import { Operand } from '@/operands/operand';

export type INPUT = { graph: Graph; negated: boolean };
export type OUTPUT = NotificationError;

export abstract class CheckOperand<T> extends Operand<T> implements Check<INPUT, OUTPUT> {
  constructor(value: T) {
    super(value);
  }

  protected abstract getError(edge: Edge, negated: boolean): Error;

  protected abstract validate(edge: Edge, negated: boolean): boolean;

  public check(input: INPUT): OUTPUT {
    for (const edge of input.graph.edges.values()) {
      if (!this.validate(edge, input.negated))
        this._notificationError.addError(this.getError(edge, input.negated));
    }
    return this._notificationError;
  }
}
