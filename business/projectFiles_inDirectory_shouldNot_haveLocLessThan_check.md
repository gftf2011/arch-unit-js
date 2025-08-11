# Project Files in Directory Should NOT Have Less L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the directory must NOT have fewer lines of code than the specified threshold. The rule passes only when every file's actual code line count is greater than or equal to the defined minimum limit.

- It is NOT OK if ANY file has lines of code less than the threshold
- It is OK if ALL files have lines of code greater than or equal to the threshold

This rule enforces minimum code complexity and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `shouldNot.haveLocLessThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive (files must have GREATER than or EQUAL to the specified number).

**Note**: The `shouldNot.haveLocLessThan` accepts a single numeric value as the minimum threshold parameter.

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
│   │   ├── EmailService.ts    // 20 LOC (equals threshold)
│   │   └── PaymentService.ts  // 32 LOC (above threshold)
│   └── components/
│       └── DataTable.ts       // 45 LOC (above threshold)
```

**File Content:**

```typescript
// src/services/EmailService.ts (exactly 20 lines of code)
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

  private getWelcomeTemplate(name: string): Template {
    // LOC 14
    return { subject: 'Welcome!', body: `Hello ${name}` }; // LOC 15
  } // LOC 16

  private async sendEmail(to: string, template: Template) {
    // LOC 17
    // Implementation would go here
    return true; // LOC 18
  } // LOC 19
} // LOC 20
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').shouldNot().haveLocLessThan(15).check();
```

**Result**: ✅ PASS - All files (25, 20, 32, 45 LOC) are greater than or equal to 15 lines of code

### Scenario 2: ANY files have lines of code LESS than the threshold

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 25 LOC (above threshold)
│   │   ├── StubService.ts     // 10 LOC (below threshold)
│   │   └── PaymentService.ts  // 32 LOC (above threshold)
│   ├── utils/
│   │   └── Constants.ts       // 3 LOC (below threshold)
│   └── components/
│       └── DataTable.ts       // 45 LOC (above threshold)
```

**File Content:**

```typescript
// src/services/StubService.ts (only 10 lines of code - below threshold)
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
} // LOC 10

// src/utils/Constants.ts (only 3 lines of code - below threshold)
// Application constants
export const API_URL = 'https://api.example.com'; // LOC 1
export const TIMEOUT = 5000; // LOC 2
export const VERSION = '1.0.0'; // LOC 3
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').shouldNot().haveLocLessThan(15).check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: StubService.ts (10 LOC), Constants.ts (3 LOC) are below the 15-line minimum
