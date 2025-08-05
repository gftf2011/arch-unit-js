# Project Files in Directory Should NOT Have Greater Or Equal L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Files in the directory must NOT have more or equal lines of code than the specified threshold. The rule passes only when every file's actual code line count is less than the defined maximum limit.

- It is NOT OK if ANY file has lines of code greater than or equal to the threshold
- It is OK if ALL files have lines of code less than the threshold

This rule promotes:
- Better code readability and comprehension
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Adherence to single responsibility principle
- Prevention of "god classes" or overly complex files

**Note**: The `shouldNot.haveLocGreaterOrEqualThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have LESS than the specified number, not equal to).

**Note**: The `shouldNot.haveLocGreaterOrEqualThan` accepts a single numeric value as the maximum threshold parameter.

## All Possible Scenarios

**Scenario 1**: All files have lines of code LESS than the threshold
- **Result**: ✅ PASS - All files meet the maximum size constraint

**Scenario 2**: ANY files have lines of code GREATER than or EQUAL to the threshold
- **Result**: ❌ FAIL - Files violate the maximum size constraint

## Scenario Examples

### Scenario 1: All files have lines of code LESS than the threshold
```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts    // 11 LOC (below threshold)
│   │   ├── DateHelper.ts      // 12 LOC (below threshold)
│   │   └── MathHelper.ts      // 15 LOC (below threshold)
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
export class StringHelper {                                   // LOC 1
  static capitalize(str: string): string {                   // LOC 2
    return str.charAt(0).toUpperCase() + str.slice(1);       // LOC 3
  }                                                           // LOC 4

  static truncate(str: string, length: number): string {     // LOC 5
    return str.length > length ? str.substring(0, length) + '...' : str; // LOC 6
  }                                                           // LOC 7

  static isEmpty(str: string): boolean {                      // LOC 8
    return !str || str.trim().length === 0;                   // LOC 9
  }                                                           // LOC 10
}                                                             // LOC 11

// src/utils/MathHelper.ts (14 lines of actual code - below threshold)
/**
 * Mathematical utility helper class
 */
export class MathHelper {                                     // LOC 1
  static add(a: number, b: number): number {                 // LOC 2
    return a + b;                                             // LOC 3
  }                                                           // LOC 4

  static subtract(a: number, b: number): number {            // LOC 5
    return a - b;                                             // LOC 6
  }                                                           // LOC 7

  static multiply(a: number, b: number): number {            // LOC 8
    return a * b;                                             // LOC 9
  }                                                           // LOC 10

  static divide(a: number, b: number): number {              // LOC 11
    if (b === 0) throw new Error('Division by zero');        // LOC 12
    return a / b;                                             // LOC 13
  }                                                           // LOC 14
}                                                             // LOC 15
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/src/**')
  .shouldNot()
  .haveLocGreaterOrEqualThan(16)
  .check()
```

**Result**: ✅ PASS - All files (8, 12, 14, 4 LOC) are less than 16 lines of code

### Scenario 2: ANY files have lines of code GREATER than or EQUAL to the threshold
```
project/
├── src/
│   ├── services/
│   │   ├── UserService.ts     // 8 LOC (below threshold)
│   │   └── EmailService.ts    // 18 LOC (equals threshold)
│   ├── components/
│   │   └── DataTable.ts       // 47 LOC (exceeds threshold)
│   └── legacy/
│       └── LegacyProcessor.ts // 78 LOC (exceeds threshold)
```

**File Content:**
```typescript
// src/services/EmailService.ts (exactly 18 lines of code - equals threshold)
/**
 * Email service for sending notifications
 */
import { User } from '../models/User';                       // LOC 1

export class EmailService {                                  // LOC 2
  private apiKey: string;                                    // LOC 3

  constructor(apiKey: string) {                              // LOC 4
    this.apiKey = apiKey;                                    // LOC 5
  }                                                          // LOC 6

  async sendWelcomeEmail(user: User): Promise<boolean> {     // LOC 7
    const template = `Welcome ${user.name}!`;                // LOC 8
    return await this.sendEmail(user.email, template);       // LOC 9
  }                                                          // LOC 10

  async sendPasswordResetEmail(user: User, token: string): Promise<boolean> { // LOC 11
    const resetTemplate = `Reset your password: ${token}`;  // LOC 12
    return await this.sendEmail(user.email, resetTemplate); // LOC 13
  }                                                         // LOC 14

