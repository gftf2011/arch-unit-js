import { Argument } from '@/common/argument';
import { NullaryCheck } from '@/common/check';
import { Options } from '@/common/options';
import { ProjectType } from '@/common/types';
import { Edge } from '@/edge';
import { Graph } from '@/graph';
import { CheckOperation } from '@/operations/check-operation';

export type OUTPUT = Promise<void>;

export class OperationChecker implements NullaryCheck<OUTPUT> {
  constructor(
    private readonly projectType: ProjectType,
    private readonly options: Options,
    private readonly rules: string[],
    private readonly args: Argument[],
    private readonly operations: CheckOperation<any>[],
  ) {}

  async check(): OUTPUT {
    const graph: Graph = new Graph(new Map<string, Edge>());

    // Build graph

    for (const operation of this.operations) {
      operation.graph = graph;
      operation.check();
    }

    throw new Error('Method not implemented.');
  }
}
