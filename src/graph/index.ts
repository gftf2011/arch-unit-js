import { Edge } from '@/edge';

export class Graph {
  constructor(public readonly edges: Map<string, Edge>) {}
}
