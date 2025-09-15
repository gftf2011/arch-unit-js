import micromatch from 'micromatch';

import { GlobPattern } from '@/common/types';
import { Edge } from '@/edge';
import { CheckOperand } from '@/operands/check-operand';

export class HaveNameOperand extends CheckOperand<GlobPattern> {
  constructor(value: GlobPattern) {
    super(value);
  }

  protected override getError(edge: Edge, negated: boolean): Error {
    if (negated) return new Error(`File ${edge.name} name matches the pattern ${this.value}`);
    return new Error(`File ${edge.name} name does not match the pattern ${this.value}`);
  }

  protected override validate(edge: Edge, negated: boolean): boolean {
    const has = micromatch([edge.name], [this.value]).length > 0;
    return negated ? !has : has;
  }
}
