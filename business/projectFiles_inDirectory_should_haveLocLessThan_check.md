# Project Files in Directory Should Have Less L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the directory must have fewer lines of code than the specified threshold. The rule passes only when every file's actual code line count is below the defined limit.

- It is NOT OK if ANY file has lines of code greater than or equal to the threshold
- It is OK if ALL files have lines of code less than the threshold

This rule promotes:

- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `should.haveLocLessThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have LESS than the specified number, not equal to).

**Note**: The `should.haveLocLessThan` accepts a single numeric value as the threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code LESS than the threshold

- **Result**: ✅ PASS - All files meet the size constraint

**Scenario 2**: ANY files have lines of code GREATER than or EQUAL to the threshold

- **Result**: ❌ FAIL - Files violate the size constraint

## Scenario Examples

### Scenario 1: All files have lines of code LESS than the threshold

```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts    // 11 LOC (excluding comments/blank lines)
│   │   ├── DateHelper.ts      // 12 LOC
│   │   └── MathHelper.ts      // 6 LOC
│   └── constants/
│       └── AppConstants.ts    // 4 LOC
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

// src/constants/AppConstants.ts (4 lines of actual code)
// Application configuration constants
export const API_CONFIG = {
  // LOC 1
  BASE_URL: 'https://api.example.com', // LOC 2
  TIMEOUT: 5000, // LOC 3
}; // LOC 4
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').should().haveLocLessThan(15).check();
```

**Result**: ✅ PASS - All files (11, 12, 6, 4 LOC) are less than 15 lines of code

### Scenario 2: ANY files have lines of code GREATER than or EQUAL to the threshold

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 8 LOC
│   │   └── EmailService.ts    // 14 LOC (equal to threshold)
│   ├── components/
│   │   └── DataTable.ts       // 45 LOC (exceeds threshold)
│   └── legacy/
│       └── LegacyProcessor.ts // 78 LOC (exceeds threshold)
```

**File Content:**

```typescript
// src/services/EmailService.ts (exactly 14 lines of code)
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

  private async sendEmail(to: string, template: string) {
    // LOC 11
    // Implementation would go here
    return true; // LOC 12
  } // LOC 13
} // LOC 14

// src/components/DataTable.ts (45 lines of actual code)
export class DataTable {
  // LOC 1
  private data: any[]; // LOC 2
  private currentPage: number = 1; // LOC 3
  // ... 42 more lines of actual code
  // Complex implementation with sorting, filtering, pagination
  // Multiple private methods and extensive state management
} // LOC 45
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').should().haveLocLessThan(14).check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: EmailService.ts (14 LOC - equal to threshold), DataTable.ts (45 LOC), LegacyProcessor.ts (78 LOC)
