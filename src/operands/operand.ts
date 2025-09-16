import { NotificationError } from '@/errors/notification-error';

export class Operand<T> {
  constructor(
    protected readonly _value: T,
    protected readonly _notificationError: NotificationError = new NotificationError(),
  ) {}

  public get value(): T {
    return this._value;
  }
}
