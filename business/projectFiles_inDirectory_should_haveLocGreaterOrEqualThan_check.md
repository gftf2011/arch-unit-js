# Project Files in Directory Should Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the directory must have more or equal lines of code than the specified threshold. The rule passes only when every file's actual code line count is greater than or equal to the defined minimum limit.

- It is NOT OK if ANY file has lines of code less than the threshold
- It is OK if ALL files have lines of code greater than or equal to the threshold

This rule enforces minimum code complexity and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `should.haveLocGreaterOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive (files must have GREATER than or EQUAL to the specified number).

**Note**: The `should.haveLocGreaterOrEqualThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code GREATER than or EQUAL to the threshold

- **Result**: ✅ PASS - All files meet the minimum size requirement

**Scenario 2**: ANY files have lines of code LESS than the threshold

- **Result**: ❌ FAIL - Files violate the minimum size requirement

## Scenario Examples

### Scenario 1: All files have lines of code GREATER than or EQUAL to the threshold

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 25 LOC (above threshold)
│   │   ├── EmailService.ts    // 27 LOC (above threshold)
│   │   └── PaymentService.ts  // 16 LOC (equals threshold)
│   └── components/
│       └── DataTable.ts       // 45 LOC (above threshold)
```

**File Content:**

```typescript
// src/services/EmailService.ts (27 lines of code - above threshold)
/**
 * Email service for sending notifications
 */
import { User } from '../models/User'; // LOC 1
import { Template } from '../models/Template'; // LOC 2

export class EmailService {
  // LOC 3
  private apiKey: string; // LOC 4
  private baseUrl: string; // LOC 5

  constructor(apiKey: string) {
    // LOC 6
    this.apiKey = apiKey; // LOC 7
    this.baseUrl = 'https://email-api.example.com'; // LOC 8
  } // LOC 9

  async sendWelcomeEmail(user: User): Promise<boolean> {
    // LOC 10
    const template = this.getWelcomeTemplate(user.name); // LOC 11
    return await this.sendEmail(user.email, template); // LOC 12
  } // LOC 13

  async sendPasswordResetEmail(user: User, token: string): Promise<boolean> {
    // LOC 14
    const template = this.getPasswordResetTemplate(user.name, token); // LOC 15
    return await this.sendEmail(user.email, template); // LOC 16
  } // LOC 17

  private getWelcomeTemplate(name: string): Template {
    // LOC 18
    return { subject: 'Welcome!', body: `Hello ${name}` }; // LOC 19
  } // LOC 20

  private getPasswordResetTemplate(name: string, token: string): Template {
    // LOC 21
    return { subject: 'Reset Password', body: `Hi ${name}, reset: ${token}` }; // LOC 22
  } // LOC 23

  private async sendEmail(to: string, template: Template) {
    // LOC 24
    // Implementation would go here
    return true; // LOC 25
  } // LOC 26
} // LOC 27

// src/services/PaymentService.ts (exactly 16 lines of code - equals threshold)
/**
 * Payment processing service
 */
export class PaymentService {
  // LOC 1
  private apiKey: string; // LOC 2

  constructor(apiKey: string) {
    // LOC 3
    this.apiKey = apiKey; // LOC 4
  } // LOC 5

  async processPayment(amount: number): Promise<boolean> {
    // LOC 6
    const payload = this.createPayload(amount); // LOC 7
    return await this.sendRequest(payload); // LOC 8
  } // LOC 9

  private createPayload(amount: number): any {
    // LOC 10
    return { amount, currency: 'USD', apiKey: this.apiKey }; // LOC 11
  } // LOC 12

  private async sendRequest(payload: any): Promise<boolean> {
    // LOC 13
    // Implementation would go here
    return true; // LOC 14
  } // LOC 15
} // LOC 16
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').should().haveLocGreaterOrEqualThan(16).check();
```

**Result**: ✅ PASS - All files (25, 27, 16, 45 LOC) are greater than or equal to 16 lines of code

### Scenario 2: ANY files have lines of code LESS than the threshold

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 25 LOC (above threshold)
│   │   ├── StubService.ts     // 13 LOC (below threshold)
│   │   └── PaymentService.ts  // 16 LOC (equals threshold)
│   ├── utils/
│   │   ├── Constants.ts       // 18 LOC (above threshold)
│   │   └── Helpers.ts         // 9 LOC (below threshold)
│   └── components/
│       └── DataTable.ts       // 45 LOC (above threshold)
```

**File Content:**

```typescript
// src/services/StubService.ts (only 13 lines of code - below threshold)
/**
 * Placeholder service - needs implementation
 */
export class StubService {
  // LOC 1
  constructor() {
    // LOC 2
    // TODO: Add initialization logic
  } // LOC 3

  async process(): Promise<void> {
    // LOC 4
    // TODO: Implement processing logic
    throw new Error('Not implemented'); // LOC 5
  } // LOC 6

  validate(): boolean {
    // LOC 7
    return false; // LOC 8
  } // LOC 9

  getStatus(): string {
    // LOC 10
    return 'pending'; // LOC 11
  } // LOC 12
} // LOC 13

// src/services/PaymentService.ts (exactly 16 lines of code - equals threshold)
/**
 * Payment processing service
 */
export class PaymentService {
  // LOC 1
  private apiKey: string; // LOC 2

  constructor(apiKey: string) {
    // LOC 3
    this.apiKey = apiKey; // LOC 4
  } // LOC 5

  async processPayment(amount: number): Promise<boolean> {
    // LOC 6
    const payload = this.createPayload(amount); // LOC 7
    return await this.sendRequest(payload); // LOC 8
  } // LOC 9

  private createPayload(amount: number): any {
    // LOC 10
    return { amount, currency: 'USD', apiKey: this.apiKey }; // LOC 11
  } // LOC 12

  private async sendRequest(payload: any): Promise<boolean> {
    // LOC 13
    // Implementation would go here
    return true; // LOC 14
  } // LOC 15
} // LOC 16

// src/utils/Helpers.ts (only 9 lines of code - below threshold)
// Simple utility functions
export function formatDate(date: Date): string {
  // LOC 1
  return date.toISOString().split('T')[0]; // LOC 2
} // LOC 3

export function generateId(): string {
  // LOC 4
  return Math.random().toString(36).substr(2, 9); // LOC 5
} // LOC 6

export function isEmpty(value: any): boolean {
  // LOC 7
  return value == null || value === ''; // LOC 8
} // LOC 9
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').should().haveLocGreaterOrEqualThan(16).check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: StubService.ts (13 LOC), Helpers.ts (9 LOC) are less than the 15-line minimum

### Key Difference from `should.haveLocGreaterThan`:

- **`should.haveLocGreaterThan(15)`**: Files must have > 15 LOC (exclusive minimum)
- **`should.haveLocGreaterOrEqualThan(15)`**: Files can have ≥ 15 LOC (inclusive minimum)

Use `should.haveLocGreaterOrEqualThan` when you want to enforce a minimum where files can have exactly the threshold number of lines, making it slightly more permissive than the strict `should.haveLocGreaterThan` rule.
