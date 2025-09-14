import { GlobPattern } from '@/common/types';
import { HaveNameOperand } from '@/operands/have-name-operand';
import { CheckOperation } from '@/operations/check-operation';

export class HaveNameOperation extends CheckOperation<GlobPattern> {
  constructor(negated: boolean, operand: HaveNameOperand) {
    super(negated, operand);
  }

  override async positive(): Promise<void> {
    for (const edge of this.graph.edges) {
      if (!this.operand.check(edge.name)) {
        throw new Error(`File ${edge.name} does not match pattern ${this.operand.value}`);
      }
    }
  }

  override async negative(): Promise<void> {
    for (const edge of this.graph.edges) {
      if (this.operand.check(edge.name)) {
        throw new Error(`File ${edge.name} matches pattern ${this.operand.value}`);
      }
    }
  }
}
