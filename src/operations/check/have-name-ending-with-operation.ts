import { HaveNameEndingWithOperand } from '@/operands/have-name-ending-with-operand';
import { CheckOperation } from '@/operations/check-operation';

export class HaveNameEndingWithOperation extends CheckOperation<string> {
  constructor(negated: boolean, operand: HaveNameEndingWithOperand) {
    super(negated, operand);
  }

  override async positive(): Promise<void> {
    for (const edge of this.graph.edges) {
      if (!this.operand.check(edge.name)) {
        throw new Error(`File ${edge.name} does not ends with pattern ${this.operand.value}`);
      }
    }
  }

  override async negative(): Promise<void> {
    for (const edge of this.graph.edges) {
      if (this.operand.check(edge.name)) {
        throw new Error(`File ${edge.name} ends with pattern ${this.operand.value}`);
      }
    }
  }
}
