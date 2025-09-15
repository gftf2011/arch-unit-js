import { Edge } from '@/edge';
import { CheckOperand } from '@/operands/check-operand';

export class HaveNameEndingWithOperand extends CheckOperand<string> {
  constructor(value: string) {
    super(value);
  }

  protected override getError(edge: Edge, negated: boolean): Error {
    if (negated) return new Error(`File ${edge.name} name ends with pattern ${this.value}`);
    return new Error(`File ${edge.name} name does not end with pattern ${this.value}`);
  }

  protected override validate(edge: Edge, negated: boolean): boolean {
    const ends = edge.name.endsWith(this.value);
    return negated ? !ends : ends;
  }
}
