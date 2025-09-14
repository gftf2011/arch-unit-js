import { Edge } from '@/edge';
import { Operand } from '@/operands/operand';

export class HaveNameEndingWithOperand extends Operand<string> {
  constructor(value: string) {
    super(value);
  }

  override errorMessage(edge: Edge, negated: boolean): string {
    if (negated) {
      return `File ${edge.name} name ends with pattern ${this.value}`;
    }
    return `File ${edge.name} name does not end with pattern ${this.value}`;
  }

  override check(edge: Edge, negated: boolean): boolean {
    const ends = edge.name.endsWith(this.value);
    return negated ? !ends : ends;
  }
}
