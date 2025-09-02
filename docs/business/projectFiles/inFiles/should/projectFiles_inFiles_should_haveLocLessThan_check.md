# Project Files in Files Should Have Less L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: Every selected file must have fewer lines of code than the specified threshold. The rule passes only when EACH file in the selection is strictly below the defined limit.

- It is NOT OK if ANY selected file has lines of code greater than or equal to the threshold
- It is OK only if ALL selected files have lines of code less than the threshold

This rule promotes:

- Better readability and comprehension across modules
- Easier code review and debugging processes
- Reduced complexity and improved modularity
- Enhanced testability and maintainability
- Avoidance of overly complex or monolithic files

**Note**: The `should.haveLocLessThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive (files must have LESS than the specified number, not equal to).

**Note**: The `should.haveLocLessThan` accepts a single numeric value as the threshold parameter.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: All selected files have LOC LESS than the threshold

- **Result**: ✅ PASS — The selection meets the size constraint

**Scenario 2**: At least one selected file has LOC GREATER than or EQUAL to the threshold

- **Result**: ❌ FAIL — The selection violates the size constraint

## Scenario Examples

### Scenario 1: All selected files have LOC < threshold (PASS)

```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts   // 11 LOC (< 12)
│   │   └── DateHelper.ts     // 10 LOC (< 12)
```

**File Content (illustrative):**

```typescript
// src/utils/StringHelper.ts (11 lines of actual code)
export class StringHelper {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  static truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }
  static isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }
}

// src/utils/DateHelper.ts (10 lines of actual code)
export class DateHelper {
  static nowIso(): string {
    return new Date().toISOString();
  }
  static addDays(d: Date, days: number): Date {
    const n = new Date(d);
    n.setDate(n.getDate() + days);
    return n;
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/utils/StringHelper.ts', '**/utils/DateHelper.ts'])
  .should()
  .haveLocLessThan(12)
  .check();
```

**Result**: ✅ PASS — Both files are < 12 LOC

---

### Scenario 2: Some files have LOC ≥ threshold (FAIL)

```
project/
├── src/
│   ├── services/
│   │   ├── EmailService.ts   // 10 LOC (= 10) ❌
│   │   └── Notification.ts   // 8 LOC (< 10)
```

**File Content (illustrative):**

```typescript
// src/services/EmailService.ts (exactly 10 lines of code)
export class EmailService {
  private apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  async send(to: string, body: string): Promise<boolean> {
    const template: string = `...`;
    return Boolean(to && body);
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/EmailService.ts', '**/services/Notification.ts'])
  .should()
  .haveLocLessThan(10)
  .check();
```

**Result**: ❌ FAIL — `EmailService.ts` is 10 LOC (equals threshold, not allowed)

---

### Key Difference from `haveLocLessOrEqualThan`:

- **`should.haveLocLessOrEqualThan(12)`**: Every file can have ≤ 12 LOC (inclusive)
- **`should.haveLocLessThan(12)`**: Every file must have < 12 LOC (exclusive)

Use `haveLocLessThan` when you need a strict upper bound that does not allow selected files to meet the threshold exactly.
