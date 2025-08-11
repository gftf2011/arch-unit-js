# Project Files in File Should NOT Have Less Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: The selected file must NOT have fewer or equal lines of code than the specified threshold. The rule passes only when the file's actual code line count is greater than the defined minimum limit.

- It is NOT OK if the file has lines of code less than or equal to the threshold
- It is OK if the file has lines of code greater than the threshold

This rule enforces minimum code complexity and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `shouldNot.haveLocLessOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (file must have GREATER than the specified number, not equal to).

**Note**: The `shouldNot.haveLocLessOrEqualThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

**Scenario 1**: File has lines of code GREATER than the threshold

- **Result**: ✅ PASS — The file meets the minimum size requirement

**Scenario 2**: File has lines of code LESS than or EQUAL to the threshold

- **Result**: ❌ FAIL — The file violates the minimum size requirement

## Scenario Examples

### Scenario 1: File has lines of code GREATER than the threshold

```
project/
└── src/
    └── services/
        └── EmailService.ts  // 20 LOC (above threshold 15)
```

**File Content:**

```typescript
// src/services/EmailService.ts (20 lines of code - above threshold)
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
} // LOC 20
```

**API Usage:**

```typescript
projectFiles().inFile('**/services/EmailService.ts').shouldNot().haveLocLessOrEqualThan(15).check();
```

**Result**: ✅ PASS — `EmailService.ts` has 18 LOC which is > 15

---

### Scenario 2: File has lines of code LESS than or EQUAL to the threshold

```
project/
└── src/
    └── utils/
        └── Constants.ts  // 15 LOC (equals threshold 15)
```

**File Content:**

```typescript
// src/utils/Constants.ts (exactly 15 lines of code - equals threshold)
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
```

**API Usage:**

```typescript
projectFiles().inFile('**/utils/Constants.ts').shouldNot().haveLocLessOrEqualThan(15).check();
```

**Result**: ❌ FAIL — `Constants.ts` has 15 LOC, which is not allowed (must be strictly greater than 15)

### Key Difference from `shouldNot.haveLocLessThan`:

- **`shouldNot.haveLocLessThan(15)`**: File must have ≥ 15 LOC (inclusive minimum)
- **`shouldNot.haveLocLessOrEqualThan(15)`**: File must have > 15 LOC (exclusive minimum)

Use `shouldNot.haveLocLessOrEqualThan` when you want to enforce a strict minimum where the file cannot have exactly the threshold number of lines, making it more restrictive than the `shouldNot.haveLocLessThan` rule.
