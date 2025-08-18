# Project Files in File Should Have Greater L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: The selected file must have more lines of code than the specified threshold. The rule passes only when the file's actual code line count is above the defined minimum limit.

- It is NOT OK if the file has lines of code less than or equal to the threshold
- It is OK if the file has lines of code greater than the threshold

This rule enforces minimum code complexity and prevents:

- Trivial or placeholder files with insufficient implementation
- Incomplete or stub implementations
- Files that should contain more substantial logic
- Under-developed components that lack proper functionality
- Files that violate minimum implementation standards

**Note**: The `should.haveLocGreaterThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (the file must have GREATER than the specified number, not equal to).

**Note**: The `should.haveLocGreaterThan` accepts a single numeric value as the minimum threshold parameter.

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
        └── EmailService.ts  // 18 LOC (above threshold 15)
```

**File Content:**

```typescript
// src/services/EmailService.ts (18 lines of code - above threshold)
export class EmailService {
  // LOC 1
  private apiKey: string; // LOC 2
  private baseUrl: string; // LOC 3

  constructor(apiKey: string) {
    // LOC 4
    this.apiKey = apiKey; // LOC 5
    this.baseUrl = 'https://email.ex'; // LOC 6
  } // LOC 7

  async sendWelcome(name: string): Promise<boolean> {
    // LOC 8
    const tpl = this.welcomeTemplate(name); // LOC 9
    return await this.dispatch(`${name}@ex.com`, tpl); // LOC 10
  } // LOC 11

  private welcomeTemplate(name: string): string {
    // LOC 12
    return `Welcome ${name}!`; // LOC 13
  } // LOC 14

  private async dispatch(to: string, body: string) {
    // LOC 15
    return Boolean(to && body && this.apiKey && this.baseUrl); // LOC 16
  } // LOC 17
} // LOC 18
```

**API Usage:**

```typescript
projectFiles().inFile('**/services/EmailService.ts').should().haveLocGreaterThan(15).check();
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
export const API = {
  // LOC 1
  BASE_URL: 'https://api.example.com', // LOC 2
  TIMEOUT: 5000, // LOC 3
}; // LOC 4

export const UI = {
  // LOC 5
  PAGE_SIZE: 10, // LOC 6
  THEME: 'light', // LOC 7
}; // LOC 8

export function appName(): string {
  // LOC 9
  return 'SampleApp'; // LOC 10
} // LOC 11

export function isProd(): boolean {
  // LOC 12
  return process.env.NODE_ENV === 'production'; // LOC 13
} // LOC 14

export const VERSION = '1.0.0'; // LOC 15
```

**API Usage:**

```typescript
projectFiles().inFile('**/utils/Constants.ts').should().haveLocGreaterThan(15).check();
```

**Result**: ❌ FAIL — `Constants.ts` has 15 LOC which is not > 15 (equals fails)
