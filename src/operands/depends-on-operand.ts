import { GlobPattern } from '@/common/types';
import { Edge } from '@/edge';
import { Operand } from '@/operands/operand';
import micromatch from 'micromatch';

export class DependsOnOperand extends Operand<GlobPattern[]> {
  constructor(value: GlobPattern[]) {
    super(value);
  }

  override errorMessage(edge: Edge, negated: boolean): string {
    if (negated) {
      return `File ${edge.name} does not depend on [${this.value.join(', ')}]`;
    }
    return `File ${edge.name} depends on [${this.value.join(', ')}]`;
  }

  override validate(edge: Edge, negated: boolean): boolean {
    if (edge.dependencies.length === 0) return negated ? true : false;
    const names: string[] = edge.dependencies.map((dependency) => dependency.name);
    const has = micromatch(names, this.value).length > 0;
    return negated ? !has : has;
  }
}
