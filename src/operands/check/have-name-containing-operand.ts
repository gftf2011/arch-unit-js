import { Edge } from '@/edge';
import { CheckOperand } from '@/operands/check-operand';

export class HaveNameContainingOperand extends CheckOperand<string> {
  constructor(value: string) {
    super(value);
  }

  protected override getError(edge: Edge, negated: boolean): Error {
    if (negated) return new Error(`File ${edge.name} name contains pattern ${this.value}`);
    return new Error(`File ${edge.name} name does not contain pattern ${this.value}`);
  }

  protected override validate(edge: Edge, negated: boolean): boolean {
    const has = edge.name.includes(this.value);
    return negated ? !has : has;
  }
}
