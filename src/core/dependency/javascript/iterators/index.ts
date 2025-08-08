import { Resolvable } from "../../common";

export interface Iterator<T> {
    add(item: T): void;
    get(): T | null;
    next(): T | null;
    previous(): T | null;
    resolved(): boolean;
}

export class ResolvableIterator implements Iterator<Resolvable> {
    private index: number = 0;
    private resolvables: Resolvable[] = [];

    public add(item: Resolvable): void {
        this.resolvables.push(item);
    }

    public get(): Resolvable | null {
        return this.resolvables[this.index];
    }

    public next(): Resolvable | null {
        if (this.index < this.resolvables.length) {
            return this.resolvables[this.index++];
        }
        return null;
    }

    public previous(): Resolvable | null {
        if (this.index > 0) {
            return this.resolvables[--this.index];
        }
        return null;
    }

    public resolved(): boolean {
        return this.resolvables[this.index].resolve().status === 'resolved';
    }
}