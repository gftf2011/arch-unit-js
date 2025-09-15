// import { Edge } from '@/edge';

import { NotificationError } from '@/errors/notification-error';

export class Operand<T> {
  constructor(
    protected readonly _value: T,
    protected readonly _notificationError: NotificationError = new NotificationError(),
  ) {}

  public get value(): T {
    return this._value;
  }

  // public abstract errorMessage(Edge: Edge, negated: boolean): string;

  // public abstract validate(edge: Edge, negated: boolean): boolean;
}
