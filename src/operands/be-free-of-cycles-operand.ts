import { Edge } from '@/edge';
import { Graph } from '@/graph';
import { Operand } from '@/operands/operand';

export class BeFreeOfCyclesOperand extends Operand<null> {
  private _colors!: Map<string, 0 | 1 | 2>;
  private _graph!: Graph;

  constructor() {
    super(null);
  }

  public set colors(colors: Map<string, 0 | 1 | 2>) {
    this._colors = colors;
  }

  public get colors(): Map<string, 0 | 1 | 2> {
    return this._colors;
  }

  public set graph(graph: Graph) {
    this._graph = graph;
  }

  public get graph(): Graph {
    return this._graph;
  }

  public errorMessage(edge: Edge, negated: boolean): string {
    if (negated) {
      return `File ${edge.name} has cycles`;
    }
    return `File ${edge.name} does not have cycles`;
  }

  public validate(edge: Edge, negated: boolean): boolean {
    const hasCycleDFS = (path: string, colors: Map<string, number>): boolean => {
      const color = colors.get(path);

      // If gray (currently being visited), we found a back edge = cycle
      if (color === 1) return true;

      // If black (already visited), skip
      if (color === 2) return false;

      // Mark as gray (visiting)
      colors.set(path, 1);

      // Check all dependencies
      const edge = this.graph.edges.get(path);
      if (edge && edge.dependencies) {
        for (const dependency of edge.dependencies) {
          // Only check dependencies that exist in our graph (internal dependencies)
          if (this.graph.edges.has(dependency.name)) {
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

    const has = hasCycleDFS(edge.path, this.colors);

    return negated ? !has : has;
  }
}