  private async sendEmail(to: string, template: string) {   // LOC 15
    return true;                                            // LOC 16
  }                                                         // LOC 17
}                                                           // LOC 18

// src/components/DataTable.ts (47 lines of actual code - exceeds threshold)
export class DataTable {                                    // LOC 1
  private data: any[];                                       // LOC 2
  private currentPage: number = 1;                           // LOC 3
  private sortColumn: string | null = null;                 // LOC 4
  private sortDirection: 'asc' | 'desc' = 'asc';            // LOC 5
  private itemsPerPage: number = 10;                        // LOC 6
  
  constructor(data: any[]) {                                 // LOC 7
    this.data = data;                                        // LOC 8
  }                                                          // LOC 9

  setPage(page: number): void {                              // LOC 10
    this.currentPage = page;                                 // LOC 11
  }                                                          // LOC 12

  sort(column: string): void {                               // LOC 13
    if (this.sortColumn === column) {                        // LOC 14
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; // LOC 15
    } else {                                                 // LOC 16
      this.sortColumn = column;                              // LOC 17
      this.sortDirection = 'asc';                            // LOC 18
    }                                                        // LOC 19
    this.applySorting();                                     // LOC 20
  }                                                          // LOC 21

  private applySorting(): void {                             // LOC 22
    this.data.sort((a, b) => {                               // LOC 23
      const aVal = a[this.sortColumn!];                      // LOC 24
      const bVal = b[this.sortColumn!];                      // LOC 25
      const multiplier = this.sortDirection === 'asc' ? 1 : -1; // LOC 26
      return aVal > bVal ? multiplier : -multiplier;        // LOC 27
    });                                                      // LOC 28
  }                                                          // LOC 29

  filter(predicate: (item: any) => boolean): any[] {        // LOC 30
    return this.data.filter(predicate);                     // LOC 31
  }                                                          // LOC 32

  getCurrentPageData(): any[] {                             // LOC 33
    const startIndex = (this.currentPage - 1) * this.itemsPerPage; // LOC 34
    const endIndex = startIndex + this.itemsPerPage;        // LOC 35
    return this.data.slice(startIndex, endIndex);           // LOC 36
  }                                                          // LOC 37

  getTotalPages(): number {                                  // LOC 38
    return Math.ceil(this.data.length / this.itemsPerPage); // LOC 39
  }                                                          // LOC 40

  getItemCount(): number {                                   // LOC 41
    return this.data.length;                                 // LOC 42
  }                                                          // LOC 43

  reset(): void {                                            // LOC 44
    this.currentPage = 1;                                    // LOC 45
  }                                                          // LOC 46
}                                                            // LOC 47

// src/legacy/LegacyProcessor.ts (78 lines of actual code - exceeds threshold)
export class LegacyProcessor {                              // LOC 1
  private config: any;                                       // LOC 2
  private cache: Map<string, any> = new Map();              // LOC 3
  private logger: any;                                       // LOC 4
  
  constructor(config: any) {                                 // LOC 5
    this.config = config;                                    // LOC 6
    this.logger = console;                                   // LOC 7
  }                                                          // LOC 8

  // ... 70 more lines of legacy implementation
  // Complex business logic with multiple responsibilities
  // Database operations, file processing, validation
  // Error handling, logging, caching mechanisms
  // Multiple large methods with nested conditions
  // Extensive configuration management
  // Data transformation and formatting
  // Event handling and notifications
  // Performance monitoring and metrics
  // Security validation and authorization
  // Integration with multiple external services
}                                                            // LOC 78
```

**API Usage:**
```typescript
projectFiles()
  .inDirectory('**/src/**')
  .shouldNot()
  .haveLocGreaterOrEqualThan(18)
  .check()
```

**Result**: ❌ FAIL - Multiple files violate the constraint: EmailService.ts (18 LOC - equals threshold), DataTable.ts (47 LOC), LegacyProcessor.ts (78 LOC) are greater than or equal to the 18-line maximum

### Key Difference from `shouldNot.haveLocGreaterThan`:
- **`shouldNot.haveLocGreaterThan(15)`**: Files can have ≤ 15 LOC (inclusive maximum)
- **`shouldNot.haveLocGreaterOrEqualThan(15)`**: Files must have < 15 LOC (exclusive maximum)

Use `shouldNot.haveLocGreaterOrEqualThan` when you want to enforce a strict maximum where files cannot have exactly the threshold number of lines or more, making it more restrictive than the inclusive `shouldNot.haveLocGreaterThan` rule.