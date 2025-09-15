import { Edge } from '@/edge';
import { CheckOperand } from '@/operands/check-operand';

export class HaveNameStartingWithOperand extends CheckOperand<string> {
  constructor(value: string) {
    super(value);
  }

  protected override getError(edge: Edge, negated: boolean): Error {
    if (negated) return new Error(`File ${edge.name} name starts with pattern ${this.value}`);
    return new Error(`File ${edge.name} name does not start with pattern ${this.value}`);
  }

  protected override validate(edge: Edge, negated: boolean): boolean {
    const starts = edge.name.startsWith(this.value);
    return negated ? !starts : starts;
  }
}
