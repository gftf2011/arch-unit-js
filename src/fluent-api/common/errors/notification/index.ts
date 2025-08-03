export class NotificationError extends Error {
    constructor(rule: string[], public readonly errors: Error[]) {
        const newRule: string = 'Violation - ' + rule.join(' ');
        const errorMessages: string = errors.map(error => error.message).join('\n');
        const message: string = `${newRule}\n\n${errorMessages}`;
        super(message);
    }
}