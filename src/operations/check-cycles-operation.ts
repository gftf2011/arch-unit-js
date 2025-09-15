import { Check } from '@/common/check';
import { CheckOperation } from './check-operation';
import { BeFreeOfCyclesOperand } from '@/operands/be-free-of-cycles-operand';

export class CheckCyclesOperation extends CheckOperation<null> implements Check {
  constructor(negated: boolean, operand: BeFreeOfCyclesOperand) {
    super(negated, operand);
  }

  public check(): void {
    const edges = this.graph.edges;

    if (edges.size === 0) return;

    // Color coding: 0 = white (unvisited), 1 = gray (visiting), 2 = black (visited)
    const colors = new Map<string, 0 | 1 | 2>();

    // Initialize all nodes as white (unvisited)
    for (const edge of edges.values()) {
      colors.set(edge.path, 0);
    }

    (this.operand as BeFreeOfCyclesOperand).colors = colors;
    (this.operand as BeFreeOfCyclesOperand).graph = this.graph;

    // Check for cycles starting from each unvisited node
    for (const edge of edges.values()) {
      if (colors.get(edge.path) === 0) {
        // If white (unvisited)
        if (!this.operand.validate(edge, this.negated)) {
          throw new Error(this.operand.errorMessage(edge, this.negated));
        }
      }
    }
  }
}
