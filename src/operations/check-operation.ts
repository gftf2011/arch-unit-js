import { Check } from '@/common/check';
import { Operand } from '@/operands/operand';
import { Operation } from '@/operations/operation';

export abstract class CheckOperation<T> extends Operation<T> implements Check {
  constructor(negated: boolean, operand: Operand<T>) {
    super(negated, operand);
  }

  abstract positive(): Promise<void>;

  abstract negative(): Promise<void>;

  public async check(): Promise<void> {
    this.negated ? await this.negative() : await this.positive();
  }
}
