import { Check } from '@/common/check';
import { Operand } from '@/operands/operand';
import { Operation } from '@/operations/operation';

export class CheckOperation<T> extends Operation<T> implements Check {
  constructor(negated: boolean, operand: Operand<T>) {
    super(negated, operand);
  }

  public check(): void {
    for (const edge of this.graph.edges.values()) {
      if (!this.operand.validate(edge, this.negated)) {
        throw new Error(this.operand.errorMessage(edge, this.negated));
      }
    }
  }
}
