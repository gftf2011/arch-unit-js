import micromatch from 'micromatch';

import { Operand } from '@/operands/operand';
import { GlobPattern } from '@/common/types';
import { Edge } from '@/edge';

export class HaveNameOperand extends Operand<GlobPattern> {
  constructor(value: GlobPattern) {
    super(value);
  }

  override errorMessage(edge: Edge, negated: boolean): string {
    if (negated) {
      return `File ${edge.name} name matches the pattern ${this.value}`;
    }
    return `File ${edge.name} name does not match the pattern ${this.value}`;
  }

  override validate(edge: Edge, negated: boolean): boolean {
    const has = micromatch([edge.name], [this.value]).length > 0;
    return negated ? !has : has;
  }
}
