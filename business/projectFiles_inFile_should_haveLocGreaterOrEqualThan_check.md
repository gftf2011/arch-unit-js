# Project Files in File Should Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: The selected file must have more or equal lines of code than the specified threshold. The rule passes only when the file's actual code line count is greater than or equal to the defined minimum limit.

- It is NOT OK if the file has lines of code less than the threshold
- It is OK if the file has lines of code greater than or equal to the threshold

This rule enforces a minimum implementation size for a specific file, helping to prevent:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic

**Note**: The `should.haveLocGreaterOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive (the file must have GREATER than or EQUAL to the specified number).

**Note**: The `should.haveLocGreaterOrEqualThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

- Selected file = one concrete file path (via `inFile(...)`)

**Scenario 1**: File has lines of code GREATER than or EQUAL to the threshold

- **Result**: ✅ PASS - The file meets or exceeds the minimum size requirement

**Scenario 2**: File has lines of code LESS than the threshold

- **Result**: ❌ FAIL - The file violates the minimum size requirement

## Scenario Examples

### Scenario 1: File has lines of code GREATER than or EQUAL to the threshold

```
project/
├── src/
│   └── services/
│       └── EmailService.ts   // 19 LOC (above threshold 15)
```

**File Content:**

```typescript
// src/services/EmailService.ts (18 lines of code - above threshold)
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
    return true; // LOC 18
  } // LOC 19
}
```

**API Usage:**

```typescript
projectFiles().inFile('**/services/EmailService.ts').should().haveLocGreaterOrEqualThan(15).check();
```

**Result**: ✅ PASS - `EmailService.ts` has 19 LOC which is ≥ 15

---

### Scenario 2: File has lines of code LESS than the threshold

```
project/
├── src/
│   └── services/
│       └── StubService.ts   // 13 LOC (below threshold 15)
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
  } // LOC 3

  async process(): Promise<void> {
    // LOC 4
    throw new Error('Not implemented'); // LOC 5
  } // LOC 6

  getStatus(): string {
    // LOC 7
    return 'pending'; // LOC 8
  } // LOC 9

  validate(): boolean {
    // LOC 10
    return false; // LOC 11
  } // LOC 12
} // LOC 13
```

**API Usage:**

```typescript
projectFiles().inFile('**/services/StubService.ts').should().haveLocGreaterOrEqualThan(15).check();
```

**Result**: ❌ FAIL - `StubService.ts` has 13 LOC which is < 15

---

### Key Difference from `should.haveLocGreaterThan`:

- **`should.haveLocGreaterThan(15)`**: File must have > 15 LOC (exclusive minimum)
- **`should.haveLocGreaterOrEqualThan(15)`**: File can have ≥ 15 LOC (inclusive minimum)

Use `should.haveLocGreaterOrEqualThan` when you want the minimum to be inclusive of the exact threshold value for a single file.
