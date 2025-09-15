import micromatch from 'micromatch';

import { GlobPattern } from '@/common/types';
import { CheckOperand } from '@/operands/check-operand';
import { Edge } from '@/edge';

export class DependsOnOperand extends CheckOperand<GlobPattern[]> {
  constructor(value: GlobPattern[]) {
    super(value);
  }

  protected override getError(edge: Edge, negated: boolean): Error {
    if (negated)
      return new Error(`File ${edge.name} does not depend on [${this.value.join(', ')}]`);
    return new Error(`File ${edge.name} depends on [${this.value.join(', ')}]`);
  }

  protected override validate(edge: Edge, negated: boolean): boolean {
    if (edge.dependencies.length === 0) return negated ? true : false;
    const names: string[] = edge.dependencies.map((dependency) => dependency.name);
    const has = micromatch(names, this.value).length > 0;
    return negated ? !has : has;
  }
}
