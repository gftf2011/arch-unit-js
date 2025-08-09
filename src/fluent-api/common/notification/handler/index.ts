export class NotificationHandler {
  private constructor(private readonly errors: Error[] = []) {}

  public static create(): NotificationHandler {
    return new NotificationHandler();
  }

  public static createWithErrors(errors: Error[]): NotificationHandler {
    return new NotificationHandler(errors);
  }

  public addError(error: Error): void {
    this.errors.push(error);
  }

  public addErrors(errors: Error[]): void {
    for (const error of errors) {
      this.addError(error);
    }
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  public getErrors(): Error[] {
    return this.errors;
  }
}
