# Project Files in Directory Should NOT Have Greater L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the directory must NOT have more lines of code than the specified threshold. The rule passes only when every file's actual code line count is less than or equal to the defined maximum limit.

- It is NOT OK if ANY file has lines of code greater than the threshold
- It is OK if ALL files have lines of code less than or equal to the threshold

This rule promotes:

- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `shouldNot.haveLocGreaterThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have LESS than or EQUAL to the specified number, not greater than).

**Note**: The `shouldNot.haveLocGreaterThan` accepts a single numeric value as the maximum threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code LESS than or EQUAL to the threshold

- **Result**: ✅ PASS - All files meet the maximum size constraint

**Scenario 2**: ANY files have lines of code GREATER than the threshold

- **Result**: ❌ FAIL - Files violate the maximum size constraint

## Scenario Examples

### Scenario 1: All files have lines of code LESS than or EQUAL to the threshold

```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts    // 11 LOC (below threshold)
│   │   ├── DateHelper.ts      // 12 LOC (below threshold)
│   │   └── MathHelper.ts      // 15 LOC (equals threshold)
│   └── constants/
│       └── AppConstants.ts    // 4 LOC (below threshold)
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

// src/utils/MathHelper.ts (exactly 15 lines of code - equals threshold)
/**
 * Mathematical utility helper class
 */
export class MathHelper {
  // LOC 1
  static add(a: number, b: number): number {
    // LOC 2
    return a + b; // LOC 3
  } // LOC 4

  static subtract(a: number, b: number): number {
    // LOC 5
    return a - b; // LOC 6
  } // LOC 7

  static multiply(a: number, b: number): number {
    // LOC 8
    return a * b; // LOC 9
  } // LOC 10

  static divide(a: number, b: number): number {
    // LOC 11
    if (b === 0) throw new Error('Division by zero'); // LOC 12
    return a / b; // LOC 13
  } // LOC 14
} // LOC 15
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').shouldNot().haveLocGreaterThan(15).check();
```

**Result**: ✅ PASS - All files (11, 12, 15, 4 LOC) are less than or equal to 15 lines of code

### Scenario 2: ANY files have lines of code GREATER than the threshold

```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 8 LOC (below threshold)
│   │   └── EmailService.ts    // 14 LOC (equals threshold)
│   ├── components/
│   │   └── DataTable.ts       // 45 LOC (exceeds threshold)
│   └── legacy/
│       └── LegacyProcessor.ts // 78 LOC (exceeds threshold)
```

**File Content:**

```typescript
// src/services/EmailService.ts (exactly 14 lines of code - equals threshold)
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

// src/components/DataTable.ts (45 lines of actual code - exceeds threshold)
export class DataTable {
  // LOC 1
  private data: any[]; // LOC 2
  private currentPage: number = 1; // LOC 3
  private sortColumn: string | null = null; // LOC 4
  private sortDirection: 'asc' | 'desc' = 'asc'; // LOC 5

  constructor(data: any[]) {
    // LOC 6
    this.data = data; // LOC 7
  } // LOC 8

  // ... 37 more lines of complex table implementation
  // Including sorting, filtering, pagination, rendering logic
  // Multiple private methods for data manipulation
  // Event handlers for user interactions
  // Complex state management
} // LOC 45

// src/legacy/LegacyProcessor.ts (78 lines of actual code - exceeds threshold)
export class LegacyProcessor {
  // LOC 1
  private config: any; // LOC 2
  private cache: Map<string, any> = new Map(); // LOC 3

  constructor(config: any) {
    // LOC 4
    this.config = config; // LOC 5
  } // LOC 6

  // ... 72 more lines of legacy implementation
  // Complex business logic with multiple responsibilities
  // Database operations, file processing, validation
  // Error handling, logging, caching mechanisms
  // Multiple large methods with nested conditions
  // Extensive configuration management
} // LOC 78
```

**API Usage:**

```typescript
projectFiles().inDirectory('**/src/**').shouldNot().haveLocGreaterThan(14).check();
```

**Result**: ❌ FAIL - Multiple files violate the constraint: DataTable.ts (45 LOC), LegacyProcessor.ts (78 LOC) exceed the 14-line maximum

Use `shouldNot.haveLocGreaterThan` when you want to enforce a maximum file size limit to prevent overly complex files and promote better code organization and maintainability.
