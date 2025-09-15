export class NotificationError extends Error {
  private readonly errors: Error[] = [];
  constructor() {
    super();
    this.name = NotificationError.name;
    this.message = 'Notification Error';
  }

  public addError(error: Error): void {
    this.errors.push(error);
  }

  public getErrors(): Error[] {
    return this.errors;
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }
}
