import micromatch from 'micromatch';

import { Operand } from '@/operands/operand';
import { GlobPattern } from '@/common/types';

export class HaveNameOperand extends Operand<GlobPattern> {
  constructor(value: GlobPattern) {
    super(value);
  }

  override check(name: GlobPattern): boolean {
    return micromatch([name], [this.value]).length > 0;
  }
}
