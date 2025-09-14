import { HaveNameContainingOperand } from '@/operands/have-name-containing-operand';
import { CheckOperation } from '@/operations/check-operation';

export class HaveNameContainingOperation extends CheckOperation<string> {
  constructor(negated: boolean, operand: HaveNameContainingOperand) {
    super(negated, operand);
  }

  override async positive(): Promise<void> {
    for (const edge of this.graph.edges) {
      if (!this.operand.check(edge.name)) {
        throw new Error(`File ${edge.name} does not contains pattern ${this.operand.value}`);
      }
    }
  }

  override async negative(): Promise<void> {
    for (const edge of this.graph.edges) {
      if (this.operand.check(edge.name)) {
        throw new Error(`File ${edge.name} contains pattern ${this.operand.value}`);
      }
    }
  }
}
