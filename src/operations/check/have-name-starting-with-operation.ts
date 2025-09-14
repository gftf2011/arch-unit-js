import { HaveNameStartingWithOperand } from '@/operands/have-name-starting-with-operand';
import { CheckOperation } from '@/operations/check-operation';

export class HaveNameStartingWithOperation extends CheckOperation<string> {
  constructor(negated: boolean, operand: HaveNameStartingWithOperand) {
    super(negated, operand);
  }

  override async positive(): Promise<void> {
    for (const edge of this.graph.edges) {
      if (!this.operand.check(edge.name)) {
        throw new Error(`File ${edge.name} does not starts with pattern ${this.operand.value}`);
      }
    }
  }

  override async negative(): Promise<void> {
    for (const edge of this.graph.edges) {
      if (this.operand.check(edge.name)) {
        throw new Error(`File ${edge.name} starts with pattern ${this.operand.value}`);
      }
    }
  }
}
