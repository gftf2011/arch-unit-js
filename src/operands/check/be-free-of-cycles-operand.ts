import { Edge } from '@/edge';
import { Graph } from '@/graph';
import { CheckOperand, INPUT, OUTPUT } from '@/operands/check-operand';

export class BeFreeOfCyclesOperand extends CheckOperand<null> {
  private _graph!: Graph;
  private _colors!: Map<string, 0 | 1 | 2>;

  constructor() {
    super(null);
  }

  protected override getError(edge: Edge, negated: boolean): Error {
    if (negated) return new Error(`File ${edge.name} has cycles`);
    return new Error(`File ${edge.name} does not have cycles`);
  }

  protected override validate(edge: Edge, negated: boolean): boolean {
    const hasCycleDFS = (path: string, colors: Map<string, number>): boolean => {
      const color = colors.get(path);

      // If gray (currently being visited), we found a back edge = cycle
      if (color === 1) return true;

      // If black (already visited), skip
      if (color === 2) return false;

      // Mark as gray (visiting)
      colors.set(path, 1);

      // Check all dependencies
      const edge = this._graph.edges.get(path);
      if (edge && edge.dependencies) {
        for (const dependency of edge.dependencies) {
          // Only check dependencies that exist in our graph (internal dependencies)
          if (this._graph.edges.has(dependency.name)) {
            if (hasCycleDFS(dependency.name, colors)) {
              return true; // Cycle detected
            }
          }
        }
      }

      // Mark as black (visited)
      colors.set(path, 2);
      return false;
    };

    const has = hasCycleDFS(edge.path, this._colors);

    return negated ? !has : has;
  }

  public override check(input: INPUT): OUTPUT {
    this._graph = input.graph;

    const edges = input.graph.edges;
    if (edges.size === 0) return this._notificationError;

    // Color coding: 0 = white (unvisited), 1 = gray (visiting), 2 = black (visited)
    this._colors = new Map<string, 0 | 1 | 2>();

    // Initialize all nodes as white (unvisited)
    for (const edge of edges.values()) this._colors.set(edge.path, 0);

    // Check for cycles starting from each unvisited node
    for (const edge of edges.values()) {
      if (this._colors.get(edge.path) === 0) {
        // If white (unvisited)
        if (!this.validate(edge, input.negated))
          this._notificationError.addError(this.getError(edge, input.negated));
      }
    }

    return this._notificationError;
  }
}
