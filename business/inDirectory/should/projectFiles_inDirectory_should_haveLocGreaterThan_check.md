# Project Files in Directory Should Have Greater L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the directory must have more lines of code than the specified threshold. The rule passes only when every file's actual code line count is above the defined minimum limit.

- It is NOT OK if ANY file has lines of code less than or equal to the threshold
- It is OK if ALL files have lines of code greater than the threshold

This rule enforces minimum code complexity and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `should.haveLocGreaterThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have GREATER than the specified number, not equal to).

**Note**: The `should.haveLocGreaterThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code GREATER than the threshold

- **Result**: ✅ PASS - All files meet the minimum size requirement

**Scenario 2**: ANY files have lines of code LESS than or EQUAL to the threshold

- **Result**: ❌ FAIL - Files violate the minimum size requirement

## Scenario Examples

### Scenario 1: All files have lines of code GREATER than the threshold

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 27 LOC (above threshold)
│   │   ├── EmailService.ts    // 18 LOC (above threshold)
│   │   └── PaymentService.ts  // 32 LOC (above threshold)
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
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').should().haveLocGreaterThan(15).check();
```

**Result**: ✅ PASS - All files (27, 18, 32, 45 LOC) are greater than 15 lines of code

### Scenario 2: ANY files have lines of code LESS than or EQUAL to the threshold

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 25 LOC (above threshold)
│   │   ├── StubService.ts     // 13 LOC (below threshold)
│   │   └── PaymentService.ts  // 32 LOC (above threshold)
│   ├── utils/
│   │   ├── Constants.ts       // 15 LOC (equals threshold)
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

// src/utils/Constants.ts (exactly 15 lines of code - equals threshold)
/**
 * Application constants and configuration
 */
export const API_CONFIG = {
  // LOC 1
  BASE_URL: 'https://api.example.com', // LOC 2
  TIMEOUT: 5000, // LOC 3
  RETRY_ATTEMPTS: 3, // LOC 4
}; // LOC 5

export const UI_CONSTANTS = {
  // LOC 6
  MAX_FILE_SIZE: 10 * 1024 * 1024, // LOC 7
  SUPPORTED_FORMATS: ['jpg', 'png', 'pdf'], // LOC 8
}; // LOC 9

export const ERROR_MESSAGES = {
  // LOC 10
  VALIDATION_FAILED: 'Validation failed', // LOC 11
  NETWORK_ERROR: 'Network connection error', // LOC 12
  UNAUTHORIZED: 'Unauthorized access', // LOC 13
  NOT_FOUND: 'Resource not found', // LOC 14
}; // LOC 15

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
projectFiles().inDirectory('**/src/**').should().haveLocGreaterThan(15).check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: StubService.ts (13 LOC), Constants.ts (15 LOC - equals threshold), Helpers.ts (9 LOC) are less than or equal to the 15-line minimum

Use `should.haveLocGreaterThan` when you want to enforce a strict minimum where files cannot have exactly the threshold number of lines or fewer, ensuring all files meet a substantial implementation standard.
