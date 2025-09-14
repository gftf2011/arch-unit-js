import { Edge } from '@/edge';
import { Operand } from '@/operands/operand';

export class HaveNameStartingWithOperand extends Operand<string> {
  constructor(value: string) {
    super(value);
  }

  override errorMessage(edge: Edge, negated: boolean): string {
    if (negated) {
      return `File ${edge.name} name starts with pattern ${this.value}`;
    }
    return `File ${edge.name} name does not start with pattern ${this.value}`;
  }

  override check(edge: Edge, negated: boolean): boolean {
    const starts = edge.name.startsWith(this.value);
    return negated ? !starts : starts;
  }
}
