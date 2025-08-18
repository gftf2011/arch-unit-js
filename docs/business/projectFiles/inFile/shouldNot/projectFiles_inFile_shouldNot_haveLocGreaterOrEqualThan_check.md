# Project Files in File Should NOT Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: The selected file must NOT have more or equal lines of code than the specified threshold. The rule passes only when the file's actual code line count is strictly less than the defined maximum limit.

- It is NOT OK if the file has lines of code greater than or equal to the threshold
- It is OK if the file has lines of code less than the threshold

This rule promotes:

- Better code readability and comprehension
- Reduced complexity and improved modularity
- Easier code review and debugging processes
- Enhanced testability and maintainability
- Prevention of "god classes" or overly complex files

**Note**: The `shouldNot.haveLocGreaterOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (the file must have LESS than the specified number; equal is considered a violation).

**Note**: The `shouldNot.haveLocGreaterOrEqualThan` accepts a single numeric value as the maximum threshold parameter.

## All Possible Scenarios

- Selected file = one concrete file path (via `inFile(...)`)

**Scenario 1**: File has lines of code LESS than the threshold

- **Result**: ✅ PASS — The file meets the maximum size constraint

**Scenario 2**: File has lines of code GREATER than or EQUAL to the threshold

- **Result**: ❌ FAIL — The file violates the maximum size constraint

## Scenario Examples

### Scenario 1: File has lines of code LESS than the threshold

```
project/
├── src/
│   └── utils/
│       └── StringHelper.ts  // 11 LOC (below threshold 16)
```

**File Content:**

```typescript
// src/utils/StringHelper.ts (11 lines of actual code)
/**
 * String utility helper class
 * Provides common string manipulation methods
 */
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
projectFiles().inFile('**/utils/StringHelper.ts').shouldNot().haveLocGreaterOrEqualThan(16).check();
```

**Result**: ✅ PASS — `StringHelper.ts` has 11 LOC which is < 16

---

### Scenario 2: File has lines of code GREATER than or EQUAL to the threshold

```
project/
├── src/
│   └── services/
│       └── EmailService.ts  // 18 LOC (equals threshold 18)
```

**File Content:**

```typescript
// src/services/EmailService.ts (exactly 18 lines of code — equals threshold)
/**
 * Email service for sending notifications
 */
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

  async sendPasswordResetEmail(user: User, token: string): Promise<boolean> {
    // LOC 11
    const resetTemplate = `Reset your password: ${token}`; // LOC 12
    return await this.sendEmail(user.email, resetTemplate); // LOC 13
  } // LOC 14

  private async sendEmail(to: string, template: string) {
    // LOC 15
    return true; // LOC 16
  } // LOC 17
} // LOC 18
```

**API Usage:**

```typescript
projectFiles()
  .inFile('**/services/EmailService.ts')
  .shouldNot()
  .haveLocGreaterOrEqualThan(18)
  .check();
```

**Result**: ❌ FAIL — `EmailService.ts` has 18 LOC which is ≥ 18 (violates the rule)

---

### Key Difference from `shouldNot.haveLocGreaterThan`:

- **`shouldNot.haveLocGreaterThan(15)`**: File can have ≤ 15 LOC (inclusive maximum)
- **`shouldNot.haveLocGreaterOrEqualThan(15)`**: File must have < 15 LOC (exclusive maximum)

Use `shouldNot.haveLocGreaterOrEqualThan` when you need a strict upper bound that does not allow the selected file to have exactly the threshold number of lines or more.
