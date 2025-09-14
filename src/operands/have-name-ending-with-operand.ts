import { Operand } from '@/operands/operand';

export class HaveNameEndingWithOperand extends Operand<string> {
  constructor(value: string) {
    super(value);
  }

  override check(name: string): boolean {
    return this.value.endsWith(name);
  }
}
