import { Operand } from '@/operands/operand';

export class HaveNameContainingOperand extends Operand<string> {
  constructor(value: string) {
    super(value);
  }

  override check(name: string): boolean {
    return name.includes(this.value);
  }
}
