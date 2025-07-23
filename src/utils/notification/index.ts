export class Notification {
  private errors: Error[] = [];

  constructor() {}

  addError(error: Error): void {
    this.errors.push(error);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }
  
  getErrors(): Error[] {
    return this.errors;
  }
}