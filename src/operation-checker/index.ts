import { Argument } from "@/common/argument";
import { Check } from "@/common/check";
import { Options } from "@/common/options";
import { ProjectType } from "@/common/types";
import { Graph } from "@/graph";
import { CheckOperation } from "@/operations/check-operation";

export class OperationChecker implements Check {
    constructor(
        private readonly projectType: ProjectType,
        private readonly options: Options,
        private readonly rules: string[],
        private readonly args: Argument[],
        private readonly operations: CheckOperation<any>[],
    ) {}

    async check(): Promise<void> {
        const graph: Graph = new Graph([]);

        // Build graph

        for (const operation of this.operations) {
            operation.graph = graph;
            operation.check();
        }

        throw new Error("Method not implemented.");
    }
}