# Project Files in File Should NOT Have Less L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: The selected file must NOT have fewer lines of code than the specified threshold. The rule passes only when the file's actual code line count is greater than or equal to the defined minimum limit.

- It is NOT OK if the file has lines of code less than the threshold
- It is OK if the file has lines of code greater than or equal to the threshold

This rule enforces minimum code complexity and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `shouldNot.haveLocLessThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is inclusive minimum (file must have GREATER than or EQUAL to the specified number).

**Note**: The `shouldNot.haveLocLessThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

**Scenario 1**: File has lines of code GREATER than or EQUAL to the threshold

- **Result**: ✅ PASS — The file meets the minimum size requirement

**Scenario 2**: File has lines of code LESS than the threshold

- **Result**: ❌ FAIL — The file violates the minimum size requirement

## Scenario Examples

### Scenario 1: File has lines of code GREATER than or EQUAL to the threshold

```
project/
└── src/
    └── services/
        └── EmailService.ts  // 17 LOC (equals threshold 17)
```

**File Content:**

```typescript
// src/services/EmailService.ts (exactly 17 lines of code)
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
} // LOC 17
```

**API Usage:**

```typescript
projectFiles().inFile('**/services/EmailService.ts').shouldNot().haveLocLessThan(17).check();
```

**Result**: ✅ PASS — `EmailService.ts` has 17 LOC which is ≥ 17

---

### Scenario 2: File has lines of code LESS than the threshold

```
project/
└── src/
    └── utils/
        └── Constants.ts  // 3 LOC (below threshold 10)
```

**File Content:**

```typescript
// src/utils/Constants.ts (only 3 lines of code - below threshold)
export const API_URL = 'https://api.example.com'; // LOC 1
export const TIMEOUT = 5000; // LOC 2
export const VERSION = '1.0.0'; // LOC 3
```

**API Usage:**

```typescript
projectFiles().inFile('**/utils/Constants.ts').shouldNot().haveLocLessThan(10).check();
```

**Result**: ❌ FAIL — `Constants.ts` has 3 LOC, which is below the 10-line minimum
