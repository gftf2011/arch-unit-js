import { Resolvable } from '@/core/dependency/common';

export interface Iterator<T> {
  add(item: T): void;
  get(): T | null;
  next(): T;
  resolved(): boolean;
}

export class ResolvableIterator implements Iterator<Resolvable> {
  private index: number = 0;
  private readonly resolvables: Resolvable[] = [];

  public add(item: Resolvable): void {
    this.resolvables.push(item);
  }

  public get(): Resolvable | null {
    return this.resolvables[this.index];
  }

  public next(): Resolvable {
    return this.resolvables[this.index++];
  }

  public resolved(): boolean {
    return this.resolvables[this.index].resolve().status === 'resolved';
  }
}
