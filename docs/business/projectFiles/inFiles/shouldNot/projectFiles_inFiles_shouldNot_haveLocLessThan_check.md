# Project Files in Files Should NOT Have Less L.O.C. (Lines Of Code) Than Specified Value

## Business Rule Description

**DESCRIPTION**: None of the selected files may have fewer lines of code than the specified threshold. The rule passes only when EACH file in the selection has lines of code greater than or equal to the defined limit.

- It is NOT OK if ANY selected file has LOC less than the threshold
- It is OK only if ALL selected files have LOC greater than or equal to the threshold

This rule enforces a minimum implementation size across a set of files, discouraging overly small or trivial modules.

**Note**: The `shouldNot.haveLocLessThan` rule counts only actual code lines, excluding blank lines and comments. The threshold is exclusive for violation: LOC strictly less than the threshold violates the rule; equal is allowed.

**Note**: The `shouldNot.haveLocLessThan` accepts a single numeric value as the minimum threshold parameter.

## All Possible Scenarios

- Selected files = multiple files (via `inFiles([...])`)

**Scenario 1**: All selected files have LOC GREATER than or EQUAL to the threshold

- **Result**: ✅ PASS — The selection meets the minimum size requirement

**Scenario 2**: At least one selected file has LOC LESS than the threshold

- **Result**: ❌ FAIL — The selection violates the minimum size requirement

## Scenario Examples

### Scenario 1: All selected files have LOC ≥ threshold (PASS)

```
project/
├── src/
│   ├── utils/
│   │   ├── StringHelper.ts   // 11 LOC (≥ 10)
│   │   └── DateHelper.ts     // 10 LOC (≥ 10)
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
  .shouldNot()
  .haveLocLessThan(10)
  .check();
```

**Result**: ✅ PASS — Both files are ≥ 10 LOC

---

### Scenario 2: Some files have LOC < threshold (FAIL)

```
project/
├── src/
│   ├── services/
│   │   ├── EmailService.ts   // 10 LOC (< 12) ❌
│   │   └── Notification.ts   // 13 LOC (≥ 12)
```

**File Content (illustrative):**

```typescript
// src/services/EmailService.ts (10 lines of code — below threshold)
export class EmailService {
  private apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  async send(to: string, body: string): Promise<boolean> {
    const template = `...`;
    return Boolean(to && body);
  }
}
```

**API Usage:**

```typescript
await projectFiles()
  .inFiles(['**/services/EmailService.ts', '**/services/Notification.ts'])
  .shouldNot()
  .haveLocLessThan(12)
  .check();
```

**Result**: ❌ FAIL — `EmailService.ts` is 10 LOC (< 12)
