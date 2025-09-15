export class Edge {
  constructor(
    public readonly name: string,
    public readonly path: string,
    public readonly dependencies: any[],
  ) {}
}
