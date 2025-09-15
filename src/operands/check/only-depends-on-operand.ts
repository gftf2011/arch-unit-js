import micromatch from 'micromatch';

import { GlobPattern } from '@/common/types';
import { Edge } from '@/edge';
import { CheckOperand } from '@/operands/check-operand';

export class OnlyDependsOnOperand extends CheckOperand<GlobPattern[]> {
  constructor(value: GlobPattern[]) {
    super(value);
  }

  protected override getError(edge: Edge, negated: boolean): Error {
    if (negated)
      return new Error(`File ${edge.name} does not only depends on [${this.value.join(', ')}]`);
    return new Error(`File ${edge.name} only depends on [${this.value.join(', ')}]`);
  }

  protected override validate(edge: Edge, negated: boolean): boolean {
    if (edge.dependencies.length === 0) return true;
    const matchingDependencies = edge.dependencies.filter(
      (dependency) => micromatch([dependency.name], this.value).length > 0,
    );
    if (negated) return matchingDependencies.length < edge.dependencies.length;
    return !(matchingDependencies.length !== edge.dependencies.length);
  }
}
