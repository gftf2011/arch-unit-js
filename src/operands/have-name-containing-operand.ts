import { Edge } from '@/edge';
import { Operand } from '@/operands/operand';

export class HaveNameContainingOperand extends Operand<string> {
  constructor(value: string) {
    super(value);
  }

  override errorMessage(edge: Edge, negated: boolean): string {
    if (negated) {
      return `File ${edge.name} name contains pattern ${this.value}`;
    }
    return `File ${edge.name} name does not contain pattern ${this.value}`;
  }

  override validate(edge: Edge, negated: boolean): boolean {
    const has = edge.name.includes(this.value);
    return negated ? !has : has;
  }
}
