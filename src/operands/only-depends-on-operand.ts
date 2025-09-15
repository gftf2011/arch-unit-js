import { GlobPattern } from '@/common/types';
import { Edge } from '@/edge';
import { Operand } from '@/operands/operand';
import micromatch from 'micromatch';

export class OnlyDependsOnOperand extends Operand<GlobPattern[]> {
  constructor(value: GlobPattern[]) {
    super(value);
  }

  override errorMessage(edge: Edge, negated: boolean): string {
    if (negated) {
      return `File ${edge.name} does not only depends on [${this.value.join(', ')}]`;
    }
    return `File ${edge.name} only depends on [${this.value.join(', ')}]`;
  }

  override validate(edge: Edge, negated: boolean): boolean {
    if (edge.dependencies.length === 0) return true;
    const matchingDependencies = edge.dependencies.filter(
      (dependency) => micromatch([dependency.name], this.value).length > 0,
    );
    if (negated) return matchingDependencies.length < edge.dependencies.length;
    return !(matchingDependencies.length !== edge.dependencies.length);
  }
}
