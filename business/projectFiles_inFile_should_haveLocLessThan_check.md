# Project Files in File Should Have Less L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: The selected file must have fewer lines of code than the specified threshold. The rule passes only when the file's actual code line count is strictly below the defined limit.

- It is NOT OK if the file has lines of code greater than or equal to the threshold
- It is OK if the file has lines of code less than the threshold

This rule promotes:

- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `should.haveLocLessThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (file must have LESS than the specified number, not equal to).

**Note**: The `should.haveLocLessThan` accepts a single numeric value as the threshold parameter.

## All Possible Scenarios

**Scenario 1**: File has lines of code LESS than the threshold

- **Result**: ✅ PASS — The file meets the size constraint

**Scenario 2**: File has lines of code GREATER than or EQUAL to the threshold

- **Result**: ❌ FAIL — The file violates the size constraint

## Scenario Examples

### Scenario 1: File has lines of code LESS than the threshold

```
project/
└── src/
    └── utils/
        └── StringHelper.ts  // 11 LOC (threshold 12)
```

**File Content:**

```typescript
// src/utils/StringHelper.ts (11 lines of actual code)
export class StringHelper {
  // LOC 1
  static capitalize(str: string): string {
    // LOC 2
    return str.charAt(0).toUpperCase() + str.slice(1); // LOC 3
  } // LOC 4

  static truncate(str: string, length: number): string {
    // LOC 5
    return str.length > length ? str.substring(0, length) + '...' : str; // LOC 6
  } // LOC 7

  static isEmpty(str: string): boolean {
    // LOC 8
    return !str || str.trim().length === 0; // LOC 9
  } // LOC 10
} // LOC 11
```

**API Usage:**

```typescript
projectFiles().inFile('**/utils/StringHelper.ts').should().haveLocLessThan(12).check();
```

**Result**: ✅ PASS — `StringHelper.ts` has 8 LOC which is < 10

---

### Scenario 2: File has lines of code GREATER than or EQUAL to the threshold

```
project/
└── src/
    └── services/
        └── EmailService.ts  // 10 LOC (equals threshold 13)
```

**File Content:**

```typescript
// src/services/EmailService.ts (exactly 13 lines of code)
import { User } from '../models/User'; // LOC 1

export class EmailService {
  // LOC 2
  private apiKey: string; // LOC 3

  constructor(apiKey: string) {
    // LOC 4
    this.apiKey = apiKey; // LOC 5
  } // LOC 6

  async sendWelcomeEmail(user: User): Promise<boolean> {
    // LOC 7
    const template = `Welcome ${user.name}!`; // LOC 8
    return await this.sendEmail(user.email, template); // LOC 9
  } // LOC 10

  private async sendEmail(to: string, template: string) {
    // LOC 10
    // Implementation would go here
    return true; // LOC 11
  } // LOC 12
} // LOC 13
```

**API Usage:**

```typescript
projectFiles().inFile('**/services/EmailService.ts').should().haveLocLessThan(10).check();
```

**Result**: ❌ FAIL — `EmailService.ts` has 13 LOC, which is not allowed (must be strictly less than 10)
